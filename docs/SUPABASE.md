# Supabase integration boundary

Supabase is deliberately optional during the MVP. `src/services/supabaseClient.ts` creates a browser client only when both public variables exist.

## Safe variables

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The publishable key is intended for public clients and must be protected by Row Level Security. Never put `service_role`, a secret key, or a database password in a `NEXT_PUBLIC_` variable.

## Planned repository transition

1. Define the reviewed content schema in migrations.
2. Enable RLS on every exposed table before granting API access.
3. Add read policies only for records marked as published.
4. Generate TypeScript database types.
5. Implement a Supabase repository with the current `medicalRepository` behavior.
6. Switch repositories in the provider layer, without coupling components to database rows.

The application does not write medical content from the browser in this phase.
