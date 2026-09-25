# The School Journal

A public, bilingual school magazine built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. Student submissions enter a private editorial review queue. Approved work publishes immediately; rejected and archived posts remain in the private admin library.

## Run locally

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Without Supabase credentials, the homepage and public reading routes use the clearly isolated `demoPosts` dataset in `lib/types.ts`. Submission reports that the database is not connected; it does not pretend to save work. Once configured, the public pages, submissions, view counts, search, and admin dashboard use Supabase.

## Connect Supabase

1. Create a Supabase project.
2. In the SQL Editor, run [`supabase/migrations/202609240001_initial_schema.sql`](supabase/migrations/202609240001_initial_schema.sql) for a new project, followed by [`supabase/migrations/202609250001_post_approval_workflow.sql`](supabase/migrations/202609250001_post_approval_workflow.sql). For an existing project that already ran the initial migration, run only the new approval workflow migration.
3. Set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` in `.env.local` (which is ignored by Git). The project URL and publishable key are used for Auth sessions; the secret key is used only by server code for database reads, writes, and moderation. Never expose the secret key in client code. Legacy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` names are also supported. Placeholder values are treated as unconfigured until all three real values are present.
4. In Supabase Auth, create an editorial user, then set that user's **app metadata** to `{ "role": "admin" }` in the Auth user editor or via a trusted admin operation. Do not set this in user-editable metadata.
5. Restart the app. Confirm public articles load from the database, submit a test post, then sign into `/admin/login`.

The initial migration creates `students`, `posts`, `post_views`, and `submission_attempts`, indexes, RLS policies, rate-limit/view RPCs, and the public `magazine-covers` storage bucket. The approval workflow migration adds `status` and `submitted_at`, preserves all existing posts as published, and restricts public row reads and view tracking to published posts. New submissions are pending; only authenticated admins can approve, reject, or archive them through server routes. Rejected and archived records are retained. View events count at most once per reader cookie per post per UTC day. The database RPC updates the counter atomically.

## Routes

- `/` — editorial homepage
- `/articles` — search, category/language filters, latest/popular sorting
- `/articles/[slug]` — article page, metadata, related stories and view tracking
- `/category/[category]`, `/search` — filtered and global discovery
- `/submit` — public student submission form; submissions enter admin review
- `/admin/login` — editorial sign in
- `/admin`, `/admin/submissions`, `/admin/posts`, `/admin/students`, `/admin/analytics` — protected editorial dashboard and moderation queue

Admin users must have Supabase Auth app metadata `role=admin`. Only the admin server route can transition post status. Submission validation includes field limits, a honeypot, an hourly per-IP limit enforced through a hashed IP in Postgres, and optional image type/size checks. Student work is plain text and is rendered as escaped React text.

## Deploy to Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` in Vercel Project Settings → Environment Variables for Production (and Preview if needed).
3. Deploy. The Next.js build runs on Vercel without a custom server.
4. Create the Supabase admin user and set app metadata role as described above. Add the Vercel production URL to Supabase Auth's allowed redirect/site URLs if needed for your project settings.
5. Test one English and one Urdu submission, confirm both appear in `/admin/submissions`, approve them, verify image and once-per-day view tracking, then archive a clearly labelled QA post from `/admin/posts`.

## Checks

Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.
