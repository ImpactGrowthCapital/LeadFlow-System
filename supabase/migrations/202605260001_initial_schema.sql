create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  organization text not null default '',
  plan text not null default 'Growth',
  trial_ends_at timestamptz not null default (timezone('utc', now()) + interval '15 days'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text not null check (position('@' in email) > 1),
  organization text not null default '',
  source text not null default 'Manual',
  stage text not null default 'Registered'
    check (stage in ('Registered', 'Attended Live', 'Watched Replay', 'Engaged', 'Qualified', 'Subscriber', 'Booked Call', 'Converted')),
  notes text,
  score integer not null default 0 check (score between 0 and 100),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cadences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  label text not null check (char_length(trim(label)) between 1 and 140),
  industry text not null default '',
  objective text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused')),
  emails jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  work_email text not null check (position('@' in work_email) > 1),
  company text not null default '',
  monthly_webinars text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_user_stage_idx on public.leads (user_id, stage);
create index if not exists leads_user_created_idx on public.leads (user_id, created_at desc);
create index if not exists cadences_user_created_idx on public.cadences (user_id, created_at desc);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists cadences_updated_at on public.cadences;
create trigger cadences_updated_at before update on public.cadences
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'plan', 'Growth')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.cadences enable row level security;
alter table public.demo_requests enable row level security;

drop policy if exists "Profiles are accessible to their owner" on public.profiles;
create policy "Profiles are accessible to their owner"
on public.profiles for all to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Leads are accessible to their owner" on public.leads;
create policy "Leads are accessible to their owner"
on public.leads for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Cadences are accessible to their owner" on public.cadences;
create policy "Cadences are accessible to their owner"
on public.cadences for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Anyone can request a demo" on public.demo_requests;
create policy "Anyone can request a demo"
on public.demo_requests for insert to anon, authenticated
with check (true);

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.cadences to authenticated;
grant insert on public.demo_requests to anon, authenticated;
