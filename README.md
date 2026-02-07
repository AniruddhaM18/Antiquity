# Antiquity

A **live quiz & contest platform** — create contests, share join codes, run them in real time, and see live leaderboards. Built as a TypeScript monorepo with Next.js, Express, Prisma, PostgreSQL, and Redis.

---

## Features

- **Authentication** — Sign up / sign in (Better Auth)
- **Contests** — Create quizzes with MCQs and shareable join codes
- **Live mode** — Host runs the quiz in real time; participants answer in sync
- **Leaderboard** — Scores and rankings computed live from Redis
- **Dashboard** — View created contests, participated contests, and quiz history

---

## Tech stack

| Layer | Technologies |
|-------|--------------|
| **Monorepo** | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) workspaces |
| **Frontend** | [Next.js 16](https://nextjs.org), [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Framer Motion](https://www.framer.com/motion), [Zustand](https://zustand-demo.pmnd.rs) |
| **Backend** | [Express 5](https://expressjs.com), [ioredis](https://github.com/redis/ioredis) |
| **Database** | [Prisma](https://www.prisma.io), [PostgreSQL 16](https://www.postgresql.org) |
| **Live state** | [Redis 7](https://redis.io) (contest state, answers, leaderboard; 1h TTL) |

---

## Project structure
Antiquity/
├── apps/
│ ├── web/ # Next.js 16 app (App Router)
│ └── backend/ # Express API (auth, contests, live)
├── packages/
│ ├── database/ # Prisma schema, client, migrations
│ ├── config-eslint/ # Shared ESLint configuration
│ └── config-typescript/ # Shared TypeScript configuration
├── docker-compose.yml # PostgreSQL 16 + Redis 7
├── turbo.json # Turborepo pipeline config
└── pnpm-workspace.yaml # PNPM workspace definition


---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** 9.x (`npm install -g pnpm`)
- **Docker** & **Docker Compose** (for Postgres and Redis)

---

## Getting started

### 1. Clone and install

git clone 
cd Antiquity
pnpm install

----
### 2. Start Postgres and Redis
docker-compose up -d
PostgreSQL 16 → localhost:5432 (user: postgres, password: postgres, DB: antiquity)
Redis 7 → localhost:6379


-------
### 3. Environment variables
Copy the example and set values:
cp .env.example .env
Variable	Where	Description
DATABASE_URL	Root / packages/database	e.g. postgresql://postgres:postgres@localhost:5432/antiquity?schema=public
REDIS_HOST	Backend	Redis host (default: localhost)
REDIS_PORT	Backend	Redis port (default: 6379)
REDIS_PASSWORD	Backend	Optional Redis password
JWT_SECRET	Backend	Secret for JWT (required for auth)
FRONTEND_URL	Backend	Frontend origin for CORS, e.g. http://localhost:3000
PORT	Backend	API port (default: 3001)
NEXT_PUBLIC_BACKEND_URL	Web	Backend base URL, e.g. http://localhost:3001/api

---------
### 4. Database setup
pnpm run db:migrate:devpnpm run db:seed    # optional


### 1. Run the app
pnpm run dev
Frontend: http://localhost:3000
Backend: http://localhost:3001 (e.g. GET /health)
Scripts
Command	Description
pnpm dev	Run all apps in dev
pnpm build	Build all apps and packages
pnpm lint	Lint all workspaces
pnpm format	Format with Prettier
pnpm db:migrate:dev	Create and apply Prisma migrations
pnpm db:migrate:deploy	Deploy migrations (e.g. production)
pnpm db:push	Push schema without migrations
pnpm db:seed	Seed database
pnpm generate	Generate Prisma client


Redis and live contests
Redis is used only for live contests:
Contest state (current question, start/end, questions, members)
Participant answers during the live run
Live leaderboard computation.
