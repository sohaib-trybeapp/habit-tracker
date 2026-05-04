# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

A mobile-first PWA habit tracker built with Next.js, Convex, and shadcn/ui.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Convex (real-time database + serverless functions)
- **UI**: shadcn/ui + Tailwind v4
- **PWA**: serwist (service worker)
- **Package manager**: npm

## Development Setup

```bash
# Install dependencies (already done)
npm install

# Start Convex backend (required — opens browser for login on first run)
npx convex dev

# In a second terminal, start Next.js dev server
npm run dev
```

App runs at http://localhost:3000

## Project Structure

```
app/            Next.js App Router pages + service worker
  page.tsx      Today view (default route)
  habits/       Manage habits page
  layout.tsx    Root layout: providers, PWA meta, BottomNav
  sw.ts         Serwist service worker entry
convex/         Convex backend
  schema.ts     Database table definitions
  habits.ts     Habit CRUD mutations/queries
  habitLogs.ts  Daily completion tracking + streak logic
  utils.ts      Shared date utilities (server-side)
components/     React components
  providers/    ConvexClientProvider (swap for Clerk version later)
  ui/           shadcn/ui copied components
lib/            Client-side utilities
  utils.ts      shadcn cn() helper
  dates.ts      Date formatting helpers
public/         Static assets
  manifest.json PWA manifest
  icons/        PWA icons (replace placeholders with real icons)
```

## Convex Schema

- `habits` table: `name`, `emoji`, `description?`, `createdAt`, `isArchived`
- `habitLogs` table: `habitId`, `date` (YYYY-MM-DD), `completedAt`

## Adding Clerk Auth (future)

Replace `components/providers/ConvexClientProvider.tsx` with the Clerk version
(see comments in that file), add `middleware.ts`, install `@clerk/nextjs`.
Then update each Convex function to call `ctx.auth.getUserIdentity()`.

## PWA Icons

Placeholder solid-indigo icons are in `public/icons/`. Replace with real icons:
- Generate maskable variant at https://maskable.app
- Generate all sizes at https://realfavicongenerator.net
