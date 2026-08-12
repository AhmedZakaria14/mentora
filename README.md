# Mentora — 1:1 Expert Marketplace

Production-oriented starter for an Arabic-first marketplace for 1:1 mentorship, consulting and expert sessions.

## Current implementation

- Next.js App Router + TypeScript structure
- Arabic-first responsive public UI
- Explore mentors + mentor profile
- Learner dashboard
- Mentor dashboard
- Admin dashboard starter
- Mentor application starter
- PostgreSQL/Supabase migration with marketplace entities
- PostgreSQL exclusion constraint to block overlapping confirmed mentor bookings
- Booking/commission domain utilities
- Google Calendar REST service: FreeBusy + event + Meet conference creation
- Google Meet REST service starter for participants/transcripts
- Google Chat REST service starter for mentorship spaces/messages
- Environment template

## Stack

- Next.js 16.x App Router
- React 19
- TypeScript
- Supabase / PostgreSQL
- Google Calendar API
- Google Meet REST API
- Google Chat API
- Gemini (next implementation stage)
- Payment provider abstraction; Paymob target for Egypt

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. Create/select a Supabase project.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and publishable key.
3. Apply `supabase/migrations/0001_core.sql`.
4. Enable Google provider in Supabase Auth.
5. Add production RLS/admin policies before public launch.

## Google integration model

Google Sign-in is distinct from incremental Calendar/Meet/Chat authorization. Store Google refresh/access credentials server-side only. The booking flow should call Calendar FreeBusy before holding a slot, then after verified payment insert a Calendar event with `conferenceDataVersion=1` to generate Google Meet.

## Next work

1. Attach real Supabase project and apply migration.
2. Implement auth + RBAC.
3. Replace demo mentor data with database queries.
4. Implement slot-hold transaction/RPC.
5. Implement OAuth token storage + refresh for Google Workspace.
6. Implement Paymob sandbox/provider webhook.
7. Add Gemini matching + session preparation/summaries.
8. Add messaging/realtime and package/subscription ledgers.
9. Deploy to Vercel and configure domain.
