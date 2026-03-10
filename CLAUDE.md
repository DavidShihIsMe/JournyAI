# Itinerary.AI Architecture Rules

## Separation of Concerns

- `lib/` is 100% portable. No framework imports (no Next.js, React, or Supabase). Pure TypeScript only.
- `lib/services/` wraps all Supabase calls with dependency-injected client (first parameter).
- `lib/onboarding/` contains pure business logic (scoring, card data, types).
- `lib/constants/` contains static data (dimensions, types, interests).
- `components/` handles rendering only. No direct DB calls.
- `app/` handles routing and page layout only.
- `lib/supabase/` is the one exception — it contains Next.js-specific Supabase client setup.
- `lib/utils.ts` is a UI utility (cn function) — it stays in lib/ for shadcn compatibility but is not portable.

## Why

This codebase will be ported to React Native / Expo in the future.
Everything in `lib/` (except `lib/supabase/` and `lib/utils.ts`) will be copied directly to the mobile project.
Only `app/`, `components/`, `lib/supabase/`, and `lib/utils.ts` will be rebuilt for mobile.

## Rules for new code

1. Never import Next.js or React in `lib/` files (except `lib/supabase/` and `lib/utils.ts`)
2. Never call Supabase directly in components or pages — use `lib/services/`
3. All business logic goes in `lib/`, not in components
4. Service functions take `SupabaseClient` as first parameter (dependency injection)
5. Keep portable types in `lib/onboarding/types.ts`
6. Keep constants in `lib/constants/`
7. Components receive data as props — they don't fetch their own data
8. The `SwipeCardStack` receives cards as a prop, not importing them directly

## Project structure

```
app/                    # Next.js pages (routing + layout only)
components/             # React components (rendering only)
  ui/                   # shadcn/ui primitives
  onboarding/           # Onboarding flow components
lib/                    # Portable business logic
  constants/            # Static data (dimensions, types, interests)
  onboarding/           # Scoring engine, card data, types
  services/             # Supabase API abstraction (DI pattern)
  supabase/             # Next.js-specific Supabase client setup (NOT portable)
  utils.ts              # UI utility (NOT portable)
types/                  # Re-exports from lib/ for convenience
supabase/migrations/    # Database migrations
```

## Supabase

- Project URL and keys are in `.env.local`
- Migrations are in `supabase/migrations/`
- RLS is enabled on all tables
- Auth trigger auto-creates profile rows on signup
