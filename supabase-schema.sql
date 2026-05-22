create table if not exists public.clients (
  id text primary key,
  client_id text not null unique,
  name text not null,
  site_url text not null default '',
  mall_platform text not null default '기타',
  memo text not null default '',
  install_status text not null default '미설치',
  last_checked_at timestamptz null,
  tags jsonb not null default '{}'::jsonb,
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_client_id_idx on public.clients (client_id);
create index if not exists clients_created_at_idx on public.clients (created_at desc);

alter table public.clients enable row level security;

drop policy if exists "Block anonymous client table access" on public.clients;
create policy "Block anonymous client table access"
on public.clients
for all
using (false)
with check (false);
