create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text check (email is null or char_length(email) < 320),
  phone text check (phone is null or char_length(phone) < 40),
  message text check (message is null or char_length(message) < 5000),
  source text default 'website_contact_form',
  notified_at timestamptz
);

alter table public.leads enable row level security;

-- anon può SOLO inserire; nessuna policy SELECT/UPDATE/DELETE => non leggibile via API.
-- Il service_role (Edge Function / dashboard) bypassa RLS e legge normalmente.
create policy "anon can submit leads"
  on public.leads for insert
  to anon
  with check (true);
