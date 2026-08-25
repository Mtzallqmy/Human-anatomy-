# Stage 1 and Stage 2 verification

Verified on 25 August 2026 before starting the database and CMS phase.

## Stage 1

| Capability                         | Status | Evidence                                                                                                                       |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| React, TypeScript, TSX and Vite    | PASS   | React 19 application, strict TypeScript, Vinext/Vite production build.                                                         |
| Modular architecture               | PASS   | UI, state, medical data, services, and Three.js are separate modules.                                                          |
| Design system and responsive shell | PASS   | Shared tokens and component styles cover desktop, tablet, and mobile layouts.                                                  |
| Arabic and English                 | PASS   | i18next resources, persisted locale, and document-level RTL/LTR switching.                                                     |
| Routing                            | PASS   | Home, Atlas, system, structure, disease, and references routes render.                                                         |
| Three.js engine                    | PASS   | Scene, camera, renderer, lighting, resize, selection, focus, visibility, X-ray, labels, quality, and disposal are implemented. |
| GLB/GLTF loading                   | PASS   | Lazy GLTF loader with Draco and Meshopt extension points; procedural heart is the licensed MVP fallback.                       |
| Mesh-to-content mapping            | PASS   | External registry maps mesh names to stable anatomical IDs.                                                                    |
| Zustand separation                 | PASS   | Viewer, pathology, content, and UI stores are independent.                                                                     |
| Accessibility baseline             | PASS   | Semantic buttons, labels, keyboard search, visible focus, and reduced-motion handling.                                         |

## Stage 2

| Capability                          | Status | Evidence                                                                                   |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| Cardiovascular system and heart MVP | PASS   | Heart plus 14 named chambers, vessels, valves, septum, and coronary arteries.              |
| 3D selection and camera focus       | PASS   | Raycasting updates Zustand, highlights the structure, and uses GSAP camera transitions.    |
| Anatomy                             | PASS   | Bilingual descriptions, location, blood supply, innervation, relations, and references.    |
| Physiology                          | PASS   | Blood-flow path and animated particles are available from the viewer and physiology panel. |
| Pathology                           | PASS   | Atherosclerosis, myocardial infarction, aortic stenosis, and cardiac hypertrophy.          |
| Disease progression                 | PASS   | Normalized 0–1 slider drives data-defined material, morph-target, and scale settings.      |
| Healthy comparison                  | PASS   | Healthy/diseased state toggle is connected to the visualizer.                              |
| Labels and study mode               | PASS   | Off, named-label, and numbered-study modes.                                                |
| Bilingual search                    | PASS   | Arabic, English, and Latin structure names route to systems, structures, and diseases.     |
| Scientific references               | PASS   | Typed references and `referenceIds` remain outside React components.                       |
| Responsive Atlas                    | PASS   | Three-column desktop view and mobile viewer with controlled panels.                        |

## Corrective work completed before Stage 3

- Removed the heart root ID from generic scene visibility and focus logic; every model asset now declares its own root structure.
- Removed the cardiac hypertrophy disease ID from the pathology engine; disease stages now supply scale and morph-target behavior through typed visual configuration.
- Confirmed `npm run typecheck`, `npm run lint`, and all six rendered-route tests pass.

## Non-blocking limitations carried into Stage 3

- The MVP uses original procedural geometry until a licensed production GLB is uploaded.
- Medical content remains local until the staged Supabase migration is verified; local data stays as an offline fallback.
