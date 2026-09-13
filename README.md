# LIFEFORGE

**Turn real-life progress into an RPG.**

LIFEFORGE turns real-world tasks into RPG-style missions. You forge a deed from your day — a workout, a chapter read, a room tidied — then clear it in real life. Clearing missions earns AURA (XP), CREDITS (gold), attribute growth across STR, INT, DISC, and WIS, daily COMBOs, RANK-ups, loot drops, and long-term titles, all tracked on a character dashboard that grows with you.

The core loop:

```
REAL LIFE → MISSION → CLEAR → PROGRESSION → LOOT → CHARACTER GROWTH
```

## Features

- **Authentication** — Email/password sign-up and sign-in via Supabase Auth, with persistent sessions and protected routes (`/dashboard`, `/quests`, `/inventory`, `/shop`).
- **Secure user profiles** — Each account owns exactly one profile (display name, RANK, AURA, CREDITS, attributes, COMBO), isolated per user.
- **Mission CRUD** — Create, rename, edit details, start, and abandon personal missions.
- **Difficulty and categories** — Four difficulties (Easy, Medium, Hard, Epic) and five categories (Fitness, Learning, Productivity, Mindfulness, Social), each feeding an attribute.
- **Server-authoritative clearing** — The `complete_quest()` database function computes every reward. The browser sends only the quest ID — never XP, gold, stats, or streaks.
- **AURA progression** — Cumulative lifetime XP with a non-linear RANK curve (`floor(100 × L^1.5)`), including multi-rank jumps.
- **CREDITS economy** — Gold earned from clears funds Market purchases through the atomic `purchase_item()` function.
- **STR / INT / DISC / WIS attributes** — Each cleared mission grows the attribute mapped to its category.
- **RANK progression** — Derived from cumulative AURA; never set directly by the client.
- **COMBO system** — Daily-completion streaks computed from real completion history.
- **Loot drops** — Difficulty-based server-side drops (Easy 0%, Medium 20%, Hard 40%, Epic 70%) granted into inventory inside the same atomic transaction.
- **Loadout / inventory** — Real owned items with quantities, grouped and filterable; upserts prevent duplicate rows.
- **Market / purchasing** — Trusted catalog prices, quantity selection (1–99), balance locking (`FOR UPDATE`), and side-effect-free insufficient-funds handling.
- **Title progression** — Per-stat ladders (thresholds 10 / 25 / 50 / 100 / 250 / 500) derived on the frontend from real stats, with a full progression archive per attribute.
- **Character visualization** — Full-body adventurer art with a lightweight CSS idle animation (breathing, sway, embers), fully static under `prefers-reduced-motion`.
- **Responsive and accessible UI** — Mobile-first layouts, keyboard navigation, visible focus states, semantic landmarks with skip link, ARIA labels and live regions, reduced-motion support.
- **Cross-device persistence** — All state lives in Supabase Postgres; signing in anywhere restores your character.

## Title system

Titles are tied to individual attributes and unlock automatically when a stat reaches its threshold — nothing is claimed or assigned manually:

| | 10 | 25 | 50 | 100 | 250 | 500 |
|---|---|---|---|---|---|---|
| STR | Fighter | Iron Fist | Battleforged | Juggernaut | Titan | **GOKU** |
| INT | Learner | Scholar | Strategist | Mastermind | Genius | **ZORO** |
| DISC | Initiate | Consistent | Iron Will | Unbreakable | Relentless | **SAITAMA** |
| WIS | Seeker | Observer | Sage | Wise One | Enlightened | **L LAWLIET** |

The 500-point anime titles are intentionally extreme endgame milestones. Your displayed title is always your highest unlocked title across all four stats; locked tiers stay visible as long-term goals.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, `clsx` + `tailwind-merge` |
| Backend | Supabase (PostgreSQL + Auth, `@supabase/ssr`) |
| Security | PostgreSQL Row Level Security, `SECURITY DEFINER` RPCs |
| Deploy target | Vercel |
| Package manager | npm |

## Security / architecture

The browser is never trusted with progression:

