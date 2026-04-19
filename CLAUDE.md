# Itinerary.AI Architecture Rules

## Project Structure

The project is web-first. The mobile app is archived for future development.

```
/
├── web/                    # Next.js web application (active development)
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── (auth)/     # Auth pages (login, signup, etc.)
│   │   │   ├── (onboarding)/ # Quiz flow (quiz, interests, type-reveal)
│   │   │   ├── (dashboard)/ # Dashboard pages (home, plan, friends, profile)
│   │   │   └── api/        # API routes (health check)
│   │   ├── components/     # Web-specific React components
│   │   └── lib/
│   │       └── supabase.ts # Web Supabase client
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── vercel.json
│   └── package.json
├── lib/                    # Shared TypeScript business logic (portable)
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

## Separation of Concerns

- `lib/` is 100% portable. No framework imports (no Next.js, React, or Supabase). Pure TypeScript only.
- `lib/services/` wraps all Supabase calls with dependency-injected client (first parameter).
- `lib/onboarding/` contains pure business logic (scoring, card data, types).
- `lib/constants/` contains static data (dimensions, types, interests).
- `lib/supabase/` is a legacy exception — contains old Next.js-specific Supabase client setup. NOT used by web/.
- `lib/utils.ts` is a UI utility (cn function) — not portable.

## Rules for new code

1. Never import Next.js or React in `lib/` files (except `lib/supabase/` and `lib/utils.ts`)
2. Never call Supabase directly in components or pages — use `lib/services/`
3. All business logic goes in `lib/`, not in components
4. Service functions take `SupabaseClient` as first parameter (dependency injection)
5. Keep portable types in `lib/onboarding/types.ts`
6. Keep constants in `lib/constants/`
7. Components receive data as props — they don't fetch their own data

## Web Application

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Playfair Display (display/headlines), Lora (body/UI)
- **Auth**: Supabase
- **Deployment**: Vercel (auto-deploys from GitHub main branch)

### Routes

- `/` — Landing page (public)
- `/login`, `/signup`, `/forgot-password`, `/verify-email` — Auth
- `/quiz` — Onboarding quiz
- `/interests` — Interest picker
- `/type-reveal` — Personality type reveal
- `/home` — Dashboard
- `/plan` — Trip planning
- `/friends` — Friends and compatibility
- `/profile` — User profile
- `/api/health` — Health check endpoint

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
- Semantic: Success:#22C55E, Error:#EF4444, Warning:#F59E0B

Typography:
- Display: Playfair Display (Black 900, Bold 700)
- Body: Lora (Regular 400, Medium 500, SemiBold 600)

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

## Onboarding Flow

Quiz (agree/disagree questions) → Interest Picker → Type Reveal → Create Account

This flow is preserved in `archive/mobile/` for reference (mobile version used swipe cards + dream day steps).

## Supabase

- Project URL and keys are in `.env.local` (root) and `web/.env.local`
- Migrations are in `supabase/migrations/`
- RLS is enabled on all tables
- Auth trigger auto-creates profile rows on signup

## Deployment

- **Hosting**: Vercel (auto-deploys from GitHub main branch)
- **Root Directory in Vercel**: `web/`
- Environment variables are set in the Vercel dashboard
- See `web/.env.example` for required variables
- Health check: `/api/health`

## Do NOT

- Delete anything in `archive/` — it must remain functional for reference
- Install React Native packages in the web project
- Copy mobile components — rebuild them as web components using HTML, React, and Tailwind
- Use any mobile-specific libraries (AsyncStorage, react-native-reanimated, expo-router, etc.)
- Import from `lib/supabase/` or `lib/utils.ts` in web code
- Modify anything in `lib/` unless fixing an import path
- Use any placeholder images or stock photos
- Hardcode any API keys

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:

- `/office-hours`
- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/design-consultation`
- `/design-shotgun`
- `/design-html`
- `/review`
- `/ship`
- `/land-and-deploy`
- `/canary`
- `/benchmark`
- `/browse`
- `/connect-chrome`
- `/qa`
- `/qa-only`
- `/design-review`
- `/setup-browser-cookies`
- `/setup-deploy`
- `/retro`
- `/investigate`
- `/document-release`
- `/codex`
- `/cso`
- `/autoplan`
- `/plan-devex-review`
- `/devex-review`
- `/careful`
- `/freeze`
- `/guard`
- `/unfreeze`
- `/gstack-upgrade`
- `/learn`

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, save state, save my work → invoke context-save
- Resume, where was I, pick up where I left off → invoke context-restore
- Code quality, health check → invoke health
