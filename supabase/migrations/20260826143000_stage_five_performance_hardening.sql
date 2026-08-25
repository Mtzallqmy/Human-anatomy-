-- Stage 5 production audit: add covering indexes for editorial and imaging foreign keys.
-- Existing unused-index notices are expected immediately after seeding and should be
-- evaluated from production query statistics before any index is removed.

create index if not exists imaging_references_reference_idx
  on public.imaging_references(reference_id, study_id);
create index if not exists imaging_reviews_reviewer_idx
  on public.imaging_reviews(reviewer_id, created_at desc);
create index if not exists imaging_studies_created_by_idx
  on public.imaging_studies(created_by) where created_by is not null;
create index if not exists imaging_studies_last_reviewed_by_idx
  on public.imaging_studies(last_reviewed_by) where last_reviewed_by is not null;
create index if not exists imaging_studies_updated_by_idx
  on public.imaging_studies(updated_by) where updated_by is not null;
create index if not exists imaging_versions_created_by_idx
  on public.imaging_versions(created_by) where created_by is not null;
