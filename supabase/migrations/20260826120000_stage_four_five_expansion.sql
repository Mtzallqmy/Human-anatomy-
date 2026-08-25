-- Stage 4/5: multi-system asset pipeline and educational medical imaging.
-- Imaging remains educational. Public patient uploads and diagnostic processing are intentionally excluded.

create table public.three_d_asset_versions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.three_d_assets(id) on delete restrict,
  version text not null,
  storage_bucket text,
  storage_path text,
  file_size bigint check (file_size is null or file_size >= 0),
  checksum_sha256 text,
  draco_compressed boolean not null default false,
  meshopt_compressed boolean not null default false,
  ktx2_textures boolean not null default false,
  lod_level text not null default 'standard' check (lod_level in ('simplified', 'standard', 'detailed')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  unique (asset_id, version)
);

create type public.imaging_modality as enum ('CT', 'MRI', 'XRAY', 'HISTOLOGY', 'PATHOLOGY');
create type public.imaging_classification as enum ('anatomical', 'radiologic', 'illustrative', 'conceptual_pathology');
create type public.imaging_orientation as enum ('axial', 'coronal', 'sagittal', 'projection', 'microscopy');
create type public.annotation_geometry_type as enum ('point', 'rectangle', 'polygon');

create table public.imaging_studies (
  id text primary key,
  slug extensions.citext not null unique,
  modality public.imaging_modality not null,
  body_region text not null,
  classification public.imaging_classification not null,
  source text not null,
  license text not null,
  attribution text not null,
  de_identified boolean not null default false,
  educational_use boolean not null default true,
  status public.content_status not null default 'draft',
  content_version integer not null default 1 check (content_version > 0),
  review_due_at timestamptz,
  last_reviewed_at timestamptz,
  last_reviewed_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint imaging_study_publish_safety check (
    status <> 'published' or (de_identified and educational_use and length(trim(source)) > 1 and length(trim(license)) > 1)
  )
);

create table public.imaging_study_translations (
  study_id text not null references public.imaging_studies(id) on delete cascade,
  locale public.locale_code not null,
  title text not null,
  description text not null default '',
  primary key (study_id, locale)
);

