# Supabase integration

Supabase is the primary published-content, authentication, workflow, and asset backend. `src/lib/supabase/client.ts` creates one typed browser client when both public variables exist. Public atlas screens retain a local read-only fallback so a temporary network failure does not break the 3D experience.

## Safe variables

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The publishable key is intended for public clients and must be protected by Row Level Security. Never put `service_role`, a secret key, or a database password in a `NEXT_PUBLIC_` variable.

## Implemented data path

1. Timestamped migrations define the schema, indexes, RLS, search, audit triggers, and Storage policies.
2. `supabase/seed.sql` imports the cardiovascular MVP using stable IDs.
3. Generated types live in `src/types/database.ts`.
4. `supabaseMedicalRepository` loads and validates public system bundles.
5. `adminRepository` performs editorial changes under the signed-in user's RLS role.
6. TanStack Query caches reads and invalidates changed admin catalogs.

The application writes medical content only for authenticated, active staff. PostgreSQL policies—not UI controls—authorize every operation.
