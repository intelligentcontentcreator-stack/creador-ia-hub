create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.content_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  format text not null check (format in ('Guion corto', 'Carrusel', 'Newsletter')),
  idea text not null check (char_length(idea) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.content_projects enable row level security;

create policy "Users read their own profile" on public.profiles for select using ((select auth.uid()) = id);
create policy "Users update their own profile" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Users create their own profile" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "Users read their own projects" on public.content_projects for select using ((select auth.uid()) = user_id);
create policy "Users create their own projects" on public.content_projects for insert with check ((select auth.uid()) = user_id);
create policy "Users delete their own projects" on public.content_projects for delete using ((select auth.uid()) = user_id);
