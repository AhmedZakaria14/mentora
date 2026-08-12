-- Workspace OAuth credentials are server-only. RLS is enabled and no client policy is granted.
create table if not exists public.google_connections (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  google_subject text not null,
  google_email text,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz not null,
  token_type text not null default 'Bearer',
  granted_scopes text[] not null default '{}',
  enabled_features text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.google_connections enable row level security;
create index if not exists google_connections_subject_idx on public.google_connections(google_subject);
