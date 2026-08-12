# Mentora

Mentora is an Arabic-first 1:1 mentorship and expert marketplace. Learners discover verified mentors, book paid private sessions, and join sessions through Google Workspace integrations.

## MVP stack

- Next.js App Router + TypeScript
- Supabase/PostgreSQL
- Google OAuth / Calendar / Meet / Chat
- Pay-per-session, credits, packages, subscriptions (progressive rollout)
- Arabic RTL first, English-ready architecture

## Current implementation

The repository contains the first production-oriented foundation: public discovery pages, learner/mentor/admin dashboards, database schema, booking overlap protection, booking holds, and Google Workspace service adapters.

See `.env.example` for required configuration. Never commit real secrets.
