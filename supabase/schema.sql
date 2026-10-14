-- Step 1: run this in Supabase -> SQL Editor.

create table if not exists public.citizens (
  citizen_id          uuid primary key default gen_random_uuid(),
  first_name          text not null,
  last_name           text not null,
  date_of_birth       date not null,
  gender              text not null,
  temporary_birth_id  text,
  nin                 text not null unique check (nin ~ '^[0-9]{11}$'),
  is_deceased         boolean not null default false
);

create index if not exists citizens_last_name_idx on public.citizens (last_name);
create index if not exists citizens_first_name_idx on public.citizens (first_name);
create index if not exists citizens_dob_idx on public.citizens (date_of_birth);

-- Read-only public access (this is mock data for a simulation).
alter table public.citizens enable row level security;

drop policy if exists "Public read access" on public.citizens;
create policy "Public read access"
  on public.citizens for select
  to anon, authenticated
  using (true);
