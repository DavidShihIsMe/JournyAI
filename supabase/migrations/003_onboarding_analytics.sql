-- Onboarding analytics events
create table public.onboarding_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  session_id uuid not null,
  event_type text not null,
  event_data jsonb,
  created_at timestamptz default now() not null
);

-- Indexes for querying
create index idx_onboarding_events_user_created
  on public.onboarding_events (user_id, created_at);

create index idx_onboarding_events_type_created
  on public.onboarding_events (event_type, created_at);

-- RLS: users can insert their own events, only service role can select
alter table public.onboarding_events enable row level security;

create policy "Users can insert own events"
  on public.onboarding_events for insert
  with check (auth.uid() = user_id);