- **Supabase Auth** — Session cookies managed via `@supabase/ssr`; middleware refreshes sessions and guards protected routes.
- **Row Level Security** — Ownership policies (`auth.uid() = user_id`) on profiles, quests, completions, and inventory; the catalog is read-only.
- **Column privileges** — Authenticated users can update only safe columns (e.g. quest titles, profile display name). Progression columns, reward columns, prices, and inventory rows are revoked from direct client writes.
- **Trusted RPCs** — `create_quest()`, `start_quest()`, `complete_quest()`, and `purchase_item()` run as `SECURITY DEFINER` with a locked `search_path`. `grant_item()` has **no** client execute grant at all — it can only run inside other trusted functions.
- **Atomic transactions** — Each clear applies quest status, AURA, CREDITS, attributes, COMBO, loot grant, and history insert in one transaction: any failure rolls everything back.
- **Market safety** — Prices come from the catalog table, quantities are capped at 99 with overflow guards, the profile row is locked before deducting, and insufficient funds returns an error without touching anything.

## Database

All schema lives in `supabase-schema.sql` (idempotent — safe to re-run):

| Table | Purpose |
|---|---|
| `profiles` | One row per user: RANK, AURA, CREDITS, attributes, COMBO |
| `quest_categories` | Trusted category → attribute mapping with reward multipliers |
| `quests` | User missions; rewards computed at creation by `create_quest()` |
| `quest_completions` | Immutable audit log of every clear |
| `items` | Item catalog with trusted prices |
| `inventory_items` | Owned items with quantities (`UNIQUE(user_id, item_id)` upserts) |

## Project structure

```
├── supabase-schema.sql        # Idempotent Postgres schema + RLS + RPCs
├── public/
│   ├── character/adventurer.png
│   ├── favicon.ico
│   └── site.webmanifest
└── src/
    ├── app/                   # Routes: /, dashboard, quests, inventory,
    │                          # shop, about, demo, leaderboard, login,
    │                          # signup, privacy (+ loading/error/not-found)
    ├── components/
    │   ├── auth/              # LoginForm, SignupForm, ProfileCard
    │   ├── quests/            # Board, cards, dialogs, celebration, history
    │   ├── shop/              # Market client + item cards
    │   ├── inventory/         # Loadout client
    │   ├── CharacterIdle.tsx  # Idle-animated hero display
    │   ├── TitlesSection.tsx  # Title archive
    │   └── Header/Footer/InfoPage/Main
    ├── lib/                   # Supabase clients, quests, shop,
    │                          # inventory, titles helpers
    └── types/                 # Shared TypeScript domain types
```

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### Setup

```bash
git clone <repository-url>
cd lifeforge
npm install
```

Create `.env.local` (see Environment variables below), then apply the database schema: open your Supabase project dashboard, go to the SQL Editor, and run the full contents of `supabase-schema.sql`. It is idempotent, so re-running it on an existing database is safe.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the project |

## Environment variables

Only these three are used — copy `.env.example` to `.env.local` and fill in your own values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Live demo

Live demo: [add deployed URL]

## Demo flow

1. Sign up (or log in) and enter the Dashboard.
2. Open Quests and create a mission (e.g. Easy + Fitness).
3. Start the mission, do the deed in real life, then clear it.
4. Watch the celebration: AURA, CREDITS, STR +1, and COMBO update from the server response.
5. Repeat daily to grow COMBO; harder missions may drop loot.
6. Open Loadout to see owned loot and quantities.
7. Open Market, check your CREDITS balance, and purchase an item.
8. Open the Titles archive to see earned tiers and locked long-term goals.
9. Refresh the page — everything persists from the database.

## Hackathon / design philosophy

Most productivity apps track tasks; LIFEFORGE turns them into a character. Four attributes represent genuinely different kinds of growth — physical, intellectual, disciplined, reflective — and the anime title ladders give each its own aspirational horizon. Everything meaningful is computed server-side from real completions, so progress always means something actually happened. The interface is built like game screens (command center, mission board, vault, merchant, archive), not admin panels.

## AI disclosure

AI-assisted development was used throughout this project: brainstorming and product ideation, code assistance, debugging, UI/UX iteration, and documentation assistance. The implementation was developed, reviewed, and tested by the team, who take full responsibility for the submitted code.

## Accessibility

Implemented in the app today: full keyboard navigation with visible focus states, semantic landmarks with a skip link, labeled form controls and dialogs, ARIA progress bars and live regions for balances and rewards, responsive layouts from 360px upward, and `prefers-reduced-motion` support that stills all animation (including the character idle loop).
