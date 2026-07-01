# Horizon Travel Agency Dashboard

A professional Next.js 15+ internal operations dashboard for a travel agency, built with App Router, Tailwind CSS v4, and a dark minimalist engineering aesthetic.

## Run & Operate

- `pnpm --filter @workspace/travel-agency run dev` — run the Next.js dev server (port 19981)
- `pnpm --filter @workspace/travel-agency run build` — production build (standalone output)
- `pnpm --filter @workspace/travel-agency run start` — serve the production build
- `pnpm run typecheck` — full typecheck across all packages
- Required env: `DATABASE_URL` — PostgreSQL connection string (optional; app runs on mock data without it)

## Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Language**: TypeScript 5.9 (strict mode)
- **Database**: PostgreSQL via `pg` (pool managed in `lib/db.ts`), ready to connect via `DATABASE_URL`
- **DB ORM** (monorepo): Drizzle ORM available in `lib/db` package
- pnpm workspaces, Node.js 24

## Where things live

```
artifacts/travel-agency/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with Navigation + footer
│   ├── page.tsx              # Dashboard landing page
│   ├── globals.css           # Global styles + Tailwind theme tokens
│   └── api/
│       ├── analytics/route.ts  # GET: stats + monthly data
│       ├── bookings/route.ts   # GET/POST: bookings
│       ├── clients/route.ts    # GET/POST: clients
│       └── trips/route.ts      # GET/POST: destinations/trips
├── components/
│   ├── Navigation.tsx        # Sticky top nav with active route highlighting
│   ├── DashboardShell.tsx    # Client shell that orchestrates dashboard data
│   ├── StatCard.tsx          # KPI stat card with trend indicators
│   ├── RecentBookings.tsx    # Bookings table with status badges
│   └── PopularDestinations.tsx  # Destinations list with booking bars
├── hooks/
│   ├── useDashboard.ts       # Fetches all dashboard data (stats, bookings, destinations)
│   └── useLocalStorage.ts    # Type-safe localStorage hook with SSR safety
└── lib/
    ├── db.ts                 # PostgreSQL pool client (connect via DATABASE_URL)
    └── utils.ts              # cn(), formatCurrency(), formatDate(), apiSuccess/Error helpers
```

## Architecture decisions

- **App Router only** — no Pages Router. Server Components for layout/metadata, Client Components for interactive data fetching.
- **CSS variables for theming** — Tailwind v4 `@theme` block defines all brand tokens (`--color-background`, `--color-accent`, etc.) used inline throughout components for predictable dark mode.
- **Mock data in API routes** — all four API handlers return structured mock data, making the app fully functional without a database. Swap mock data for `lib/db.ts` queries when `DATABASE_URL` is ready.
- **Standalone Next.js output** — `output: "standalone"` in `next.config.ts` produces a self-contained server bundle for production deployment.
- **PostgreSQL-ready** — `lib/db.ts` exports `getDb()`, `query<T>()`, and `queryOne<T>()` helpers wrapping `pg.Pool`. Set `DATABASE_URL` to activate.

## Product

Internal dashboard for Horizon Travel Agency. Shows KPI stats (bookings, revenue, active trips, clients), a recent bookings table with status badges, and a popular destinations panel with revenue bars. Navigation covers: Dashboard, Trips, Bookings, Clients, Analytics, Settings.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always use `pnpm install` (workspace root) after changing `package.json` — individual filter installs may fail in this workspace.
- Next.js reads `PORT` env automatically (v13.5+). The workflow injects `PORT=19981`.
- API routes use mock data — replace mock arrays with `query()` calls from `lib/db.ts` when wiring to PostgreSQL.
- `@tailwindcss/postcss` (not `tailwindcss` directly) is the PostCSS plugin for Tailwind v4.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Next.js App Router docs: https://nextjs.org/docs/app
