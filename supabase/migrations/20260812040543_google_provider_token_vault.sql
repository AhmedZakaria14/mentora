create extension if not exists http with schema extensions;

create or replace function public.store_google_provider_tokens(
  p_access_token text,
  p_refresh_token text default null,
  p_features text[] default array['calendar','meet','chat']::text[],
  p_scopes text[] default array[]::text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_email text;
  v_existing_refresh text;
begin
  if v_user is null then raise exception 'authentication_required' using errcode = '28000'; end if;
  if nullif(trim(p_access_token), '') is null then raise exception 'access_token_required' using errcode = '22023'; end if;

  select email into v_email from auth.users where id = v_user;
  select refresh_token into v_existing_refresh from public.google_connections where user_id = v_user;

  insert into public.google_connections (
    user_id, google_subject, google_email, access_token, refresh_token,
    expires_at, token_type, granted_scopes, enabled_features, updated_at
  ) values (
    v_user, v_user::text, v_email, p_access_token,
    coalesce(nullif(p_refresh_token, ''), v_existing_refresh),
    now() + interval '50 minutes', 'Bearer', coalesce(p_scopes, array[]::text[]),
    coalesce(p_features, array[]::text[]), now()
  )
  on conflict (user_id) do update set
    google_email = excluded.google_email,
    access_token = excluded.access_token,
    refresh_token = coalesce(excluded.refresh_token, public.google_connections.refresh_token),
    expires_at = excluded.expires_at,
    token_type = 'Bearer',
    granted_scopes = case when cardinality(excluded.granted_scopes) > 0 then excluded.granted_scopes else public.google_connections.granted_scopes end,
    enabled_features = excluded.enabled_features,
    updated_at = now();
end;
$$;

create or replace function public.get_google_connection_summary()
returns table (connected boolean, google_email text, enabled_features text[], granted_scopes text[], updated_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select true, g.google_email, g.enabled_features, g.granted_scopes, g.updated_at
  from public.google_connections g where g.user_id = auth.uid();
$$;

create or replace function public.disconnect_google_connection()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode = '28000'; end if;
  delete from public.google_connections where user_id = auth.uid();
end;
$$;

create or replace function public.get_valid_google_access_token()
returns text
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  v_user uuid := auth.uid();
  v_access text;
  v_refresh text;
  v_expires timestamptz;
  v_client_id text;
  v_client_secret text;
  v_response extensions.http_response;
  v_json jsonb;
  v_new_access text;
  v_new_refresh text;
  v_expires_in int;
begin
  if v_user is null then raise exception 'authentication_required' using errcode = '28000'; end if;

  select access_token, refresh_token, expires_at into v_access, v_refresh, v_expires
  from public.google_connections where user_id = v_user;

  if v_access is null then raise exception 'google_not_connected' using errcode = '55000'; end if;
  if v_expires > now() + interval '2 minutes' then return v_access; end if;
  if nullif(v_refresh, '') is null then raise exception 'google_reauthorization_required' using errcode = '55000'; end if;

  select decrypted_secret into v_client_id from vault.decrypted_secrets where name = 'mentora_google_client_id' limit 1;
  select decrypted_secret into v_client_secret from vault.decrypted_secrets where name = 'mentora_google_client_secret' limit 1;
  if v_client_id is null or v_client_secret is null then raise exception 'google_server_credentials_missing' using errcode = '55000'; end if;

  select * into v_response
  from extensions.http_post(
    'https://oauth2.googleapis.com/token',
    extensions.urlencode(jsonb_build_object(
      'client_id', v_client_id,
      'client_secret', v_client_secret,
      'refresh_token', v_refresh,
      'grant_type', 'refresh_token'
    )),
    'application/x-www-form-urlencoded'
  );

  if v_response.status < 200 or v_response.status >= 300 then raise exception 'google_token_refresh_failed' using errcode = '58000'; end if;
  v_json := v_response.content::jsonb;
  v_new_access := v_json ->> 'access_token';
  v_new_refresh := v_json ->> 'refresh_token';
  v_expires_in := coalesce((v_json ->> 'expires_in')::int, 3600);
  if nullif(v_new_access, '') is null then raise exception 'google_token_refresh_invalid_response' using errcode = '58000'; end if;

  update public.google_connections
  set access_token = v_new_access,
      refresh_token = coalesce(nullif(v_new_refresh, ''), refresh_token),
      expires_at = now() + make_interval(secs => greatest(v_expires_in - 60, 60)),
      updated_at = now()
  where user_id = v_user;

  return v_new_access;
end;
$$;

revoke all on function public.store_google_provider_tokens(text,text,text[],text[]) from public, anon;
revoke all on function public.get_google_connection_summary() from public, anon;
revoke all on function public.disconnect_google_connection() from public, anon;
revoke all on function public.get_valid_google_access_token() from public, anon;
grant execute on function public.store_google_provider_tokens(text,text,text[],text[]) to authenticated;
grant execute on function public.get_google_connection_summary() to authenticated;
grant execute on function public.disconnect_google_connection() to authenticated;
grant execute on function public.get_valid_google_access_token() to authenticated;

-- Production secrets referenced above are intentionally NOT committed.
-- Store them using Supabase Vault names:
-- mentora_google_client_id
-- mentora_google_client_secret
