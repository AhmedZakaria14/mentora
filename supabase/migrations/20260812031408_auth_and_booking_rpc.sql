-- Bootstrap a platform profile whenever a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, locale, timezone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(new.raw_user_meta_data ->> 'locale', 'ar'),
    'Africa/Cairo'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Atomic booking hold creation. Serializes competing requests per mentor,
-- rejects overlaps with active bookings and existing unexpired holds.
create or replace function public.create_booking_hold(
  p_mentor_id uuid,
  p_service_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_hold_minutes int default 10
)
returns public.booking_holds
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_hold public.booking_holds;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  if p_ends_at <= p_starts_at then
    raise exception 'invalid_time_range' using errcode = '22007';
  end if;

  if p_hold_minutes < 1 or p_hold_minutes > 30 then
    raise exception 'invalid_hold_duration' using errcode = '22023';
  end if;

  -- Transaction-scoped lock derived from mentor UUID text.
  perform pg_advisory_xact_lock(hashtextextended(p_mentor_id::text, 0));

  delete from public.booking_holds where expires_at <= now();

  if exists (
    select 1 from public.bookings b
    where b.mentor_id = p_mentor_id
      and b.status in ('confirmed','rescheduled')
      and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_starts_at, p_ends_at, '[)')
  ) then
    raise exception 'slot_unavailable' using errcode = '23P01';
  end if;

  if exists (
    select 1 from public.booking_holds h
    where h.mentor_id = p_mentor_id
      and h.expires_at > now()
      and tstzrange(h.starts_at, h.ends_at, '[)') && tstzrange(p_starts_at, p_ends_at, '[)')
  ) then
    raise exception 'slot_temporarily_held' using errcode = '23P01';
  end if;

  insert into public.booking_holds (
    learner_id, mentor_id, service_id, starts_at, ends_at, expires_at
  ) values (
    v_user, p_mentor_id, p_service_id, p_starts_at, p_ends_at,
    now() + make_interval(mins => p_hold_minutes)
  ) returning * into v_hold;

  return v_hold;
end;
$$;

grant execute on function public.create_booking_hold(uuid, uuid, timestamptz, timestamptz, int) to authenticated;

-- Allow authenticated learners to read only their own holds; creation goes through RPC.
drop policy if exists "holds learner read" on public.booking_holds;
create policy "holds participant read" on public.booking_holds for select
using (auth.uid() = learner_id or auth.uid() = mentor_id);
