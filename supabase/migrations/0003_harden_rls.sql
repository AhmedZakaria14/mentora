-- Harden all public tables with RLS before exposing the API.
alter table public.categories enable row level security;
alter table public.skills enable row level security;
alter table public.mentor_skills enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_exceptions enable row level security;
alter table public.booking_holds enable row level security;
alter table public.booking_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.mentor_earnings_ledger enable row level security;
alter table public.conversations enable row level security;
alter table public.session_summaries enable row level security;
alter table public.audit_logs enable row level security;

create policy "categories public read" on public.categories for select using (active = true);
create policy "skills public read" on public.skills for select using (true);
create policy "mentor skills public read" on public.mentor_skills for select using (true);

create policy "availability mentor read" on public.availability_rules for select using (auth.uid() = mentor_id);
create policy "availability mentor manage" on public.availability_rules for all using (auth.uid() = mentor_id) with check (auth.uid() = mentor_id);
create policy "exceptions mentor read" on public.availability_exceptions for select using (auth.uid() = mentor_id);
create policy "exceptions mentor manage" on public.availability_exceptions for all using (auth.uid() = mentor_id) with check (auth.uid() = mentor_id);

create policy "holds learner read" on public.booking_holds for select using (auth.uid() = learner_id or auth.uid() = mentor_id);
create policy "status history participants read" on public.booking_status_history for select using (
  exists(select 1 from public.bookings b where b.id = booking_id and (b.learner_id = auth.uid() or b.mentor_id = auth.uid()))
);
create policy "payments owner read" on public.payments for select using (auth.uid() = user_id);
create policy "credits owner read" on public.credit_ledger for select using (auth.uid() = user_id);
create policy "mentor earnings owner read" on public.mentor_earnings_ledger for select using (auth.uid() = mentor_id);

create policy "conversations participants read" on public.conversations for select using (auth.uid() = learner_id or auth.uid() = mentor_id);
create policy "session summaries participants read" on public.session_summaries for select using (
  exists(select 1 from public.bookings b where b.id = booking_id and (b.learner_id = auth.uid() or b.mentor_id = auth.uid()))
);

-- These are intentionally server-only. No browser RLS policies are created.
-- public.audit_logs
-- public.google_connections

create schema if not exists extensions;
alter extension btree_gist set schema extensions;
