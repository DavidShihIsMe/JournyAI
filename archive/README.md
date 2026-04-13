# Archive

This directory contains archived versions of earlier app implementations.
Nothing here is actively developed — it is kept for reference only.

## archive/mobile/

The original React Native / Expo mobile app. This was the first implementation
of the Journy onboarding flow (swipe cards, dream day, interests, type reveal).

To run it (if needed):
```
cd archive/mobile
npm install
npx expo start
```

## archive/web-v1/

The original Next.js 14 web app that was at the repo root. This included
shadcn/ui components, Supabase SSR middleware, and a basic dashboard.

Both projects share the root `lib/` directory for business logic, scoring,
constants, and service functions.

## Current active project

The active web app is in `web/` at the repo root. See the root README for details.
