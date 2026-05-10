-- Supabase setup for the nutrition tracker app
-- Paste this entire file into the Supabase SQL Editor and run it once.

-- Recommended extensions
create extension if not exists pgcrypto;

-- Enums
do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'gender_type'
  ) then
    create type public.gender_type as enum ('male', 'female');
  end if;

  if not exists (
    select 1 from pg_type where typname = 'activity_level_type'
  ) then
    create type public.activity_level_type as enum (
      'sedentary',
      'light',
      'moderate',
      'active',
      'very_active'
    );
  end if;

  if not exists (
    select 1 from pg_type where typname = 'goal_type'
  ) then
    create type public.goal_type as enum ('lose', 'maintain', 'gain');
  end if;

  if not exists (
    select 1 from pg_type where typname = 'meal_source_type'
  ) then
    create type public.meal_source_type as enum ('ai', 'manual');
  end if;

  if not exists (
    select 1 from pg_type where typname = 'supplement_type_enum'
  ) then
    create type public.supplement_type_enum as enum (
      'vitamin',
      'mineral',
      'herbal',
      'protein',
      'other'
    );
  end if;
end
$$;

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- User profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  age integer not null check (age > 0 and age < 130),
  weight numeric(6,2) not null check (weight > 0),
  height numeric(6,2) not null check (height > 0),
  gender public.gender_type not null,
  activity_level public.activity_level_type not null,
  goal public.goal_type not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Meals table
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  food_name text not null,
  cal integer not null default 0 check (cal >= 0),
  p numeric(8,2) not null default 0 check (p >= 0),
  c numeric(8,2) not null default 0 check (c >= 0),
  f numeric(8,2) not null default 0 check (f >= 0),
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  source public.meal_source_type not null,
  image_url text,
  timestamp timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

-- Supplements table
create table if not exists public.supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type public.supplement_type_enum not null,
  dosage text,
  time time not null,
  timestamp timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

-- Helpful indexes
create index if not exists idx_meals_user_id on public.meals(user_id);
create index if not exists idx_meals_user_timestamp on public.meals(user_id, timestamp desc);
create index if not exists idx_supplements_user_id on public.supplements(user_id);
create index if not exists idx_supplements_user_timestamp on public.supplements(user_id, timestamp desc);

-- Optional helper view for easier daily querying later
create or replace view public.daily_meal_totals as
select
  user_id,
  (timestamp at time zone 'utc')::date as log_date,
  sum(cal) as total_cal,
  sum(p) as total_p,
  sum(c) as total_c,
  sum(f) as total_f,
  count(*) as meal_count
from public.meals
group by user_id, (timestamp at time zone 'utc')::date;

-- Auto-create profile row after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    email,
    age,
    weight,
    height,
    gender,
    activity_level,
    goal
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'New User'),
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'age', ''), '18')::integer,
    coalesce(nullif(new.raw_user_meta_data ->> 'weight', ''), '70')::numeric,
    coalesce(nullif(new.raw_user_meta_data ->> 'height', ''), '170')::numeric,
    coalesce((new.raw_user_meta_data ->> 'gender')::public.gender_type, 'male'::public.gender_type),
    coalesce((new.raw_user_meta_data ->> 'activity_level')::public.activity_level_type, 'moderate'::public.activity_level_type),
    coalesce((new.raw_user_meta_data ->> 'goal')::public.goal_type, 'maintain'::public.goal_type)
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.supplements enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Meals policies
drop policy if exists "meals_select_own" on public.meals;
create policy "meals_select_own"
on public.meals
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "meals_insert_own" on public.meals;
create policy "meals_insert_own"
on public.meals
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "meals_update_own" on public.meals;
create policy "meals_update_own"
on public.meals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "meals_delete_own" on public.meals;
create policy "meals_delete_own"
on public.meals
for delete
to authenticated
using (auth.uid() = user_id);

-- Supplements policies
drop policy if exists "supplements_select_own" on public.supplements;
create policy "supplements_select_own"
on public.supplements
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "supplements_insert_own" on public.supplements;
create policy "supplements_insert_own"
on public.supplements
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "supplements_update_own" on public.supplements;
create policy "supplements_update_own"
on public.supplements
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "supplements_delete_own" on public.supplements;
create policy "supplements_delete_own"
on public.supplements
for delete
to authenticated
using (auth.uid() = user_id);

-- Notes for the Angular app mapping:
-- profiles.id            -> User.id
-- profiles.activity_level -> User.activityLevel
-- meals.food_name        -> Meal.foodName
-- meals.cal/p/c/f        -> Meal.macros.cal / p / c / f
-- meals.user_id          -> Meal.userId
-- supplements.user_id    -> Supplement.userId
