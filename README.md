# OpenWorld.Map

A location-aware social platform for gig workers to share real-time traffic updates, safety alerts, deals, and community tips.

> **Important**: Full project documentation, specifications, and AI prompts are located at:
> `C:\Users\izaak\Documents\Source\Master-AI\projects\Fleevigo`
>
> **Always review the documentation and prompts in this location before making changes to ensure consistency with the project vision and requirements.**

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