create table public.imaging_series (
  id text primary key,
  study_id text not null references public.imaging_studies(id) on delete restrict,
  orientation public.imaging_orientation not null,
  sequence_name text,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.imaging_series_translations (
  series_id text not null references public.imaging_series(id) on delete cascade,
  locale public.locale_code not null,
  name text not null,
  description text not null default '',
  primary key (series_id, locale)
);

create table public.imaging_frames (
  id text primary key,
  series_id text not null references public.imaging_series(id) on delete restrict,
  frame_index integer not null check (frame_index >= 0),
  storage_bucket text,
  storage_path text,
  thumbnail_path text,
  generated_variant text check (generated_variant in ('chest-ct', 'brain-mri', 'chest-xray', 'liver-histology', 'kidney-histology')),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  constraint imaging_frame_source check (
    (storage_bucket is not null and storage_path is not null)
    or generated_variant is not null
  ),
  unique (series_id, frame_index)
);

create or replace function private.valid_normalized_annotation_geometry(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(value) = 'object'
    and jsonb_typeof(value -> 'coordinates') = 'array'
    and jsonb_array_length(value -> 'coordinates') > 0
    and not exists (
      select 1
      from jsonb_array_elements(value -> 'coordinates') as point
      where jsonb_typeof(point) <> 'array'
        or jsonb_array_length(point) <> 2
        or (point ->> 0)::numeric < 0
        or (point ->> 0)::numeric > 1
        or (point ->> 1)::numeric < 0
        or (point ->> 1)::numeric > 1
    )
$$;

create table public.imaging_annotations (
  id text primary key,
  series_id text not null references public.imaging_series(id) on delete restrict,
  frame_index integer not null check (frame_index >= 0),
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  geometry_type public.annotation_geometry_type not null,
  geometry jsonb not null check (private.valid_normalized_annotation_geometry(geometry)),
  color text not null default '#5bd3df' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, series_id)
);

create table public.imaging_annotation_translations (
  annotation_id text not null references public.imaging_annotations(id) on delete cascade,
  locale public.locale_code not null,
  label text not null,
  description text not null default '',
  primary key (annotation_id, locale)
);

create table public.imaging_structure_links (
  study_id text not null references public.imaging_studies(id) on delete restrict,
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  is_primary boolean not null default false,
  primary key (study_id, structure_id)
);

create table public.imaging_disease_links (
  study_id text not null references public.imaging_studies(id) on delete restrict,
  disease_id text not null references public.diseases(id) on delete restrict,
  primary key (study_id, disease_id)
);

create table public.imaging_references (
  study_id text not null references public.imaging_studies(id) on delete restrict,
  reference_id text not null references public.references(id) on delete restrict,
  locator text,
  primary key (study_id, reference_id)
);

create table public.imaging_versions (
  id uuid primary key default gen_random_uuid(),
  study_id text not null references public.imaging_studies(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (study_id, version_number)
);

create table public.imaging_reviews (
  id uuid primary key default gen_random_uuid(),
  study_id text not null references public.imaging_studies(id) on delete restrict,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  decision public.review_decision not null default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function private.capture_imaging_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare next_version integer;
begin
  select coalesce(max(version_number), 0) + 1 into next_version
  from public.imaging_versions where study_id = new.id;
  insert into public.imaging_versions(study_id, version_number, snapshot, created_by)
  values(new.id, next_version, to_jsonb(new), coalesce(new.updated_by, new.created_by, auth.uid()));
  return new;
end;
$$;

create trigger imaging_studies_touch_updated_at before update on public.imaging_studies
for each row execute function private.touch_updated_at();
create trigger imaging_series_touch_updated_at before update on public.imaging_series
for each row execute function private.touch_updated_at();
create trigger imaging_annotations_touch_updated_at before update on public.imaging_annotations
for each row execute function private.touch_updated_at();
create trigger imaging_studies_version after insert or update on public.imaging_studies
for each row execute function private.capture_imaging_version();

create index three_d_asset_versions_asset_idx on public.three_d_asset_versions(asset_id, created_at desc);
create index structure_relations_type_idx on public.structure_relations(relation_type, structure_id);
create index imaging_studies_public_idx on public.imaging_studies(modality, body_region, status) where deleted_at is null;
create index imaging_studies_review_due_idx on public.imaging_studies(review_due_at) where status = 'published';
create index imaging_series_study_idx on public.imaging_series(study_id, sort_order);
create index imaging_frames_series_idx on public.imaging_frames(series_id, frame_index);
create index imaging_annotations_frame_idx on public.imaging_annotations(series_id, frame_index);
create index imaging_annotations_structure_idx on public.imaging_annotations(structure_id);
create index imaging_structure_links_structure_idx on public.imaging_structure_links(structure_id, study_id);
create index imaging_disease_links_disease_idx on public.imaging_disease_links(disease_id, study_id);
create index imaging_reviews_study_idx on public.imaging_reviews(study_id, created_at desc);

alter table public.three_d_asset_versions enable row level security;
alter table public.imaging_studies enable row level security;
alter table public.imaging_study_translations enable row level security;
alter table public.imaging_series enable row level security;
alter table public.imaging_series_translations enable row level security;
alter table public.imaging_frames enable row level security;
alter table public.imaging_annotations enable row level security;
alter table public.imaging_annotation_translations enable row level security;
alter table public.imaging_structure_links enable row level security;
alter table public.imaging_disease_links enable row level security;
alter table public.imaging_references enable row level security;
alter table public.imaging_versions enable row level security;
alter table public.imaging_reviews enable row level security;

create policy three_d_asset_versions_public_read on public.three_d_asset_versions for select to anon, authenticated
using (exists(select 1 from public.three_d_assets a where a.id = asset_id and a.status = 'published' and a.deleted_at is null));
create policy three_d_asset_versions_staff_manage on public.three_d_asset_versions for all to authenticated
using (private.has_any_role(array['editor','reviewer','admin']::public.app_role[]))
with check (private.has_any_role(array['editor','admin']::public.app_role[]));

create policy imaging_studies_public_read on public.imaging_studies for select to anon, authenticated
using (status = 'published' and deleted_at is null and de_identified and educational_use);
create policy imaging_studies_staff_read on public.imaging_studies for select to authenticated
using (private.has_any_role(array['editor','reviewer','admin']::public.app_role[]));
create policy imaging_studies_editor_insert on public.imaging_studies for insert to authenticated
with check ((private.has_any_role(array['editor']::public.app_role[]) and status = 'draft') or private.has_any_role(array['admin']::public.app_role[]));
create policy imaging_studies_workflow_update on public.imaging_studies for update to authenticated
using (
  (private.has_any_role(array['editor']::public.app_role[]) and status in ('draft','rejected'))
  or (private.has_any_role(array['reviewer']::public.app_role[]) and status = 'in_review')
  or private.has_any_role(array['admin']::public.app_role[])
)
with check (
  (private.has_any_role(array['editor']::public.app_role[]) and status in ('draft','in_review','rejected'))
  or (private.has_any_role(array['reviewer']::public.app_role[]) and status in ('approved','rejected'))
  or private.has_any_role(array['admin']::public.app_role[])
);
create policy imaging_studies_admin_delete on public.imaging_studies for delete to authenticated
using (private.has_any_role(array['admin']::public.app_role[]));

create policy imaging_children_public_read on public.imaging_study_translations for select to anon, authenticated
using (exists(select 1 from public.imaging_studies s where s.id = study_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_series_public_read on public.imaging_series for select to anon, authenticated
using (exists(select 1 from public.imaging_studies s where s.id = study_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_series_translations_public_read on public.imaging_series_translations for select to anon, authenticated
using (exists(select 1 from public.imaging_series sr join public.imaging_studies s on s.id = sr.study_id where sr.id = series_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_frames_public_read on public.imaging_frames for select to anon, authenticated
using (exists(select 1 from public.imaging_series sr join public.imaging_studies s on s.id = sr.study_id where sr.id = series_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_annotations_public_read on public.imaging_annotations for select to anon, authenticated
using (exists(select 1 from public.imaging_series sr join public.imaging_studies s on s.id = sr.study_id where sr.id = series_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_annotation_translations_public_read on public.imaging_annotation_translations for select to anon, authenticated
using (exists(select 1 from public.imaging_annotations a join public.imaging_series sr on sr.id = a.series_id join public.imaging_studies s on s.id = sr.study_id where a.id = annotation_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_structure_links_public_read on public.imaging_structure_links for select to anon, authenticated
using (exists(select 1 from public.imaging_studies s where s.id = study_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_disease_links_public_read on public.imaging_disease_links for select to anon, authenticated
using (exists(select 1 from public.imaging_studies s where s.id = study_id and s.status = 'published' and s.deleted_at is null and s.de_identified));
create policy imaging_references_public_read on public.imaging_references for select to anon, authenticated
using (exists(select 1 from public.imaging_studies s where s.id = study_id and s.status = 'published' and s.deleted_at is null and s.de_identified));

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'imaging_study_translations','imaging_series','imaging_series_translations','imaging_frames',
    'imaging_annotations','imaging_annotation_translations','imaging_structure_links',
    'imaging_disease_links','imaging_references'
  ] loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (private.has_any_role(array[''editor'',''reviewer'',''admin'']::public.app_role[])) with check (private.has_any_role(array[''editor'',''admin'']::public.app_role[]))',
      table_name || '_staff_manage', table_name
    );
  end loop;
end;
$$;

create policy imaging_versions_staff_read on public.imaging_versions for select to authenticated
using (private.has_any_role(array['editor','reviewer','admin']::public.app_role[]));
create policy imaging_reviews_staff_read on public.imaging_reviews for select to authenticated
using (private.has_any_role(array['editor','reviewer','admin']::public.app_role[]));
create policy imaging_reviews_reviewer_manage on public.imaging_reviews for all to authenticated
using (reviewer_id = (select auth.uid()) or private.has_any_role(array['admin']::public.app_role[]))
with check ((reviewer_id = (select auth.uid()) and private.has_any_role(array['reviewer']::public.app_role[])) or private.has_any_role(array['admin']::public.app_role[]));

grant select on public.three_d_asset_versions, public.imaging_studies, public.imaging_study_translations,
  public.imaging_series, public.imaging_series_translations, public.imaging_frames,
  public.imaging_annotations, public.imaging_annotation_translations, public.imaging_structure_links,
  public.imaging_disease_links, public.imaging_references to anon;
grant select, insert, update, delete on public.three_d_asset_versions, public.imaging_studies,
  public.imaging_study_translations, public.imaging_series, public.imaging_series_translations,
  public.imaging_frames, public.imaging_annotations, public.imaging_annotation_translations,
  public.imaging_structure_links, public.imaging_disease_links, public.imaging_references,
  public.imaging_versions, public.imaging_reviews to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medical-imaging', 'medical-imaging', false, 26214400,
  array['image/png','image/jpeg','image/webp','application/zip']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy medical_imaging_staff_read on storage.objects for select to authenticated
using (bucket_id = 'medical-imaging' and private.has_any_role(array['editor','reviewer','admin']::public.app_role[]));
create policy medical_imaging_editor_upload on storage.objects for insert to authenticated
with check (bucket_id = 'medical-imaging' and private.has_any_role(array['editor','admin']::public.app_role[]));
create policy medical_imaging_admin_update on storage.objects for update to authenticated
using (bucket_id = 'medical-imaging' and private.has_any_role(array['admin']::public.app_role[]))
with check (bucket_id = 'medical-imaging' and private.has_any_role(array['admin']::public.app_role[]));
create policy medical_imaging_admin_delete on storage.objects for delete to authenticated
using (bucket_id = 'medical-imaging' and private.has_any_role(array['admin']::public.app_role[]));

create policy published_medical_imaging_read on storage.objects for select to anon, authenticated
using (
  bucket_id = 'medical-imaging'
  and exists (
    select 1
    from public.imaging_frames f
    join public.imaging_series sr on sr.id = f.series_id
    join public.imaging_studies s on s.id = sr.study_id
    where f.storage_bucket = bucket_id
      and f.storage_path = name
      and s.status = 'published'
      and s.deleted_at is null
      and s.de_identified
      and s.educational_use
  )
);

create or replace function public.search_medical_content(search_query text, result_limit integer default 12)
returns table (id text, result_type text, system_id text, name_en text, name_ar text, href text)
language sql stable security invoker set search_path = ''
as $$
  with normalized as (select '%' || trim(search_query) || '%' as pattern),
  structure_results as (
    select distinct s.id, 'structure'::text as result_type, s.system_id, en.name as name_en, ar.name as name_ar,
      '/atlas/structure/' || s.id as href, 1 as priority
    from public.anatomical_structures s
    join public.structure_translations en on en.structure_id = s.id and en.locale = 'en'
    join public.structure_translations ar on ar.structure_id = s.id and ar.locale = 'ar'
    cross join normalized n
    where s.status = 'published' and s.deleted_at is null and (
      s.canonical_name ilike n.pattern or coalesce(s.latin_name, '') ilike n.pattern
      or en.name ilike n.pattern or ar.name ilike n.pattern
      or exists(select 1 from public.structure_synonyms sy where sy.structure_id = s.id and sy.synonym ilike n.pattern)
    )
  ),
  system_results as (
    select s.id, 'system'::text, s.id, en.name, ar.name, '/systems/' || s.slug, 2
    from public.systems s
    join public.system_translations en on en.system_id = s.id and en.locale = 'en'
    join public.system_translations ar on ar.system_id = s.id and ar.locale = 'ar'
    cross join normalized n
    where s.status = 'published' and s.deleted_at is null
      and (s.canonical_name ilike n.pattern or en.name ilike n.pattern or ar.name ilike n.pattern)
  ),
  disease_results as (
    select d.id, 'disease'::text, null::text, en.name, ar.name, '/disease/' || d.id, 3
    from public.diseases d
    join public.disease_translations en on en.disease_id = d.id and en.locale = 'en'
    join public.disease_translations ar on ar.disease_id = d.id and ar.locale = 'ar'
    cross join normalized n
    where d.status = 'published' and d.deleted_at is null
      and (d.canonical_name ilike n.pattern or en.name ilike n.pattern or ar.name ilike n.pattern)
  ),
  physiology_results as (
    select p.id, 'physiology'::text, min(s.system_id), en.name, ar.name,
      '/atlas/structure/' || min(s.id), 4
    from public.physiology_topics p
    join public.physiology_translations en on en.physiology_topic_id = p.id and en.locale = 'en'
    join public.physiology_translations ar on ar.physiology_topic_id = p.id and ar.locale = 'ar'
    join public.structure_physiology sp on sp.physiology_topic_id = p.id
    join public.anatomical_structures s on s.id = sp.structure_id
    cross join normalized n
    where p.status = 'published' and p.deleted_at is null
      and (p.canonical_name ilike n.pattern or en.name ilike n.pattern or ar.name ilike n.pattern)
    group by p.id, en.name, ar.name
  ),
  imaging_results as (
    select s.id, 'imaging'::text, min(a.system_id), en.title, ar.title, '/imaging/' || s.id, 5
    from public.imaging_studies s
    join public.imaging_study_translations en on en.study_id = s.id and en.locale = 'en'
    join public.imaging_study_translations ar on ar.study_id = s.id and ar.locale = 'ar'
    left join public.imaging_structure_links l on l.study_id = s.id
    left join public.anatomical_structures a on a.id = l.structure_id
    cross join normalized n
    where s.status = 'published' and s.deleted_at is null and s.de_identified and s.educational_use
      and (en.title ilike n.pattern or ar.title ilike n.pattern or s.body_region ilike n.pattern or s.modality::text ilike n.pattern)
    group by s.id, en.title, ar.title
  )
  select r.id, r.result_type, r.system_id, r.name_en, r.name_ar, r.href
  from (
    select * from structure_results union all select * from system_results
    union all select * from disease_results union all select * from physiology_results
    union all select * from imaging_results
  ) r
  where length(trim(search_query)) >= 2
  order by r.priority, r.name_en
  limit greatest(1, least(result_limit, 50))
$$;

grant execute on function public.search_medical_content(text, integer) to anon, authenticated;
