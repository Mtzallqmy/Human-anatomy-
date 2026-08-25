# Human Anatomy, Physiology & Pathology Atlas

A bilingual Arabic/English medical education platform connecting anatomy, physiology, pathology, interactive 3D visualization, medical imaging, and traceable references across multiple body systems.

## Delivered scope

- Responsive public atlas with Arabic RTL and English LTR
- Modular Three.js engine, procedural educational heart, selection, focus, labels, blood flow, X-ray, isolation, comparison, and pathology progression
- 15 heart structures, four diseases, physiology topics, and scientific references
- Supabase PostgreSQL schema, migrations, generated types, bilingual search RPC, seed data, RLS, private Storage buckets, audit trail, and content versions
- Supabase Auth with pending staff requests and editor, reviewer, and admin roles
- Guarded /admin CMS for systems, structures, diseases, physiology, references, assets, mesh mappings, review, publishing, and staff access
- TanStack Query data access with Zod validation, system-scoped loading, signed asset URLs, and local fallback
- Full-body layer mode plus cardiovascular, respiratory, digestive, urinary, nervous, and musculoskeletal modules
- Reusable procedural system models, hierarchical structure tree, cross-system links, generic physiology paths, and asset caching
- Educational CT, MRI, X-ray, histology, and pathology imaging with slices, normalized annotations, shared 3D selection, and split view
- Imaging CMS, licensing gates, EXIF-removing normalization, batch limits, coverage metrics, and an annotation editor

The procedural heart is an original educational abstraction. It validates the interaction architecture but is not a clinically validated anatomical asset.

## Technology

React 19, strict TypeScript, Vite/Vinext, Next-compatible routing, Three.js, GSAP, Zustand, i18next, TanStack Query, Zod, Supabase, PostgreSQL, and Supabase Storage.

## Local development

Node.js 22.13 or later is required.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set only public client variables:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Never put a service-role key or database password in a NEXT_PUBLIC variable.

## Verification

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
```

npm test builds the application and verifies the public routes. npm run build:vercel runs the standard Vercel build.

## Project structure

```text
app/                         Public and guarded CMS routes
src/app/                     Providers
src/components/              Reusable viewer, medical, and navigation UI
src/features/auth/           Supabase session and route guards
src/features/admin/          CMS forms, catalogs, workflow, assets, users
src/features/imaging/        Lazy medical imaging viewer and generated educational visuals
src/data-access/             Validated public and editorial repositories
src/three/                   Framework-independent viewer engine
src/store/                   Focused Zustand state
src/data/                    Typed offline fallback and seed source
src/i18n/                    Arabic and English UI resources
supabase/migrations/         Versioned PostgreSQL schema and policies
supabase/seed.sql            Reproducible cardiovascular seed
supabase/seed-stage4-5.sql   Generated multi-system and imaging seed
docs/                        Architecture, database, CMS, and workflow guides
```

## Add content

For production content, sign in at /admin/login and create a draft in the matching catalog. Add Arabic and English text, link stable IDs, submit it for review, record the reviewer decision, then let an administrator publish it. The public atlas reads published database records without a TSX change.

The TypeScript datasets in src/data remain an offline fallback and the source for npm run db:seed:render; they are not the primary production editing interface.

## Add a 3D model

1. Open /admin/assets as an editor or administrator.
2. Select a licensed GLB/GLTF file and enter version, license, attribution, system, and root structure.
3. Map the mesh names extracted by the inspector to stable anatomical IDs.
4. Submit, review, and publish the asset.

The public viewer resolves mesh name → mesh_mappings → anatomical structure ID → published medical content. React components do not contain mesh-name mappings.

## Database setup

Apply migrations in timestamp order, then run supabase/seed.sql. See [Database](docs/DATABASE.md), [Admin](docs/ADMIN.md), [Content workflow](docs/CONTENT_WORKFLOW.md), and [Architecture](docs/ARCHITECTURE.md).

Regenerate the multi-system and imaging seed with `npm run db:seed:stage4-5`. Imaging modules use project-owned generated illustrations, not patient scans or unlicensed internet assets.

## Deployment

The repository supports Vercel and the current Vinext/Vite host. Configure the three public variables above in every deployment environment. Database secrets remain inside Supabase.

## Educational scope

This software is for education. It is not a diagnostic tool, treatment recommendation, or substitute for professional clinical judgment. Published summaries should be reviewed by a qualified medical professional.
