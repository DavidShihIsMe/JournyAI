# Itinerary.AI Architecture Rules

## Separation of Concerns

- `lib/` is 100% portable. No framework imports (no Next.js, React, or Supabase). Pure TypeScript only.
- `lib/services/` wraps all Supabase calls with dependency-injected client (first parameter).
- `lib/onboarding/` contains pure business logic (scoring, card data, types).
- `lib/constants/` contains static data (dimensions, types, interests).
- `lib/supabase/` is the one exception — it contains Next.js-specific Supabase client setup (archived in web-v1, not used by web/).
- `lib/utils.ts` is a UI utility (cn function) — not portable.

## Project structure

```
/
├── web/                    # Active Next.js web application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── (auth)/     # Auth pages (login, signup, etc.)
│   │   │   ├── (onboarding)/ # Quiz flow (quiz, interests, type-reveal)
│   │   │   └── (dashboard)/ # Dashboard pages (home, plan, friends, profile)
│   │   ├── components/     # Web-specific React components
│   │   └── lib/
│   │       └── supabase.ts # Web Supabase client
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
├── lib/                    # Portable business logic (shared)
│   ├── constants/          # Static data (dimensions, types, interests)
│   ├── onboarding/         # Scoring engine, card data, types
│   ├── services/           # Supabase API abstraction (DI pattern)
│   ├── supabase/           # Legacy Next.js Supabase setup (NOT used by web/)
│   ├── validation/         # Input validation
│   └── utils.ts            # UI utility (NOT portable)
├── supabase/migrations/    # Database migrations
├── archive/                # Archived implementations
│   ├── mobile/             # Original React Native / Expo app
│   └── web-v1/             # Original root Next.js app (shadcn, SSR middleware)
├── CLAUDE.md
└── .env.local
```

## Rules for new code

1. Never import Next.js or React in `lib/` files (except `lib/supabase/` and `lib/utils.ts`)
2. Never call Supabase directly in components or pages — use `lib/services/`
3. All business logic goes in `lib/`, not in components
4. Service functions take `SupabaseClient` as first parameter (dependency injection)
5. Keep portable types in `lib/onboarding/types.ts`
6. Keep constants in `lib/constants/`
7. Components receive data as props — they don't fetch their own data

## Image Rule

Do NOT use any placeholder images, stock photos, downloaded photos,
or URLs to external images anywhere in the app. If a section needs
a photo, use a div with gray background (#F3F4F6) and centered text
saying "Placeholder: [description]".

```jsx
<div className="w-full h-[300px] bg-neutral-100 rounded-2xl flex items-center justify-center">
  <span className="font-body text-sm text-neutral-400">Placeholder: Travel Photo</span>
</div>
```

## Personality Dimensions

The four traveler dimensions (keys used in code):
- P/F — Plan vs. Flow (`plan_flow`)
- B/R — Busy vs. Relaxed (`busy_relaxed`)
- C/A — Comfort vs. Adventure (`comfort_adventure`): How much friction are you okay with? Comfort = smooth, seamless, things work. Adventure = raw, chaotic, unfamiliar, the friction IS the experience.
- I/O — Immerse vs. Observe (`immerse_observe`)

The 4-letter type codes use A for the Adventure pole (e.g., PBAI, FBAI). C = Comfort, A = Adventure.

## Supabase

- Project URL and keys are in `.env.local` (root) and `web/.env.local`
- Migrations are in `supabase/migrations/`
- RLS is enabled on all tables
- Auth trigger auto-creates profile rows on signup

## Web App (`web/`)

The `web/` directory contains a Next.js 16 web application using the App Router, TypeScript, and Tailwind CSS v4.

### Architecture rules

- The `web/` directory is the active codebase. Do not modify anything in `archive/`.
- All business logic stays in `lib/` at the root. The web app imports from there via `@lib/*` path alias.
- Web-specific components go in `web/src/components/`
- Web-specific hooks go in `web/src/hooks/`
- Use server components by default, client components only when interactivity is needed
- The web Supabase client is at `web/src/lib/supabase.ts` (separate from `lib/supabase/`)

### Shared lib imports

- `@lib/*` resolves to `../lib/*` (the root `lib/` directory)
- Configured via `tsconfig.json` paths + `next.config.ts` webpack alias
- The web app uses `--webpack` flag (not Turbopack) because Turbopack cannot resolve modules outside the project root
- `lib/supabase/` and `lib/utils.ts` are NOT portable — do not import them in the web app

### Design system

Colors:
- Primary: #1A7D7A, Dark: #15635F, Light: #E6F5F4
- Secondary: #E8845C
- Neutrals: 50-900 scale
- Group colors: PB:#4A5899, PR:#9A5B7A, FB:#C4853A, FR:#3A8A7A

Typography:
- Display: Playfair Display (Black 900, Bold 700)
- Body: Lora (Regular 400, Medium 500, SemiBold 600)

### Do NOT

- Delete anything in `archive/` — it must remain functional for reference
- Install React Native packages in the web project
- Copy mobile components — rebuild them as web components using HTML, React, and Tailwind
- Use any mobile-specific libraries (AsyncStorage, react-native-reanimated, expo-router, etc.)
- Import from `lib/supabase/` or `lib/utils.ts` in web code
- Modify anything in `lib/` unless fixing an import path

## Onboarding Flow (mobile — archived)

The mobile onboarding screens followed this order:

1. Welcome → swipe-intro → swipe-cards (12 cards) → dream-day-intro
2. Dream day (6 steps) → interests-intro → interests → type-reveal
3. Type reveal → "Create Account to Save Results" → signup

This flow is preserved in `archive/mobile/` for reference.
