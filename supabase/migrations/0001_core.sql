-- Mentora core marketplace schema
create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create type public.user_role as enum ('learner','mentor_applicant','mentor','admin','support');
create type public.application_status as enum ('draft','submitted','under_review','interview_requested','more_information_required','approved','rejected','suspended');
create type public.booking_status as enum ('slot_held','awaiting_payment','confirmed','rescheduled','canceled','completed','no_show','refund_pending','refunded','disputed');
create type public.ledger_direction as enum ('credit','debit');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'learner',
  full_name text,
  avatar_url text,
  phone text,
  country_code text,
  city text,
  timezone text not null default 'Africa/Cairo',
  locale text not null default 'ar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.application_status not null default 'draft',
  headline text,
  bio text,
  years_experience int check(years_experience >= 0),
  current_company text,
  current_title text,
  linkedin_url text,
  website_url text,
  portfolio_url text,
  intro_video_url text,
  why_mentor text,
  admin_notes text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentor_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  slug text unique not null,
  headline text not null,
  short_bio text,
  long_bio text,
  verified boolean not null default false,
  active boolean not null default false,
  years_experience int default 0,
  languages text[] not null default array['ar']::text[],
  rating numeric(3,2) not null default 0,
  completed_sessions int not null default 0,
  response_minutes int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (id uuid primary key default gen_random_uuid(), slug text unique not null, name_ar text not null, name_en text not null, active boolean default true, created_at timestamptz default now());
create table public.skills (id uuid primary key default gen_random_uuid(), slug text unique not null, name_ar text not null, name_en text not null, category_id uuid references public.categories(id) on delete set null, created_at timestamptz default now());
create table public.mentor_skills (mentor_id uuid references public.mentor_profiles(user_id) on delete cascade, skill_id uuid references public.skills(id) on delete cascade, primary key(mentor_id,skill_id));

create table public.mentor_services (
  id uuid primary key default gen_random_uuid(), mentor_id uuid not null references public.mentor_profiles(user_id) on delete cascade,
  title text not null, slug text not null, description text, duration_minutes int not null check(duration_minutes between 15 and 240),
  price_minor bigint not null check(price_minor >= 0), currency char(3) not null, active boolean not null default true,
  booking_notice_minutes int not null default 120, buffer_before_minutes int not null default 10, buffer_after_minutes int not null default 10,
  max_advance_days int not null default 60, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(mentor_id,slug)
);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(), mentor_id uuid not null references public.mentor_profiles(user_id) on delete cascade,
  weekday int not null check(weekday between 0 and 6), start_local time not null, end_local time not null,
  timezone text not null, active boolean not null default true, created_at timestamptz default now(), check(end_local > start_local)
);
create table public.availability_exceptions (
  id uuid primary key default gen_random_uuid(), mentor_id uuid not null references public.mentor_profiles(user_id) on delete cascade,
  starts_at timestamptz not null, ends_at timestamptz not null, available boolean not null default false, reason text,
  check(ends_at > starts_at)
);

