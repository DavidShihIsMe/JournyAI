-- Trips: stores generated itineraries (full GeneratedItinerary JSON in data,
-- venue picks + travel overrides in ui_state).
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  destination text not null,
  start_date date,
  end_date date,
  status text not null default 'planning' check (status in ('planning', 'finalized', 'completed')),
  data jsonb not null,
  ui_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trips_user_id_created_at_idx on public.trips (user_id, created_at desc);

alter table public.trips enable row level security;

create policy "Users can read their own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trips"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "Users can delete their own trips"
  on public.trips for delete
  using (auth.uid() = user_id);

create trigger on_trip_updated
  before update on public.trips
  for each row
  execute function public.handle_updated_at();
