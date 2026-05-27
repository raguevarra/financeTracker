# financeTracker

Finance tracker side project for hosting personal and family finances.

## Auth setup

This project is wired for Clerk authentication.

1. Copy `.env.example` to `.env`.
2. Add your Clerk keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Run `npm run prisma:migrate` to add the local `User.clerkId` mapping column.
4. Start the app with `npm run dev`.

The app protects all pages and API routes except `/sign-in`, `/sign-up`, and `/api/health`. On first login, the Clerk user is linked to an existing local user by email or created automatically.

<!--
PROJECT SKELETON

Goal:
- Build a simple private web app for tracking household income, expenses, savings, debts, budgets, and shared family finance notes.

Chosen stack:
- Next.js for the frontend and backend routes.
- SQLite for local/simple database storage.
- Prisma as the ORM and migration layer.

Project shape:
- src/app/: Next.js App Router pages and API routes.
- src/lib/: shared server utilities, including the Prisma client.
- prisma/: Prisma schema and generated migrations.
- database/: raw SQL notes and scratchpad queries.
- docs/: planning notes, product decisions, deployment notes, and privacy/security checklist.

Early decisions to make:
- Decide whether this starts as single-user, family-shared, or multi-household.
- Choose authentication: local username/password, invite-only accounts, or an external provider.
- Choose hosting target: local network, VPS, Docker host, managed app platform, or private cloud.

Privacy priorities:
- Treat every financial record as sensitive.
- Require login before exposing any data.
- Avoid committing real bank exports, credentials, API keys, or production backups.
- Plan encrypted backups before adding real data.
-->
