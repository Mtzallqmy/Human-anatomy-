# Stage 3 verification

Verified against the configured Supabase project on 26 August 2026.

## Data path

- Loaded 10 systems through the public repository.
- Loaded the cardiovascular bundle with 15 structures, 4 diseases, 4 references, and 1 asset.
- Arabic search for البطين الأيسر and English search for Heart both returned results.
- Anonymous RLS returned published content and hid draft content.

## Role workflow

A disposable confirmed Auth user was moved through each role and removed after the test.

| Role                 | Verified operation                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Public/viewer        | Read 15 published structures; draft insert denied with PostgreSQL code 42501                             |
| Editor               | Created a bilingual draft, attached a section-level reference, and submitted it for review               |
| Reviewer             | Created an attributed review record and approved the submitted structure                                 |
| Admin                | Linked a disease and mesh mapping, published the approved structure, and read profile management data    |
| Public after publish | Read both translations and found the Arabic name through the search RPC; review records remained private |

The temporary structure, mapping, relations, review, history, and Auth user were deleted after verification. Seed counts returned to 15 structures and no test account remains.

## Build checks

- TypeScript strict check: pass
- ESLint: pass
- Production Vinext/Vite build: pass
- Public route render suite: pass
- Supabase security advisors: no security lints

Deployment and browser checks are recorded in the delivery summary after the final production release.
