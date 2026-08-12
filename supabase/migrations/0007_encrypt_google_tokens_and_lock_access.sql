alter table public.google_connections
  add column if not exists access_token_cipher bytea,
  add column if not exists refresh_token_cipher bytea;

do $$
declare
  v_key text;
begin
  select decrypted_secret into v_key
  from vault.decrypted_secrets
  where name = 'mentora_google_token_encryption_key'
  limit 1;

  if v_key is null then
    raise exception 'google_token_encryption_key_missing';
  end if;

  update public.google_connections
  set access_token_cipher = case
        when access_token_cipher is not null then access_token_cipher
        else extensions.pgp_sym_encrypt(access_token, v_key, 'cipher-algo=aes256')
      end,
      refresh_token_cipher = case
        when refresh_token_cipher is not null then refresh_token_cipher
        when refresh_token is not null then extensions.pgp_sym_encrypt(refresh_token, v_key, 'cipher-algo=aes256')
        else null
      end;
end $$;

alter table public.google_connections
  alter column access_token_cipher set not null;

alter table public.google_connections
  drop column if exists access_token,
  drop column if exists refresh_token;

create or replace function public.store_google_provider_tokens(
  p_access_token text,
  p_refresh_token text default null,
  p_features text[] default array['calendar','meet','chat']::text[],
  p_scopes text[] default array[]::text[]
)
returns void
language plpgsql
security definer
set search_path = 'public', 'extensions', 'vault', 'auth'
as $$
declare
  v_user uuid := auth.uid();
  v_google_subject text;
  v_email text;
  v_key text;
  v_existing_refresh bytea;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;
  if nullif(trim(p_access_token), '') is null then
    raise exception 'access_token_required' using errcode = '22023';
  end if;

  select i.provider_id, coalesce(i.email, i.identity_data->>'email', u.email)
    into v_google_subject, v_email
  from auth.users u
  left join lateral (
    select provider_id, email, identity_data
    from auth.identities
    where user_id = u.id and provider = 'google'
    order by updated_at desc nulls last, created_at desc
    limit 1
  ) i on true
  where u.id = v_user;

  if v_google_subject is null then
    raise exception 'google_identity_required' using errcode = '55000';
  end if;

  select decrypted_secret into v_key
  from vault.decrypted_secrets
  where name = 'mentora_google_token_encryption_key'
  limit 1;

  if v_key is null then
    raise exception 'google_token_encryption_key_missing' using errcode = '55000';
  end if;

  select refresh_token_cipher into v_existing_refresh
  from public.google_connections
  where user_id = v_user;

  insert into public.google_connections (
    user_id, google_subject, google_email,
    access_token_cipher, refresh_token_cipher,
    expires_at, token_type, granted_scopes, enabled_features, updated_at
  ) values (
    v_user,
    v_google_subject,
    v_email,
    extensions.pgp_sym_encrypt(p_access_token, v_key, 'cipher-algo=aes256'),
    case
      when nullif(p_refresh_token, '') is not null then extensions.pgp_sym_encrypt(p_refresh_token, v_key, 'cipher-algo=aes256')
      else v_existing_refresh
    end,
    now() + interval '50 minutes',
    'Bearer',
    coalesce(p_scopes, array[]::text[]),
    coalesce(p_features, array[]::text[]),
    now()
  )
  on conflict (user_id) do update set
    google_subject = excluded.google_subject,
    google_email = excluded.google_email,
    access_token_cipher = excluded.access_token_cipher,
    refresh_token_cipher = coalesce(excluded.refresh_token_cipher, public.google_connections.refresh_token_cipher),
    expires_at = excluded.expires_at,
    token_type = 'Bearer',
    granted_scopes = case
      when cardinality(excluded.granted_scopes) > 0 then excluded.granted_scopes
      else public.google_connections.granted_scopes
    end,
    enabled_features = excluded.enabled_features,
    updated_at = now();
end;
$$;

revoke all on function public.store_google_provider_tokens(text,text,text[],text[]) from public, anon;
grant execute on function public.store_google_provider_tokens(text,text,text[],text[]) to authenticated, service_role;

drop function if exists public.get_valid_google_access_token();

create or replace function public.get_valid_google_access_token_for_user(p_user uuid)
returns text
language plpgsql
security definer
set search_path = 'public', 'extensions', 'vault'
as $$
declare
  v_access_cipher bytea;
  v_refresh_cipher bytea;
  v_access text;
  v_refresh text;
  v_expires timestamptz;
  v_client_id text;
  v_client_secret text;
  v_token_key text;
  v_response extensions.http_response;
  v_json jsonb;
  v_new_access text;
  v_new_refresh text;
  v_expires_in int;
begin
  if p_user is null then
    raise exception 'user_required' using errcode = '22023';
  end if;

  select access_token_cipher, refresh_token_cipher, expires_at
    into v_access_cipher, v_refresh_cipher, v_expires
  from public.google_connections
  where user_id = p_user;

  if v_access_cipher is null then
    raise exception 'google_not_connected' using errcode = '55000';
  end if;

  select decrypted_secret into v_token_key
  from vault.decrypted_secrets where name = 'mentora_google_token_encryption_key' limit 1;

  if v_token_key is null then
    raise exception 'google_token_encryption_key_missing' using errcode = '55000';
  end if;

  v_access := extensions.pgp_sym_decrypt(v_access_cipher, v_token_key);

  if v_expires > now() + interval '2 minutes' then
    return v_access;
  end if;

  if v_refresh_cipher is null then
    raise exception 'google_reauthorization_required' using errcode = '55000';
  end if;
  v_refresh := extensions.pgp_sym_decrypt(v_refresh_cipher, v_token_key);

  select decrypted_secret into v_client_id
  from vault.decrypted_secrets where name = 'mentora_google_client_id' limit 1;
  select decrypted_secret into v_client_secret
  from vault.decrypted_secrets where name = 'mentora_google_client_secret' limit 1;

  if v_client_id is null or v_client_secret is null then
    raise exception 'google_server_credentials_missing' using errcode = '55000';
  end if;

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

  if v_response.status < 200 or v_response.status >= 300 then
    raise exception 'google_token_refresh_failed' using errcode = '58000';
  end if;

  v_json := v_response.content::jsonb;
  v_new_access := v_json ->> 'access_token';
  v_new_refresh := v_json ->> 'refresh_token';
  v_expires_in := coalesce((v_json ->> 'expires_in')::int, 3600);

  if nullif(v_new_access, '') is null then
    raise exception 'google_token_refresh_invalid_response' using errcode = '58000';
  end if;

  update public.google_connections
  set access_token_cipher = extensions.pgp_sym_encrypt(v_new_access, v_token_key, 'cipher-algo=aes256'),
      refresh_token_cipher = case
        when nullif(v_new_refresh, '') is not null then extensions.pgp_sym_encrypt(v_new_refresh, v_token_key, 'cipher-algo=aes256')
        else refresh_token_cipher
      end,
      expires_at = now() + make_interval(secs => greatest(v_expires_in - 60, 60)),
      updated_at = now()
  where user_id = p_user;

  return v_new_access;
end;
$$;

revoke all on function public.get_valid_google_access_token_for_user(uuid) from public, anon, authenticated;
grant execute on function public.get_valid_google_access_token_for_user(uuid) to service_role;