create table public.booking_holds (
  id uuid primary key default gen_random_uuid(), learner_id uuid not null references public.profiles(id), mentor_id uuid not null references public.mentor_profiles(user_id),
  service_id uuid not null references public.mentor_services(id), starts_at timestamptz not null, ends_at timestamptz not null,
  expires_at timestamptz not null, created_at timestamptz not null default now(), check(ends_at > starts_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(), learner_id uuid not null references public.profiles(id), mentor_id uuid not null references public.mentor_profiles(user_id),
  service_id uuid references public.mentor_services(id) on delete set null, status public.booking_status not null default 'awaiting_payment',
  starts_at timestamptz not null, ends_at timestamptz not null, timezone text not null,
  mentor_name_snapshot text not null, service_name_snapshot text not null, duration_minutes_snapshot int not null,
  gross_minor bigint not null, discount_minor bigint not null default 0, tax_minor bigint not null default 0, processor_fee_minor bigint not null default 0,
  commission_bps int not null, platform_minor bigint not null, mentor_minor bigint not null, currency char(3) not null,
  cancellation_policy_snapshot jsonb not null default '{}'::jsonb,
  google_calendar_event_id text, google_calendar_id text, google_meet_url text, google_conference_id text, google_chat_space_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check(ends_at > starts_at)
);

-- Database-level protection against overlapping active mentor bookings.
alter table public.bookings add constraint bookings_no_active_overlap exclude using gist (
  mentor_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
) where (status in ('confirmed','rescheduled'));

create table public.booking_status_history (id bigserial primary key, booking_id uuid not null references public.bookings(id) on delete cascade, from_status public.booking_status, to_status public.booking_status not null, actor_id uuid references public.profiles(id), reason text, created_at timestamptz default now());
create table public.payments (id uuid primary key default gen_random_uuid(), booking_id uuid references public.bookings(id), user_id uuid not null references public.profiles(id), provider text not null, provider_payment_id text, idempotency_key text unique not null, amount_minor bigint not null, currency char(3) not null, status text not null, raw_payload jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
create table public.credit_ledger (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), direction public.ledger_direction not null, amount int not null check(amount>0), reason text not null, reference_type text, reference_id uuid, expires_at timestamptz, created_at timestamptz default now());
create table public.mentor_earnings_ledger (id uuid primary key default gen_random_uuid(), mentor_id uuid not null references public.mentor_profiles(user_id), booking_id uuid references public.bookings(id), amount_minor bigint not null, currency char(3) not null, status text not null default 'pending', available_at timestamptz, created_at timestamptz default now());
create table public.reviews (id uuid primary key default gen_random_uuid(), booking_id uuid not null unique references public.bookings(id), learner_id uuid not null references public.profiles(id), mentor_id uuid not null references public.mentor_profiles(user_id), rating int not null check(rating between 1 and 5), body text, private_feedback text, created_at timestamptz default now(), updated_at timestamptz default now());
create table public.favorites (learner_id uuid references public.profiles(id) on delete cascade, mentor_id uuid references public.mentor_profiles(user_id) on delete cascade, created_at timestamptz default now(), primary key(learner_id,mentor_id));
create table public.conversations (id uuid primary key default gen_random_uuid(), booking_id uuid references public.bookings(id), mentor_id uuid not null references public.mentor_profiles(user_id), learner_id uuid not null references public.profiles(id), google_chat_space_id text, created_at timestamptz default now());
create table public.messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade, sender_id uuid not null references public.profiles(id), body text not null, system_message boolean default false, read_at timestamptz, created_at timestamptz default now());
create table public.session_summaries (id uuid primary key default gen_random_uuid(), booking_id uuid not null unique references public.bookings(id) on delete cascade, objective text, overview text, key_insights jsonb default '[]', decisions jsonb default '[]', action_items jsonb default '[]', resources jsonb default '[]', next_session_suggestion text, ai_generated boolean default false, model text, created_at timestamptz default now(), updated_at timestamptz default now());
create table public.audit_logs (id bigserial primary key, actor_id uuid references public.profiles(id), action text not null, entity_type text not null, entity_id text, before_data jsonb, after_data jsonb, reason text, created_at timestamptz default now());

alter table public.profiles enable row level security;
alter table public.mentor_applications enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentor_services enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

create policy "profiles self read" on public.profiles for select using (auth.uid()=id);
create policy "profiles self update" on public.profiles for update using (auth.uid()=id);
create policy "public active mentors" on public.mentor_profiles for select using (active=true or auth.uid()=user_id);
create policy "public active services" on public.mentor_services for select using (active=true or auth.uid()=mentor_id);
create policy "application owner" on public.mentor_applications for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "booking participants read" on public.bookings for select using (auth.uid()=learner_id or auth.uid()=mentor_id);
create policy "message participants read" on public.messages for select using (exists(select 1 from public.conversations c where c.id=conversation_id and (c.learner_id=auth.uid() or c.mentor_id=auth.uid())));
create policy "review public read" on public.reviews for select using (true);
create policy "favorites owner" on public.favorites for all using (auth.uid()=learner_id) with check (auth.uid()=learner_id);
