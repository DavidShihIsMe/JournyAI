-- Traveler profiles: stores dimension scores and computed type
create table public.traveler_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  plan_flow_score integer not null default 50,
  busy_relaxed_score integer not null default 50,
  comfort_discomfort_score integer not null default 50,
  immerse_observe_score integer not null default 50,
  type_code text,
  type_name text,
  profile_confidence integer not null default 0,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Swipe responses: records from the card-swiping onboarding step
create table public.swipe_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  card_id integer not null,
  response text not null check (response in ('left', 'right', 'super_like')),
  created_at timestamptz not null default now()
);

-- Interests: user-selected travel interests
create table public.interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  interest_name text not null,
  created_at timestamptz not null default now()
);

-- Dream day responses: choices from the build-your-dream-day step
create table public.dream_day_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  step_number integer not null,
  dimension text not null,
  choice text not null check (choice in ('left', 'right')),
  created_at timestamptz not null default now()
);

-- Enable RLS on all tables
alter table public.traveler_profiles enable row level security;
alter table public.swipe_responses enable row level security;
alter table public.interests enable row level security;
alter table public.dream_day_responses enable row level security;

-- traveler_profiles policies
create policy "Users can read their own traveler profile"
  on public.traveler_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own traveler profile"
  on public.traveler_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own traveler profile"
  on public.traveler_profiles for update
  using (auth.uid() = user_id);

-- swipe_responses policies
create policy "Users can read their own swipe responses"
  on public.swipe_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own swipe responses"
  on public.swipe_responses for insert
  with check (auth.uid() = user_id);

-- interests policies
create policy "Users can read their own interests"
  on public.interests for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interests"
  on public.interests for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own interests"
  on public.interests for delete
  using (auth.uid() = user_id);

-- dream_day_responses policies
create policy "Users can read their own dream day responses"
  on public.dream_day_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own dream day responses"
  on public.dream_day_responses for insert
  with check (auth.uid() = user_id);

-- updated_at trigger on traveler_profiles (reuses handle_updated_at from 001)
create trigger on_traveler_profile_updated
  before update on public.traveler_profiles
  for each row
  execute function public.handle_updated_at();
