# Journy

Discover your traveler personality. Take a 2-minute quiz and find out which of 16 traveler types you are, then get destination recommendations that match how you actually like to explore.

## Project Structure

```
/
├── web/                 # Next.js web application (active)
├── lib/                 # Shared TypeScript business logic
│   ├── constants/       # Static data (dimensions, types, interests)
│   ├── onboarding/      # Scoring engine, card data, types
│   ├── services/        # Supabase API abstraction (DI pattern)
│   └── validation/      # Input validation
├── supabase/            # Database migrations
├── archive/             # Archived implementations (mobile, web-v1)
├── CLAUDE.md            # Architecture rules and coding guidelines
└── .env.local           # Environment variables (not committed)
```

## Getting Started

```bash
cd web
npm install
cp .env.example .env.local   # Add your Supabase credentials
npm run dev                  # http://localhost:3000
```

## Architecture

All business logic lives in `lib/` as pure TypeScript — no framework imports. The web app imports from `lib/` via the `@lib/*` path alias. Service functions use dependency injection (Supabase client as first parameter).

See `CLAUDE.md` for full architecture rules.

## Tech Stack

- **Web**: Next.js 16, React 19, Tailwind CSS v4, TypeScript
- **Backend**: Supabase (Auth, PostgreSQL, RLS)
- **Fonts**: Playfair Display (display), Lora (body)
