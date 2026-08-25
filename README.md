# Human Anatomy, Physiology & Pathology Atlas

A bilingual Arabic/English medical education platform connecting anatomy, physiology, pathology, three-dimensional visualization, and traceable scientific references.

The first production module covers the cardiovascular system and uses the heart to validate the platform architecture. The same viewer and content pipeline can later support the brain, lungs, kidneys, liver, and other body systems.

## Current MVP

- Premium responsive homepage and atlas workspace
- Arabic RTL and English LTR interfaces
- Modular Three.js engine with an original procedural heart model
- Mouse/touch orbit controls, raycast selection, highlighting, and GSAP camera focus
- Hide, show, isolate, reset, transparency/X-ray, quality controls, and labels
- Simple anatomical labels and numbered study mode
- Animated oxygenated and deoxygenated blood-flow paths
- Anatomy, physiology, pathology, and reference tabs
- Atherosclerosis, myocardial infarction, aortic stenosis, and cardiac hypertrophy
- Healthy/disease state toggle and progressive disease visualization
- Bilingual structure, disease, and system search
- Direct routes for structures, diseases, the cardiovascular system, and references
- Optional Supabase client boundary for a future remote medical-content repository

> The current procedural model is an original educational abstraction. It proves the interaction architecture but does not replace a validated, clinically accurate anatomical asset.

## Technology

- React 19, strict TypeScript, and TSX
- Vite 8 through Vinext for the primary build pipeline
- Three.js, GSAP, Zustand
- i18next and react-i18next
- Lucide React icons
- Next-compatible file routing for deployment portability
- Optional Supabase JavaScript client

## Run locally

Node.js 22.13 or later is required.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Quality commands:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
```

`npm run build` produces the Vite/Vinext server artifact. `npm run build:vercel` produces a standard Vercel deployment.

## Project structure

```text
app/                        Route and metadata adapters
src/app/                    Providers and shared application layer
src/screens/                Page experiences
src/components/             Navigation, medical panels, and reusable UI
src/features/               Expandable feature boundaries
src/three/                  Framework-independent Three.js engine modules
src/store/                  Focused Zustand stores
src/data/                   Typed medical content and asset registries
src/services/               Repository and future backend boundaries
src/i18n/                   Arabic and English UI resources
src/types/                  Shared domain models
docs/ARCHITECTURE.md         Layer boundaries and extension guide
```

## Add a model

1. Put a licensed GLB/GLTF asset under `public/models`, or configure an external asset URL.
2. Add a `ModelAsset` in `src/data/assets/modelAssets.ts` with attribution and license details.
3. Map every selectable mesh name to an anatomical entity ID in the external mesh registry.
4. Never reference mesh names from React components.
5. `ModelLoader` has Draco and Meshopt extension points. Enable KTX2 when compressed textures are added.

## Add an anatomical structure

1. Add an `AnatomicalStructure` under `src/data/anatomy`.
2. Give it a stable domain ID such as `ANAT_HEART_LV`.
3. Connect parent, child, related structure, disease, mesh, and reference IDs.
4. Add bilingual original summaries; do not paste copyrighted textbook prose.
5. The repository and search service expose it without changing UI components.

## Add a disease

1. Add a `Disease` under `src/data/pathology`.
2. Define affected structure IDs and ordered `DiseaseStage` records.
3. Use visual presets rather than mesh names. The visualizer resolves IDs through the registry.
4. Attach reference IDs and connect the disease to related anatomical entities.

## Add a translation

Add the same key to `src/i18n/en/common.ts` and `src/i18n/ar/common.ts`. UI uses `t()`; domain content uses `LocalizedText`. The language synchronizer updates `lang` and `dir` without changing the 3D scene direction.

## Add a scientific reference

Add a `ScientificReference` to `src/data/references/references.ts`, then attach its ID to structures or diseases. Components resolve reference IDs through `medicalRepository`.

## Supabase and environment variables

Supabase is optional in this phase. The browser client accepts only:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Use a modern `sb_publishable_…` key. Never expose a secret/service-role key. If content moves to Supabase, keep RLS enabled for all exposed tables and replace the repository implementation without changing components.

## Deployment

The project supports its Vite/Vinext build and contains `vercel.json` for Vercel. Set environment variables in the provider, never in Git. Direct structure and disease routes contain specific metadata for later SEO expansion.

## Educational scope

This software is for medical education. It is not a diagnostic tool, treatment recommendation, or substitute for professional clinical judgment.
