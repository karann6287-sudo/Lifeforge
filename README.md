# LIFEFORGE

> Your real-life actions forge your character.

Turn real-life habits into RPG progression. Complete quests, earn XP, level up attributes, collect rewards, and watch your character grow — one real action at a time.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth & Database**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lifeforge.git
cd lifeforge

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for auth redirects) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm start
```

### Linting & Type Checking

```bash
npm run lint
npx tsc --noEmit
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── loading.tsx        # Global loading UI
│   ├── error.tsx          # Global error UI
│   └── not-found.tsx      # 404 page
├── components/            # Shared React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Main.tsx
│   └── Providers.tsx
├── lib/                   # Utilities & clients
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
    └── index.ts           # Domain types
```

## Features (Planned)

- 🔐 **Authentication** — Supabase Auth (email/password, OAuth)
- ⚔️ **Quests** — Create habits as quests with categories, difficulty, rewards
- 📊 **Attributes** — 6 core RPG attributes tied to task categories
- 📈 **Non-Linear Leveling** — Exponential XP curves, prestige system
- 🔥 **Streaks** — Daily consistency multipliers
- 🎒 **Inventory** — Virtual items (consumables, equipment, cosmetics)
- 💰 **Economy** — Gold, gems, player-driven shop
- 🏆 **Leaderboards** — Global, friends, guild rankings
- 🌙 **Dark Mode** — System-aware, manual toggle
- ♿ **Accessible** — WCAG 2.1 AA compliant
- 📱 **Responsive** — Mobile-first, works everywhere
- ⚡ **Performance** — Optimized images, code splitting, caching
- 🔍 **SEO** — Meta tags, sitemap, Open Graph, JSON-LD

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t lifeforge .
docker run -p 3000:3000 lifeforge
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built during a 24-hour hackathon
- AI-assisted development (disclosed per hackathon rules)
- Next.js, Tailwind CSS, Supabase communities