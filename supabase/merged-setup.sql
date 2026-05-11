-- =============================================
-- UNIFIED SUPABASE SCHEMA — Nutrition + Gym Tracker
-- Paste this entire file into the Supabase SQL Editor and run it once.
-- =============================================

-- Recommended extensions
create extension if not exists pgcrypto;

-- =============================================
-- ENUMS
-- =============================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'gender_type') then
    create type public.gender_type as enum ('male', 'female');
  end if;
  if not exists (select 1 from pg_type where typname = 'activity_level_type') then
    create type public.activity_level_type as enum ('sedentary', 'light', 'moderate', 'active', 'very_active');
  end if;
  if not exists (select 1 from pg_type where typname = 'goal_type') then
    create type public.goal_type as enum ('lose', 'maintain', 'gain');
  end if;
  if not exists (select 1 from pg_type where typname = 'meal_source_type') then
    create type public.meal_source_type as enum ('ai', 'manual');
  end if;
  if not exists (select 1 from pg_type where typname = 'supplement_type_enum') then
    create type public.supplement_type_enum as enum ('vitamin', 'mineral', 'herbal', 'protein', 'other');
  end if;
end $$;

-- =============================================
-- UPDATED-AT TRIGGER HELPER
-- =============================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- =============================================
-- PROFILES TABLE (combined CAL + GYM)
-- =============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  -- CAL nutrition fields
  name text not null default '',
  email text,
  age integer check (age > 0 and age < 130),
  weight numeric(6,2) check (weight > 0),
  height numeric(6,2) check (height > 0),
  gender public.gender_type,
  activity_level public.activity_level_type,
  goal public.goal_type,
  -- GYM workout fields
  display_name text,
  avatar_url text,
  weight_unit text default 'kg',
  theme text default 'dark',
  language text default 'en',
  -- Timestamps
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =============================================
-- NUTRITION TRACKER TABLES
-- =============================================

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

-- =============================================
-- GYM WORKOUT TRACKER TABLES
-- =============================================

