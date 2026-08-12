# Mentora — 1:1 Expert Marketplace

Arabic-first marketplace for 1:1 mentorship, consulting and expert sessions.

## Current implementation

- Next.js App Router + TypeScript
- Arabic-first responsive public UI
- Explore mentors + mentor profile
- Learner dashboard
- Mentor dashboard
- Admin dashboard starter
- Live mentor application flow backed by Supabase
- PostgreSQL marketplace schema + hardened RLS
- Transactional booking/slot-hold RPCs and overlap protection
- Google sign-in through Supabase Auth using PKCE
- Incremental Google Workspace authorization for Calendar / Meet / Chat
- Google provider access + refresh tokens encrypted in PostgreSQL with AES/pgcrypto
- Token encryption key and Google server credentials kept in Supabase Vault
- Server-only Google token refresh RPC (service-role only)
- Supabase Edge Function for Calendar FreeBusy and Calendar Event + Google Meet creation
- Next.js authenticated proxy for Workspace operations
- Vercel production deployment from `main`

## Stack

- Next.js 16.x App Router
- React 19
- TypeScript
- Supabase Auth / PostgreSQL / Vault / Edge Functions
- Google Calendar API
- Google Meet API
- Google Chat API
- Gemini (next implementation stage)
- Payment provider abstraction; Paymob target for Egypt

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The Next.js application only needs the public Supabase URL + publishable key. Do not put a Supabase service-role key or Google OAuth client secret in the Next.js environment.

## Supabase database

Apply the migrations in order:

1. `0001_core.sql`
2. `0002_google_integrations.sql`
3. `0003_harden_rls.sql`
4. `0004_auth_and_booking_rpc.sql`
5. `0005_secure_applications_and_holds.sql`
6. `0006_google_provider_token_vault.sql`
7. `0007_encrypt_google_tokens_and_lock_access.sql`

`0007` creates a random per-project Google token encryption key in Supabase Vault if one does not already exist.

## Google Auth / Workspace setup

Configure Google as an OAuth provider inside Supabase Auth. The Google Cloud OAuth client must use the Supabase Auth callback URL:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Store the Google server credentials in Supabase Vault using these names (never commit their values):

- `mentora_google_client_id`
- `mentora_google_client_secret`

The user flow is intentionally least-privilege:

1. Normal Google sign-in requests identity access only.
2. Calendar / Meet / Chat permissions are requested later from Settings → Integrations.
3. Provider tokens returned after consent are encrypted before storage.
4. The browser cannot call the database RPC that returns a decrypted Google access token.
5. The `google-workspace` Supabase Edge Function obtains the token server-side and returns only sanitized Calendar / Meet results.

## Workspace API

Authenticated Next.js requests can call:

```text
POST /api/integrations/google/workspace
```

Supported actions currently include:

- `freebusy` — check Google Calendar busy ranges.
- `create_event` — create a Calendar event and request an attached Google Meet conference.

The booking flow should check FreeBusy before confirming a slot, and create the Calendar event only after payment is verified.

## Production secrets

Do not commit or expose:

- Supabase service-role / secret keys
- Google OAuth client secret
- Google provider refresh/access tokens
- Paymob secrets
- Gemini API keys

Google OAuth credentials belong in Supabase Auth/Vault; the Next.js/Vercel application uses the publishable Supabase key only for the current Google integration architecture.

## Next work

1. Replace remaining demo mentor/profile/availability UI with live database queries.
2. Wire the booking UI to slot holds + Google FreeBusy.
3. Add Paymob payment intent and verified webhook flow.
4. Create Calendar + Meet only after successful payment.
5. Complete admin mentor review/approval workflow.
6. Add Gemini matching + session preparation/summaries.
7. Add messaging/realtime and package/subscription ledgers.
