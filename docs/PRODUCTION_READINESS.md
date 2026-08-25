# Production readiness

## Required gate

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build:vercel
```

Check Supabase migrations, generated database types, seed idempotency, RLS advisors, private buckets, anonymous published-only queries, bilingual search, direct routes, mobile layout, WebGL fallback, imaging frame errors, and short-lived signed URLs.

Only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` belong in Vercel client variables. Never expose a service-role key.

## Monitoring

Review Vercel build logs and runtime error clusters after deployment. Analytics events may include system, structure, imaging study, series, frame, annotation, modality, and sync actions, but never patient or health data.

## Rollback

Vercel keeps immutable deployments; restore the previous production alias if the release regresses. Database migrations are additive. Disable a problematic module by setting its status to archived or availability to false. Preserve old columns and policies until clients have migrated, then remove them in a later reviewed migration.
