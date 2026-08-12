-- Prevent users from escalating their own platform role through the profiles update policy.
create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and current_user not in ('postgres', 'service_role', 'supabase_admin') then
    raise exception 'role_change_not_allowed' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role_change on public.profiles;
create trigger guard_profile_role_change
before update of role on public.profiles
for each row execute function public.guard_profile_role_change();

-- One application per user keeps the review lifecycle deterministic.
alter table public.mentor_applications
  add constraint mentor_applications_user_unique unique (user_id);

-- Applications are readable by their owner, but writes go only through the safe RPC below.
drop policy if exists "application owner" on public.mentor_applications;
create policy "application owner read" on public.mentor_applications
for select using (auth.uid() = user_id);

create or replace function public.submit_mentor_application(p_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_id uuid;
  v_existing_status public.application_status;
  v_years int := coalesce((p_data ->> 'years_experience')::int, 0);
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  if nullif(trim(coalesce(p_data ->> 'headline', '')), '') is null then
    raise exception 'headline_required' using errcode = '22023';
  end if;

  if v_years < 0 or v_years > 80 then
    raise exception 'invalid_years_experience' using errcode = '22023';
  end if;

  select status into v_existing_status
  from public.mentor_applications
  where user_id = v_user;

  if v_existing_status in ('approved', 'suspended') then
    raise exception 'application_not_editable' using errcode = '55000';
  end if;

  insert into public.mentor_applications (
    user_id, status, headline, bio, years_experience,
    current_company, current_title, linkedin_url, website_url,
    portfolio_url, intro_video_url, why_mentor, submitted_at, updated_at
  ) values (
    v_user, 'submitted', left(trim(p_data ->> 'headline'), 180),
    nullif(trim(p_data ->> 'bio'), ''), v_years,
    nullif(trim(p_data ->> 'current_company'), ''),
    nullif(trim(p_data ->> 'current_title'), ''),
    nullif(trim(p_data ->> 'linkedin_url'), ''),
    nullif(trim(p_data ->> 'website_url'), ''),
    nullif(trim(p_data ->> 'portfolio_url'), ''),
    nullif(trim(p_data ->> 'intro_video_url'), ''),
    nullif(trim(p_data ->> 'why_mentor'), ''),
    now(), now()
  )
  on conflict (user_id) do update set
    status = 'submitted',
    headline = excluded.headline,
    bio = excluded.bio,
    years_experience = excluded.years_experience,
    current_company = excluded.current_company,
    current_title = excluded.current_title,
    linkedin_url = excluded.linkedin_url,
    website_url = excluded.website_url,
    portfolio_url = excluded.portfolio_url,
    intro_video_url = excluded.intro_video_url,
    why_mentor = excluded.why_mentor,
    submitted_at = now(),
    updated_at = now()
  returning id into v_id;

  update public.profiles
  set role = case when role = 'learner' then 'mentor_applicant' else role end,
      updated_at = now()
  where id = v_user;

  return v_id;
end;
$$;

grant execute on function public.submit_mentor_application(jsonb) to authenticated;

-- Replace the hold function so it can insert behind RLS while validating every business invariant.
create or replace function public.create_booking_hold(
  p_mentor_id uuid,
  p_service_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_hold_minutes int default 10
)
returns public.booking_holds
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user uuid := auth.uid();
  v_hold public.booking_holds;
  v_service public.mentor_services%rowtype;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  if v_user = p_mentor_id then
    raise exception 'cannot_book_yourself' using errcode = '22023';
  end if;

  if p_ends_at <= p_starts_at then
    raise exception 'invalid_time_range' using errcode = '22007';
  end if;

  if p_hold_minutes < 1 or p_hold_minutes > 30 then
    raise exception 'invalid_hold_duration' using errcode = '22023';
  end if;

  select s.* into v_service
  from public.mentor_services s
  join public.mentor_profiles m on m.user_id = s.mentor_id
  where s.id = p_service_id
    and s.mentor_id = p_mentor_id
    and s.active = true
    and m.active = true;

  if not found then
    raise exception 'service_unavailable' using errcode = '22023';
  end if;

  if p_ends_at <> p_starts_at + make_interval(mins => v_service.duration_minutes) then
    raise exception 'invalid_service_duration' using errcode = '22023';
  end if;

  if p_starts_at < now() + make_interval(mins => v_service.booking_notice_minutes) then
    raise exception 'booking_notice_not_met' using errcode = '22023';
  end if;

  if p_starts_at > now() + make_interval(days => v_service.max_advance_days) then
    raise exception 'outside_booking_window' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_mentor_id::text, 0));

  delete from public.booking_holds
  where mentor_id = p_mentor_id and expires_at <= now();

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
