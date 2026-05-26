# LeadFlow

LeadFlow is a Next.js CRM application migrated from the original single-file HTML prototype. It includes:

- Responsive marketing site and demo request capture
- Supabase email/password authentication, Google OAuth, and password recovery
- Protected CRM dashboard with lead CRUD and pipeline reporting
- Persistent email cadence library
- Supabase row-level security policies for per-user data isolation
- Vercel-ready environment configuration

## Stack

- Next.js App Router with TypeScript
- React
- Supabase Auth and Postgres
- `@supabase/ssr` cookie-based sessions
- Vercel deployment target

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set your Supabase project values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. In the Supabase SQL editor, apply:

   ```text
   supabase/migrations/202605260001_initial_schema.sql
   ```

4. In Supabase Authentication:

   - Enable Email authentication.
   - Enable Google OAuth if Google sign-in is needed.
   - Set Site URL to `http://localhost:3000` during local development.
   - Add `http://localhost:3000/auth/callback` to Redirect URLs.

5. Start the app:

   ```bash
   npm run dev
   ```

## Folder Structure

```text
app/
  auth/                   Auth actions and callback/signout routes
  dashboard/              Protected CRM routes and mutations
  login/ signup/          Authentication pages
components/               Reusable marketing, auth, and CRM UI
lib/
  supabase/               Browser/server clients and session proxy
  env.ts                  Environment access
  types.ts                App domain types
supabase/migrations/      Database schema and RLS policies
proxy.ts                  Next.js 16 session refresh entry point
```

## Supabase Security

The migration enables row-level security on `profiles`, `leads`, and `cadences`. Authenticated users can only access rows whose `user_id` or profile `id` matches `auth.uid()`.

The public demo form permits anonymous insert access to `demo_requests`. Before running paid traffic, add rate limiting or bot protection such as Cloudflare Turnstile in front of that form.

Do not commit `.env.local` or a Supabase service-role key. The application only needs a Supabase publishable key in the browser.

## Deploy To Vercel

1. Push this directory to a Git repository and import it into Vercel.
2. Add the three environment variables from `.env.example` in Vercel Project Settings for Production and Preview.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed production URL, for example `https://leadflow.example.com`.
4. In Supabase Authentication URL Configuration, set the production Site URL and allow:

   ```text
   https://leadflow.example.com/auth/callback
   ```

5. Deploy. Vercel detects Next.js and uses `npm run build`.

## Verification

Before deployment, run:

```bash
npm run lint
npm run typecheck
npm run build
```