create table if not exists public.exercises (
  id serial primary key,
  name text not null,
  name_ar text,
  sets integer not null,
  reps text not null,
  rest text not null,
  primary_muscle text not null,
  primary_muscle_ar text,
  secondary_muscle text[] default '{}',
  secondary_muscle_ar text[] default '{}',
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  equipment text not null,
  equipment_ar text,
  image_url text,
  description text,
  description_ar text,
  instructions text[] not null default '{}',
  instructions_ar text[] default '{}',
  common_mistakes text[] not null default '{}',
  common_mistakes_ar text[] default '{}',
  safety_tips text[] not null default '{}',
  safety_tips_ar text[] default '{}',
  alternatives text[] not null default '{}',
  alternatives_ar text[] default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_days (
  id serial primary key,
  name text not null,
  focus text not null,
  is_rest_day boolean default false,
  exercise_ids integer[] default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  day_id integer references public.workout_days(id) not null,
  total_volume decimal default 0,
  duration integer default 0,
  completed boolean default false,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger update_workout_logs_updated_at
  before update on public.workout_logs
  for each row execute function public.set_updated_at();

create table if not exists public.exercise_logs (
  id uuid default gen_random_uuid() primary key,
  workout_log_id uuid references public.workout_logs(id) on delete cascade not null,
  exercise_id integer references public.exercises(id) not null,
  completed boolean default false,
  weights decimal[] default '{}',
  completed_sets integer default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  total_workouts integer default 0,
  total_volume decimal default 0,
  total_sets integer default 0,
  total_reps integer default 0,
  personal_records jsonb default '{}',
  personal_records_count integer default 0,
  streak integer default 0,
  last_workout_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger update_user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();

create table if not exists public.body_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight decimal not null,
  height decimal not null,
  bmi decimal not null,
  date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.home_workout_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  day_id integer not null,
  duration integer default 0,
  completed boolean default false,
  difficulty_mode text not null check (difficulty_mode in ('Beginner', 'Intermediate', 'Advanced')),
  exercise_logs jsonb default '[]',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.home_user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  total_workouts integer default 0,
  streak integer default 0,
  last_workout_date date,
  completed_days integer[] default '{}',
  difficulty_mode text default 'Intermediate' check (difficulty_mode in ('Beginner', 'Intermediate', 'Advanced')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger update_home_user_progress_updated_at
  before update on public.home_user_progress
  for each row execute function public.set_updated_at();

-- =============================================
-- INDEXES
-- =============================================
create index if not exists idx_meals_user_id on public.meals(user_id);
create index if not exists idx_meals_user_timestamp on public.meals(user_id, timestamp desc);
create index if not exists idx_supplements_user_id on public.supplements(user_id);
create index if not exists idx_supplements_user_timestamp on public.supplements(user_id, timestamp desc);
create index if not exists idx_workout_logs_user_id on public.workout_logs(user_id);
create index if not exists idx_workout_logs_date on public.workout_logs(date);
create index if not exists idx_exercise_logs_workout_log_id on public.exercise_logs(workout_log_id);
create index if not exists idx_user_stats_user_id on public.user_stats(user_id);
create index if not exists idx_body_metrics_user_id on public.body_metrics(user_id);
create index if not exists idx_body_metrics_date on public.body_metrics(date);
create index if not exists idx_home_workout_logs_user_id on public.home_workout_logs(user_id);
create index if not exists idx_home_workout_logs_date on public.home_workout_logs(date);
create index if not exists idx_home_user_progress_user_id on public.home_user_progress(user_id);

-- =============================================
-- DAILY MEAL TOTALS VIEW
-- =============================================
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

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id, name, email, display_name,
    age, weight, height, gender, activity_level, goal
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'New User'),
    new.email,
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
exception when others then
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- INITIALIZE USER STATS ON PROFILE CREATION
-- =============================================
create or replace function public.init_user_stats()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_stats (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_stats on public.profiles;
create trigger on_profile_created_stats
  after insert on public.profiles
  for each row execute function public.init_user_stats();

-- =============================================
-- INITIALIZE HOME USER PROGRESS ON PROFILE CREATION
-- =============================================
create or replace function public.init_home_user_progress()
returns trigger language plpgsql security definer as $$
begin
  insert into public.home_user_progress (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_home_progress on public.profiles;
create trigger on_profile_created_home_progress
  after insert on public.profiles
  for each row execute function public.init_home_user_progress();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.supplements enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_days enable row level security;
alter table public.workout_logs enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.user_stats enable row level security;
alter table public.body_metrics enable row level security;
alter table public.home_workout_logs enable row level security;
alter table public.home_user_progress enable row level security;

-- =============================================
-- RLS POLICIES — Profiles
-- =============================================
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- =============================================
-- RLS POLICIES — Meals
-- =============================================
drop policy if exists "meals_select_own" on public.meals;
create policy "meals_select_own" on public.meals
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "meals_insert_own" on public.meals;
create policy "meals_insert_own" on public.meals
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "meals_update_own" on public.meals;
create policy "meals_update_own" on public.meals
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "meals_delete_own" on public.meals;
create policy "meals_delete_own" on public.meals
  for delete to authenticated using (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES — Supplements
-- =============================================
drop policy if exists "supplements_select_own" on public.supplements;
create policy "supplements_select_own" on public.supplements
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "supplements_insert_own" on public.supplements;
create policy "supplements_insert_own" on public.supplements
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "supplements_update_own" on public.supplements;
create policy "supplements_update_own" on public.supplements
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "supplements_delete_own" on public.supplements;
create policy "supplements_delete_own" on public.supplements
  for delete to authenticated using (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES — Exercises (read-only)
-- =============================================
drop policy if exists "exercises_select_all" on public.exercises;
create policy "exercises_select_all" on public.exercises
  for select to authenticated using (true);

-- =============================================
-- RLS POLICIES — Workout Days (read-only)
-- =============================================
drop policy if exists "workout_days_select_all" on public.workout_days;
create policy "workout_days_select_all" on public.workout_days
  for select to authenticated using (true);

-- =============================================
-- RLS POLICIES — Workout Logs
-- =============================================
drop policy if exists "workout_logs_select_own" on public.workout_logs;
create policy "workout_logs_select_own" on public.workout_logs
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "workout_logs_insert_own" on public.workout_logs;
create policy "workout_logs_insert_own" on public.workout_logs
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "workout_logs_update_own" on public.workout_logs;
create policy "workout_logs_update_own" on public.workout_logs
  for update to authenticated using (auth.uid() = user_id);
drop policy if exists "workout_logs_delete_own" on public.workout_logs;
create policy "workout_logs_delete_own" on public.workout_logs
  for delete to authenticated using (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES — Exercise Logs
-- =============================================
drop policy if exists "exercise_logs_select_own" on public.exercise_logs;
create policy "exercise_logs_select_own" on public.exercise_logs
  for select to authenticated using (
    exists (select 1 from public.workout_logs where id = exercise_logs.workout_log_id and user_id = auth.uid())
  );
drop policy if exists "exercise_logs_insert_own" on public.exercise_logs;
create policy "exercise_logs_insert_own" on public.exercise_logs
  for insert to authenticated with check (
    exists (select 1 from public.workout_logs where id = exercise_logs.workout_log_id and user_id = auth.uid())
  );
drop policy if exists "exercise_logs_update_own" on public.exercise_logs;
create policy "exercise_logs_update_own" on public.exercise_logs
  for update to authenticated using (
    exists (select 1 from public.workout_logs where id = exercise_logs.workout_log_id and user_id = auth.uid())
  );
drop policy if exists "exercise_logs_delete_own" on public.exercise_logs;
create policy "exercise_logs_delete_own" on public.exercise_logs
  for delete to authenticated using (
    exists (select 1 from public.workout_logs where id = exercise_logs.workout_log_id and user_id = auth.uid())
  );

-- =============================================
-- RLS POLICIES — User Stats
-- =============================================
drop policy if exists "user_stats_select_own" on public.user_stats;
create policy "user_stats_select_own" on public.user_stats
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "user_stats_insert_own" on public.user_stats;
create policy "user_stats_insert_own" on public.user_stats
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "user_stats_update_own" on public.user_stats;
create policy "user_stats_update_own" on public.user_stats
  for update to authenticated using (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES — Body Metrics
-- =============================================
drop policy if exists "body_metrics_select_own" on public.body_metrics;
create policy "body_metrics_select_own" on public.body_metrics
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "body_metrics_insert_own" on public.body_metrics;
create policy "body_metrics_insert_own" on public.body_metrics
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "body_metrics_update_own" on public.body_metrics;
create policy "body_metrics_update_own" on public.body_metrics
  for update to authenticated using (auth.uid() = user_id);
drop policy if exists "body_metrics_delete_own" on public.body_metrics;
create policy "body_metrics_delete_own" on public.body_metrics
  for delete to authenticated using (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES — Home Workout Logs
-- =============================================
drop policy if exists "home_workout_logs_select_own" on public.home_workout_logs;
create policy "home_workout_logs_select_own" on public.home_workout_logs
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "home_workout_logs_insert_own" on public.home_workout_logs;
create policy "home_workout_logs_insert_own" on public.home_workout_logs
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "home_workout_logs_update_own" on public.home_workout_logs;
create policy "home_workout_logs_update_own" on public.home_workout_logs
  for update to authenticated using (auth.uid() = user_id);
drop policy if exists "home_workout_logs_delete_own" on public.home_workout_logs;
create policy "home_workout_logs_delete_own" on public.home_workout_logs
  for delete to authenticated using (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES — Home User Progress
-- =============================================
drop policy if exists "home_user_progress_select_own" on public.home_user_progress;
create policy "home_user_progress_select_own" on public.home_user_progress
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "home_user_progress_insert_own" on public.home_user_progress;
create policy "home_user_progress_insert_own" on public.home_user_progress
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "home_user_progress_update_own" on public.home_user_progress;
create policy "home_user_progress_update_own" on public.home_user_progress
  for update to authenticated using (auth.uid() = user_id);

-- =============================================
-- SEED DATA — Exercises (GYM)
-- =============================================
insert into exercises (id, name, sets, reps, rest, primary_muscle, difficulty, equipment, image_url, description, instructions, common_mistakes, safety_tips, alternatives) values
(1, 'Barbell Bench Press', 4, '6-8', '2-3 min', 'Chest', 'Intermediate', 'Barbell, Bench', '/assets/day1/Barbell Bench Press.png', 'The barbell bench press is the king of chest exercises. It targets the pectoralis major, anterior deltoids, and triceps.', ARRAY['Lie flat on the bench with your feet firmly on the floor', 'Grip the bar slightly wider than shoulder-width apart', 'Unrack the bar and lower it to your mid-chest', 'Push the bar back up to the starting position', 'Keep your elbows at about 45 degrees from your body'], ARRAY['Bouncing the bar off your chest', 'Flaring elbows out too wide (90 degrees)', 'Arching your lower back excessively', 'Using momentum instead of controlled movement'], ARRAY['Always use a spotter for heavy lifts', 'Start with lighter weight to warm up', 'Keep your shoulders retracted and depressed', 'Use collars to secure weights on the bar'], ARRAY['Dumbbell Bench Press', 'Incline Bench Press', 'Machine Chest Press']),
(2, 'Incline Dumbbell Press', 3, '8-10', '90 sec', 'Upper Chest', 'Intermediate', 'Dumbbells, Incline Bench', '/assets/day1/Incline Dumbbell Press.png', 'The incline dumbbell press targets the upper pectorals.', ARRAY['Set the bench to a 30-45 degree incline', 'Sit with dumbbells resting on your thighs', 'Kick the dumbbells up to shoulder level', 'Press the dumbbells up until arms are extended', 'Lower slowly to the starting position'], ARRAY['Setting the incline too high (targets shoulders)', 'Not controlling the descent', 'Letting dumbbells drift inward at the top', 'Using too much weight with poor form'], ARRAY['Start with lighter weight to find your groove', 'Keep your back flat against the bench', 'Breathe out as you press up', 'Lower dumbbells to the side of your upper chest'], ARRAY['Incline Barbell Press', 'Reverse Grip Bench Press', 'Cable Incline Fly']),
(3, 'Chest Fly Machine', 3, '12', '60 sec', 'Chest', 'Beginner', 'Chest Fly Machine', '/assets/day1/Chest Fly Machine.png', 'The chest fly machine provides a safe way to isolate the pectoral muscles.', ARRAY['Adjust the seat so handles are at chest level', 'Sit with your back flat against the pad', 'Grip the handles with palms facing forward', 'Bring arms together in front of you', 'Slowly return to the starting position'], ARRAY['Using too much weight and sacrificing form', 'Not controlling the eccentric phase', 'Rushing through the movement', 'Not fully extending at the start position'], ARRAY['Focus on squeezing your chest at the midpoint', 'Keep shoulders down and back', 'Maintain a controlled tempo throughout', 'Adjust weight to achieve full range of motion'], ARRAY['Dumbbell Fly', 'Cable Crossover', 'Pec Deck']),
(4, 'Weighted Dips', 3, '8-10', '90 sec', 'Triceps', 'Advanced', 'Dip Station, Weight Belt/Dumbbell', '/assets/day1/Weighted Dips.png', 'Weighted dips build triceps and lower chest mass.', ARRAY['Grip the parallel bars and lift yourself up', 'Lean forward slightly to engage chest', 'Lower your body until elbows are at 90 degrees', 'Push back up to the starting position', 'Add weight using a dip belt or dumbbell between legs'], ARRAY['Going too deep and stressing the shoulder joint', 'Not leaning forward enough', 'Flaring elbows out too wide', 'Using momentum to push back up'], ARRAY['Master bodyweight dips before adding weight', 'Keep shoulders down and back throughout', 'Control the descent', 'Stop if you feel shoulder pain'], ARRAY['Bench Dips', 'Assisted Dip Machine', 'Close Grip Bench Press']),
(5, 'Rope Pushdown', 3, '12-15', '60 sec', 'Triceps', 'Beginner', 'Cable Machine, Rope Attachment', '/assets/day1/Rope Pushdown.png', 'The rope pushdown is a staple triceps isolation exercise.', ARRAY['Attach the rope to a high pulley', 'Stand facing the machine with feet shoulder-width apart', 'Grip the rope with palms facing each other', 'Push the rope down, spreading it apart at the bottom', 'Slowly return to the starting position'], ARRAY['Using momentum from the upper body', 'Not spreading the rope at the bottom', 'Letting the weight stack rest between reps', 'Elbows flaring out to the sides'], ARRAY['Keep elbows pinned to your sides', 'Focus on the mind-muscle connection', 'Squeeze triceps hard at the bottom', 'Control the weight on the way up'], ARRAY['Straight Bar Pushdown', 'V-Bar Pushdown', 'Reverse Grip Pushdown']),
(6, 'Overhead Dumbbell Triceps Extension', 3, '10', '60 sec', 'Triceps', 'Beginner', 'Dumbbell', '/assets/day1/Overhead Dumbbell Triceps Extension.png', 'Targets the long head of the triceps.', ARRAY['Stand or sit holding a dumbbell with both hands', 'Lift the dumbbell overhead, arms extended', 'Lower the dumbbell behind your head by bending elbows', 'Extend arms back to the starting position', 'Keep elbows close to your head throughout'], ARRAY['Flaring elbows out to the sides', 'Using too much weight with poor form', 'Not getting a full stretch at the bottom', 'Arching the lower back'], ARRAY['Start light to master the form', 'Keep your core engaged for stability', 'Focus on the triceps stretch and contraction', 'Avoid locking out at the top'], ARRAY['Skull Crushers', 'Cable Overhead Extension', 'EZ Bar Extension']),
(7, 'Deadlift', 3, '5', '3-4 min', 'Back', 'Advanced', 'Barbell', '/assets/day2/Deadlift.png', 'The deadlift is a fundamental compound exercise.', ARRAY['Stand with feet hip-width apart, bar over mid-foot', 'Bend at the hips and knees to grip the bar', 'Keep back flat, chest up, and core braced', 'Drive through your feet to stand up with the bar', 'Lower the bar with control by hinging at the hips'], ARRAY['Rounding the lower back', 'Starting with hips too low', 'Jerking the bar off the floor', 'Looking up excessively'], ARRAY['Always maintain a neutral spine', 'Use a mixed grip or straps for heavy weights', 'Start light and progress gradually', 'Consider using a belt for heavy attempts'], ARRAY['Romanian Deadlift', 'Trap Bar Deadlift', 'Rack Pulls']);

-- =============================================
-- SEED DATA — Workout Days
-- =============================================
insert into workout_days (id, name, focus, is_rest_day, exercise_ids) values
(1, 'Day 1', 'Chest + Triceps (Heavy Focus)', false, ARRAY[1, 2, 3, 4, 5, 6]),
(2, 'Day 2', 'Back + Biceps', false, ARRAY[7]),
(3, 'Day 3', 'Rest / Light Cardio', true, ARRAY[]::integer[]),
(4, 'Day 4', 'Legs (Quad Focus)', false, ARRAY[]::integer[]),
(5, 'Day 5', 'Shoulders + Rear Delt', false, ARRAY[]::integer[]),
(6, 'Day 6', 'Legs (Hamstring Focus)', false, ARRAY[]::integer[]),
(7, 'Day 7', 'Rest / Light Cardio', true, ARRAY[]::integer[])
on conflict (id) do nothing;
