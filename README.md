# OpenWorld.Map

A location-aware social platform for gig workers to share real-time traffic updates, safety alerts, deals, and community tips.

> **Important**: Full project documentation, specifications, and AI prompts are located at:
> `C:\Users\izaak\Documents\Source\Master-AI\projects\Fleevigo`
>
> **Always review the documentation and prompts in this location before making changes to ensure consistency with the project vision and requirements.**

## Development Workflow

### Session Protocol

Every development session must follow this workflow:

1. **Start of Session:**
   - Read `SESSION_HISTORY.md` (latest entry) in the docs folder
   - Review the prompts in `openworld.first doc/prompts/`
   - Understand the XPLAINING → VERIFICATION → IMPLEMENTATION workflow

2. **During Session:**
   - Follow `USERRULES.md` for code patterns and conventions
   - Use `VERIFICATION.md` before starting new features
   - Reference `TECHSTACK.md` before adding dependencies

3. **End of Session:**
   - Update `SESSION_HISTORY.md` with what was done
   - Update this README with latest important changes
   - Commit and push all changes

### Key Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| `SESSION_HISTORY.md` | `Master-AI/.../openworld.first doc/` | Session logs & next steps |
| `prompts/README.md` | `Master-AI/.../openworld.first doc/prompts/` | Workflow system overview |
| `USERRULES.md` | `Master-AI/.../openworld.first doc/prompts/` | Code patterns & rules |
| `03_FEATURE_SPECIFICATION.md` | `Master-AI/.../openworld.first doc/` | Feature requirements |

## Latest Session Summary (Session 4 - Jan 8, 2026)

**Completed:**
- Renamed project from Fleevigo to OpenWorld.Map
- Built navigation (TopNav, BottomNav, MainLayout)
- Built all core pages (Feed, Map, Leaderboard, Profile)
- Built UI components (Avatar, Badge, Modal, PostCard, CreatePostModal)
- Pushed to GitHub: https://github.com/EpicGrowth/openworld-map

**Next Steps:**
- Implement Mapbox map with real pins
- Add post creation with database insert
- Implement helpful votes and comments
- Style pages to match MVP screenshots

## Features

- **Real-time Feed** - Share and discover traffic updates, safety alerts, deals, and tips
- **Interactive Map** - View pins and posts on a Mapbox-powered map
- **Leaderboard** - Gamified experience with XP points and levels
- **User Profiles** - Track contributions and achievements
- **Dark Theme** - Optimized for outdoor/vehicle use

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Maps**: Mapbox GL JS
- **State**: Zustand + React Query

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Mapbox account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fleevigo
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:
   - Get Supabase credentials from your [Supabase Dashboard](https://supabase.com/dashboard)
   - Get Mapbox token from [Mapbox Account](https://account.mapbox.com/access-tokens/)

5. Set up the database:
   - Run the SQL migrations in `supabase/migrations/` in your Supabase SQL editor

6. Start the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3009](http://localhost:3009) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register, onboarding)
│   ├── (main)/            # Main app pages (feed, map, leaderboard, profile)
│   ├── auth/              # Auth callbacks
│   └── status/            # System status page
├── components/
│   ├── layout/            # Navigation components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Feature components
├── features/              # Feature-specific code
│   └── auth/              # Auth actions and hooks
├── lib/                   # Utilities and configs
│   └── supabase/          # Supabase client setup
├── stores/                # Zustand stores
└── types/                 # TypeScript type definitions
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Environment Variables

See `.env.example` for all available environment variables.

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Your Mapbox public access token

## User Types

The platform supports three types of gig workers:
- **Riders** - Delivery riders (food, packages, courier)
- **Drivers** - Rideshare drivers (Uber, Lyft, taxi)
- **Chauffeurs** - Private hire and luxury transport

## Post Categories

- **Traffic** - Road conditions, jams, accidents
- **Safety** - Danger alerts, scams, unsafe areas
- **Deals** - Discounts, offers, promotions
- **Amenities** - Rest stops, parking, food, fuel
- **General** - Community discussions

## License

MIT
