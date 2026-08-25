create index anatomical_structures_created_by_idx on public.anatomical_structures(created_by);
create index anatomical_structures_last_reviewed_by_idx on public.anatomical_structures(last_reviewed_by);
create index anatomical_structures_updated_by_idx on public.anatomical_structures(updated_by);
create index content_versions_created_by_idx on public.content_versions(created_by);
create index disease_references_reference_idx on public.disease_references(reference_id);
create index diseases_created_by_idx on public.diseases(created_by);
create index diseases_last_reviewed_by_idx on public.diseases(last_reviewed_by);
create index diseases_updated_by_idx on public.diseases(updated_by);
create index physiology_references_reference_idx on public.physiology_references(reference_id);
create index physiology_topics_created_by_idx on public.physiology_topics(created_by);
create index physiology_topics_last_reviewed_by_idx on public.physiology_topics(last_reviewed_by);
create index physiology_topics_updated_by_idx on public.physiology_topics(updated_by);
create index references_created_by_idx on public.references(created_by);
create index references_updated_by_idx on public.references(updated_by);
create index structure_physiology_topic_idx on public.structure_physiology(physiology_topic_id);
create index structure_references_reference_idx on public.structure_references(reference_id);
create index systems_created_by_idx on public.systems(created_by);
create index systems_updated_by_idx on public.systems(updated_by);
create index three_d_assets_created_by_idx on public.three_d_assets(created_by);
create index three_d_assets_root_structure_idx on public.three_d_assets(root_structure_id);
create index three_d_assets_updated_by_idx on public.three_d_assets(updated_by);

drop policy content_reviews_reviewer_insert on public.content_reviews;
create policy content_reviews_reviewer_insert on public.content_reviews
for insert to authenticated with check (
  reviewer_id = (select auth.uid())
  and private.has_any_role(array['reviewer', 'admin']::public.app_role[])
);

drop policy content_reviews_reviewer_update on public.content_reviews;
create policy content_reviews_reviewer_update on public.content_reviews
for update to authenticated
using (
  reviewer_id = (select auth.uid())
  or private.has_any_role(array['admin']::public.app_role[])
)
with check (
  reviewer_id = (select auth.uid())
  or private.has_any_role(array['admin']::public.app_role[])
);
