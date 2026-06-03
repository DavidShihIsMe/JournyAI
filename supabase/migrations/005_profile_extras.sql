-- Profile basics captured after signup (welcome screen): age + home city.
-- display_name already exists in the original profiles table (001).
alter table public.profiles
  add column if not exists age integer check (age is null or (age >= 13 and age <= 120)),
  add column if not exists home_city text,
  add column if not exists home_country text;
