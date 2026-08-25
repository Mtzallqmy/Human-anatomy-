# Database

## Schema

| Area               | Tables                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| Identity           | profiles linked to auth.users                                              |
| Anatomy            | systems, anatomical_structures, translations, synonyms, relations          |
| Physiology         | physiology_topics, translations, structure links                           |
| Pathology          | diseases, translations, affected structures, stages and stage translations |
| Evidence           | references and section-aware structure, disease, and physiology junctions  |
| 3D                 | three_d_assets, mesh_mappings                                              |
| 3D versions        | three_d_asset_versions                                                     |
| Imaging            | imaging_studies, series, frames, annotations, translations, and links      |
| Imaging governance | imaging_versions, imaging_reviews                                          |
| Governance         | content_reviews, content_versions, audit_log                               |

Stable public IDs such as ANAT_HEART_LV remain compatible with URLs, search, meshes, and pathology. Foreign keys preserve relationships. Medical entities use archive status instead of routine destructive deletion.

## Localization and search

English and Arabic text is stored in translation tables keyed by entity ID and locale. `structure_synonyms` supports alternative terminology. `search_medical_content` returns categorized system, structure, disease, physiology, and imaging results.

Future terminology identifiers have dedicated fields for FIPAT, SNOMED, and ICD without making those integrations mandatory now.

## RLS

- Anonymous users read published, non-deleted content only.
- Active editors read staff content and create/edit drafts or rejected records.
- Reviewers inspect submitted content and approve, reject, or request changes.
- Administrators manage all content and publish approved records.
- Profiles are self-readable; only administrators manage role and activation state.

Frontend visibility is not trusted. Policies call role functions in the private schema and use auth.uid().

## Storage

Private buckets:

- medical-models
- medical-images
- thumbnails
- medical-imaging

Suggested object layout: cardiovascular/heart/v1/model.glb. Storage policies allow staff uploads and updates, admin deletion, and public reads only when a matching published asset record exists. Large binary files never live in PostgreSQL.

## Indexes and migrations

Indexes cover status, modality, frame order, annotations, foreign keys, workflow queues, mesh mappings, and bilingual trigram search. Schema changes are versioned under `supabase/migrations`; do not reproduce them manually in the dashboard. `supabase/seed-stage4-5.sql` is generated from typed domain data.
