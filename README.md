<p align="center">
  <a href="https://cruda.app">
    <picture>
      <img alt="cruda" src=".github/banner.svg" width="100%">
    </picture>
  </a>
</p>

<p align="center">
  A photo sharing platform built around a simple idea: the image is what matters.
</p>

<p align="center">
  <a href="https://cruda.app">cruda.app</a>
</p>

---

## Philosophy

cruda was born from wanting a place to share photos without the noise of social media — a space where the photograph speaks for itself.

No metrics. No audience. No algorithm.

- **No like counts** — you can save a photo, but the author never sees how many people saved it
- **No follower counts** — following is a quiet, private gesture with no rankings to chase
- **Chronological feed** — no algorithm deciding what to show you or how long you should stay
- **Intentional sharing** — inspired by the analog process of loading a roll, waiting, developing

cruda is a space for sharing art, not content.

*— Teodoro Villanueva*

## Features

### Photo Sharing
- Drag-and-drop batch upload with client-side compression (JPEG, PNG, WebP)
- Optional title and description per photo
- Full-resolution viewing with responsive portrait/landscape layout
- Virtualized masonry grid with lazy loading and blur-up placeholders

### Social
- **Save** photos to a personal collection (private — authors can't see save counts)
- **Follow** users to see their photos in your feed (private — no follower counts)
- **Profiles** with photo grid and saved photos tab

### Discovery
- **Recent** — latest photos, chronologically ordered
- **Random** — deterministic seed-based shuffle for infinite exploration
- **Feed** — photos from people you follow

### Interface
- Minimal, typography-driven design using Source Serif 4
- Dark and light mode (system preference)
- CSS View Transitions for smooth navigation
- Floating context-aware navigation bar
- Fully responsive (mobile-first)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (Turbopack) |
| UI | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com) |
| Database | [PostgreSQL](https://www.postgresql.org) via [Neon](https://neon.tech) serverless |
| ORM | [Drizzle](https://orm.drizzle.team) |
| Auth | [better-auth](https://www.better-auth.com) (email/password + username plugin) |
| Storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) + [TanStack Virtual](https://tanstack.com/virtual) |
| Analytics | [PostHog](https://posthog.com) |
| Content | [MDX](https://mdxjs.com) |

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io)
- PostgreSQL database (or a [Neon](https://neon.tech) account)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

Configure `.env.local` with your database URL, Vercel Blob token, and auth secret.

```bash
# Push schema to database
pnpm db:push

# (Optional) Seed sample data
pnpm db:seed

# Start development server
pnpm dev
```

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:push` | Push schema directly to database |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed the database |

## Project Structure

```
app/
├── api/
│   ├── photos/         # CRUD + feed, random, saved endpoints
│   ├── saves/          # Save/unsave toggle
│   ├── follows/        # Follow/unfollow toggle
│   ├── users/          # User profiles and user photos
│   ├── upload/         # Vercel Blob upload handler
│   └── auth/           # better-auth catch-all
├── login/              # Login page
├── register/           # Registration page
├── recover/            # Password recovery
├── confirm-email/      # Email verification
├── philosophy/         # Platform philosophy (MDX)
├── photo/[id]/         # Photo detail + edit
├── profile/[username]/ # User profile
├── upload/             # Photo upload
└── mas/                # Menu / more
components/
├── virtual-masonry-grid.tsx  # Virtualized masonry layout
├── floating-bar.tsx          # Context-aware navigation
├── logo.tsx                  # Brand mark
└── ...
lib/
├── queries.ts          # Server-side DB queries
├── hooks/              # React Query hooks (photos, users, mutations)
├── session.ts          # Auth session helper
├── auth.ts             # better-auth config
└── db.ts               # Drizzle client
schema/
├── auth.ts             # User, session, account, verification tables
├── platform.ts         # Photo, save, follow tables
└── relations.ts        # Drizzle relations
```

## License

All rights reserved.
