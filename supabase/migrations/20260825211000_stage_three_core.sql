create extension if not exists citext with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create schema if not exists private;
revoke all on schema private from public;

create type public.locale_code as enum ('en', 'ar');
create type public.content_status as enum (
  'draft',
  'in_review',
  'approved',
  'published',
  'rejected',
  'archived'
);
create type public.app_role as enum ('viewer', 'editor', 'reviewer', 'admin');
create type public.profile_status as enum ('pending', 'active', 'suspended');
create type public.review_decision as enum ('pending', 'approved', 'rejected', 'changes_requested');
create type public.content_entity_type as enum (
  'system',
  'structure',
  'disease',
  'physiology_topic',
  'reference',
  'three_d_asset'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'viewer',
  status public.profile_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.systems (
  id text primary key,
  slug extensions.citext not null unique,
  canonical_name text not null,
  status public.content_status not null default 'draft',
  is_available boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.system_translations (
  system_id text not null references public.systems(id) on delete cascade,
  locale public.locale_code not null,
  name text not null,
  description text not null default '',
  primary key (system_id, locale)
);

create table public.anatomical_structures (
  id text primary key,
  system_id text not null references public.systems(id) on delete restrict,
  parent_id text references public.anatomical_structures(id) on delete restrict,
  slug extensions.citext not null unique,
  canonical_name text not null,
  latin_name text,
  fipat_id text,
  snomed_id text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  content_version integer not null default 1 check (content_version > 0),
  last_reviewed_at timestamptz,
  last_reviewed_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint anatomical_structure_not_own_parent check (parent_id is null or parent_id <> id)
);

create table public.structure_translations (
  structure_id text not null references public.anatomical_structures(id) on delete cascade,
  locale public.locale_code not null,
  name text not null,
  description text not null default '',
  anatomy text not null default '',
  physiology text not null default '',
  location text not null default '',
  blood_supply text,
  innervation text,
  clinical_notes text,
  primary key (structure_id, locale)
);

create table public.structure_synonyms (
  id uuid primary key default gen_random_uuid(),
  structure_id text not null references public.anatomical_structures(id) on delete cascade,
  locale public.locale_code not null,
  synonym extensions.citext not null,
  created_at timestamptz not null default now(),
  unique (structure_id, locale, synonym)
);

create table public.structure_relations (
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  related_structure_id text not null references public.anatomical_structures(id) on delete restrict,
  relation_type text not null default 'related',
  created_at timestamptz not null default now(),
  primary key (structure_id, related_structure_id, relation_type),
  constraint structure_relation_not_self check (structure_id <> related_structure_id)
);

create table public.physiology_topics (
  id text primary key,
  slug extensions.citext not null unique,
  canonical_name text not null,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  visual_config jsonb not null default '{}'::jsonb check (jsonb_typeof(visual_config) = 'object'),
  content_version integer not null default 1 check (content_version > 0),
  last_reviewed_at timestamptz,
  last_reviewed_by uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.physiology_translations (
  physiology_topic_id text not null references public.physiology_topics(id) on delete cascade,
  locale public.locale_code not null,
  name text not null,
  summary text not null default '',
  mechanism text not null default '',
  clinical_notes text,
  primary key (physiology_topic_id, locale)
);

create table public.structure_physiology (
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  physiology_topic_id text not null references public.physiology_topics(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (structure_id, physiology_topic_id)
);

create table public.diseases (
  id text primary key,
  slug extensions.citext not null unique,
  canonical_name text not null,
  icd_code text,
  snomed_id text,
  status public.content_status not null default 'draft',
  content_version integer not null default 1 check (content_version > 0),
  last_reviewed_at timestamptz,
  last_reviewed_by uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.disease_translations (
  disease_id text not null references public.diseases(id) on delete cascade,
  locale public.locale_code not null,
  name text not null,
  summary text not null default '',
  etiology text not null default '',
  pathogenesis text not null default '',
  morphology text not null default '',
  functional_effects text not null default '',
  complications text,
  clinical_notes text,
  primary key (disease_id, locale)
);

create table public.disease_structures (
  disease_id text not null references public.diseases(id) on delete restrict,
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  is_primary boolean not null default false,
  primary key (disease_id, structure_id)
);

create table public.disease_stages (
  id text primary key,
  disease_id text not null references public.diseases(id) on delete restrict,
  stage_order integer not null check (stage_order >= 0),
  progress_min numeric(4,3) not null check (progress_min >= 0 and progress_min <= 1),
  progress_max numeric(4,3) not null check (progress_max >= 0 and progress_max <= 1),
  visual_config jsonb not null default '{}'::jsonb check (jsonb_typeof(visual_config) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint disease_stage_progress_range check (progress_min <= progress_max),
  unique (disease_id, stage_order)
);

create table public.disease_stage_translations (
  disease_stage_id text not null references public.disease_stages(id) on delete cascade,
  locale public.locale_code not null,
  name text not null,
  description text not null default '',
  primary key (disease_stage_id, locale)
);

create table public.references (
  id text primary key,
  title text not null,
  authors text[] not null default '{}',
  publication text,
  publisher text,
  edition text,
  publication_year integer check (publication_year between 1500 and 2200),
  doi text,
  pmid text,
  url text,
  reference_type text not null default 'textbook',
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.structure_references (
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  reference_id text not null references public.references(id) on delete restrict,
  section_key text,
  locator text,
  primary key (structure_id, reference_id, section_key)
);

create table public.disease_references (
  disease_id text not null references public.diseases(id) on delete restrict,
  reference_id text not null references public.references(id) on delete restrict,
  section_key text,
  locator text,
  primary key (disease_id, reference_id, section_key)
);

create table public.physiology_references (
  physiology_topic_id text not null references public.physiology_topics(id) on delete restrict,
  reference_id text not null references public.references(id) on delete restrict,
  section_key text,
  locator text,
  primary key (physiology_topic_id, reference_id, section_key)
);

create table public.three_d_assets (
  id uuid primary key default gen_random_uuid(),
  system_id text not null references public.systems(id) on delete restrict,
  root_structure_id text references public.anatomical_structures(id) on delete restrict,
  name text not null,
  asset_type text not null check (asset_type in ('model', 'image', 'thumbnail', 'procedural')),
  storage_bucket text,
  storage_path text,
  format text not null check (format in ('glb', 'gltf', 'ktx2', 'png', 'jpg', 'webp', 'procedural')),
  file_size bigint check (file_size is null or file_size >= 0),
  version text not null,
  license text not null,
  source_url text,
  attribution text not null,
  status public.content_status not null default 'draft',
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint three_d_asset_storage_pair check (
    (storage_bucket is null and storage_path is null)
    or (storage_bucket is not null and storage_path is not null)
  ),
  unique (system_id, name, version)
);

create table public.mesh_mappings (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.three_d_assets(id) on delete restrict,
  mesh_name text not null,
  structure_id text not null references public.anatomical_structures(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (asset_id, mesh_name)
);

create table public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  entity_type public.content_entity_type not null,
  entity_id text not null,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  decision public.review_decision not null default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type public.content_entity_type not null,
  entity_id text not null,
  version_number integer not null check (version_number > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, version_number)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type public.content_entity_type not null,
  entity_id text not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.profiles
  where id = (select auth.uid()) and status = 'active'
$$;

create or replace function private.has_any_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(private.current_app_role() = any(allowed_roles), false)
$$;

create or replace function private.can_edit_content(
  target_type public.content_entity_type,
  target_id text
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_status public.content_status;
begin
  if private.current_app_role() = 'admin' then return true; end if;
  if private.current_app_role() <> 'editor' then return false; end if;

  case target_type
    when 'system' then select status into target_status from public.systems where id = target_id;
    when 'structure' then select status into target_status from public.anatomical_structures where id = target_id;
    when 'disease' then select status into target_status from public.diseases where id = target_id;
    when 'physiology_topic' then select status into target_status from public.physiology_topics where id = target_id;
    when 'reference' then select status into target_status from public.references where id = target_id;
    when 'three_d_asset' then select status into target_status from public.three_d_assets where id::text = target_id;
  end case;

  return coalesce(target_status in ('draft', 'rejected'), false);
end;
$$;

revoke all on function private.handle_new_user() from public;
revoke all on function private.current_app_role() from public;
revoke all on function private.has_any_role(public.app_role[]) from public;
revoke all on function private.can_edit_content(public.content_entity_type, text) from public;
grant usage on schema private to authenticated;
grant execute on function private.current_app_role() to authenticated;
grant execute on function private.has_any_role(public.app_role[]) to authenticated;
grant execute on function private.can_edit_content(public.content_entity_type, text) to authenticated;

create or replace function private.capture_content_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  item_type public.content_entity_type := tg_argv[0]::public.content_entity_type;
  item_id text;
  actor uuid;
  next_version integer;
  action_name text;
begin
  item_id := case when tg_op = 'DELETE' then old.id::text else new.id::text end;
  actor := case when tg_op = 'DELETE' then old.updated_by else coalesce(new.updated_by, new.created_by) end;
  action_name := case
    when tg_op = 'INSERT' then 'created'
    when tg_op = 'DELETE' then 'deleted'
    when old.status is distinct from new.status then new.status::text
    else 'edited'
  end;

  insert into public.audit_log (actor_id, entity_type, entity_id, action, before_state, after_state)
  values (
    coalesce(actor, auth.uid()),
    item_type,
    item_id,
    action_name,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end
  );

  if tg_op <> 'DELETE' then
    select coalesce(max(version_number), 0) + 1
    into next_version
    from public.content_versions
    where entity_type = item_type and entity_id = item_id;

    insert into public.content_versions (
      entity_type,
      entity_id,
      version_number,
      snapshot,
      created_by
    ) values (item_type, item_id, next_version, to_jsonb(new), coalesce(actor, auth.uid()));
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function private.assert_content_target()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_exists boolean := false;
begin
  case new.entity_type
    when 'system' then select exists(select 1 from public.systems where id = new.entity_id) into target_exists;
    when 'structure' then select exists(select 1 from public.anatomical_structures where id = new.entity_id) into target_exists;
    when 'disease' then select exists(select 1 from public.diseases where id = new.entity_id) into target_exists;
    when 'physiology_topic' then select exists(select 1 from public.physiology_topics where id = new.entity_id) into target_exists;
    when 'reference' then select exists(select 1 from public.references where id = new.entity_id) into target_exists;
    when 'three_d_asset' then select exists(select 1 from public.three_d_assets where id::text = new.entity_id) into target_exists;
  end case;
  if not target_exists then raise exception 'Unknown content target %.%', new.entity_type, new.entity_id; end if;
  return new;
end;
$$;

create trigger validate_review_target
before insert or update on public.content_reviews
for each row execute function private.assert_content_target();

create trigger validate_version_target
before insert or update on public.content_versions
for each row execute function private.assert_content_target();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'systems', 'anatomical_structures', 'physiology_topics', 'diseases',
    'disease_stages', 'references', 'three_d_assets', 'mesh_mappings'
  ] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function private.touch_updated_at()',
      table_name || '_touch_updated_at',
      table_name
    );
  end loop;
end;
$$;

create trigger systems_content_history
after insert or update or delete on public.systems
for each row execute function private.capture_content_change('system');
create trigger structures_content_history
after insert or update or delete on public.anatomical_structures
for each row execute function private.capture_content_change('structure');
create trigger physiology_content_history
after insert or update or delete on public.physiology_topics
for each row execute function private.capture_content_change('physiology_topic');
create trigger diseases_content_history
after insert or update or delete on public.diseases
for each row execute function private.capture_content_change('disease');
create trigger references_content_history
after insert or update or delete on public.references
for each row execute function private.capture_content_change('reference');
create trigger assets_content_history
after insert or update or delete on public.three_d_assets
for each row execute function private.capture_content_change('three_d_asset');

create index systems_status_sort_idx on public.systems(status, sort_order) where deleted_at is null;
create index anatomical_structures_system_idx on public.anatomical_structures(system_id, sort_order) where deleted_at is null;
create index anatomical_structures_parent_idx on public.anatomical_structures(parent_id) where deleted_at is null;
create index anatomical_structures_status_idx on public.anatomical_structures(status) where deleted_at is null;
create index anatomical_structures_name_trgm_idx on public.anatomical_structures using gin (canonical_name extensions.gin_trgm_ops);
create index structure_translations_locale_name_idx on public.structure_translations(locale, name);
create index structure_translations_name_trgm_idx on public.structure_translations using gin (name extensions.gin_trgm_ops);
create index structure_synonyms_search_idx on public.structure_synonyms using gin (synonym extensions.gin_trgm_ops);
create index structure_relations_related_idx on public.structure_relations(related_structure_id, structure_id);
create index physiology_topics_status_idx on public.physiology_topics(status) where deleted_at is null;
create index diseases_status_idx on public.diseases(status) where deleted_at is null;
create index disease_translations_name_trgm_idx on public.disease_translations using gin (name extensions.gin_trgm_ops);
create index disease_structures_structure_idx on public.disease_structures(structure_id, disease_id);
create index disease_stages_disease_idx on public.disease_stages(disease_id, stage_order);
create index references_status_year_idx on public.references(status, publication_year desc) where deleted_at is null;
create unique index references_doi_unique_idx on public.references(doi) where doi is not null and deleted_at is null;
create unique index references_pmid_unique_idx on public.references(pmid) where pmid is not null and deleted_at is null;
create index three_d_assets_system_idx on public.three_d_assets(system_id, status) where deleted_at is null;
create index mesh_mappings_structure_idx on public.mesh_mappings(structure_id);
create index content_reviews_target_idx on public.content_reviews(entity_type, entity_id, created_at desc);
create index content_reviews_reviewer_idx on public.content_reviews(reviewer_id, decision);
create index content_versions_target_idx on public.content_versions(entity_type, entity_id, version_number desc);
create index audit_log_target_idx on public.audit_log(entity_type, entity_id, created_at desc);
create index audit_log_actor_idx on public.audit_log(actor_id, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'systems', 'system_translations', 'anatomical_structures',
    'structure_translations', 'structure_synonyms', 'structure_relations', 'physiology_topics',
    'physiology_translations', 'structure_physiology', 'diseases',
    'disease_translations', 'disease_structures', 'disease_stages',
    'disease_stage_translations', 'references', 'structure_references',
    'disease_references', 'physiology_references', 'three_d_assets',
    'mesh_mappings', 'content_reviews', 'content_versions', 'audit_log'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

create policy profiles_read_own
on public.profiles for select to authenticated
using (id = (select auth.uid()) or private.has_any_role(array['admin']::public.app_role[]));
create policy profiles_admin_manage
on public.profiles for all to authenticated
using (private.has_any_role(array['admin']::public.app_role[]))
with check (private.has_any_role(array['admin']::public.app_role[]));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'systems', 'anatomical_structures', 'physiology_topics', 'diseases', 'references', 'three_d_assets'
  ] loop
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (status = ''published'' and deleted_at is null)',
      table_name || '_public_read', table_name
    );
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.has_any_role(array[''editor'', ''reviewer'', ''admin'']::public.app_role[]))',
      table_name || '_staff_read', table_name
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((private.has_any_role(array[''editor'']::public.app_role[]) and status = ''draft'') or private.has_any_role(array[''admin'']::public.app_role[]))',
      table_name || '_staff_insert', table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((private.has_any_role(array[''editor'']::public.app_role[]) and status in (''draft'', ''rejected'')) or (private.has_any_role(array[''reviewer'']::public.app_role[]) and status = ''in_review'') or private.has_any_role(array[''admin'']::public.app_role[])) with check ((private.has_any_role(array[''editor'']::public.app_role[]) and status in (''draft'', ''in_review'', ''rejected'')) or (private.has_any_role(array[''reviewer'']::public.app_role[]) and status in (''approved'', ''rejected'')) or private.has_any_role(array[''admin'']::public.app_role[]))',
      table_name || '_workflow_update', table_name
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (private.has_any_role(array[''admin'']::public.app_role[]))',
      table_name || '_admin_delete', table_name
    );
  end loop;
end;
$$;

create policy system_translations_public_read on public.system_translations
for select to anon, authenticated using (
  exists(select 1 from public.systems s where s.id = system_id and s.status = 'published' and s.deleted_at is null)
);
create policy structure_translations_public_read on public.structure_translations
for select to anon, authenticated using (
  exists(select 1 from public.anatomical_structures s where s.id = structure_id and s.status = 'published' and s.deleted_at is null)
);
create policy physiology_translations_public_read on public.physiology_translations
for select to anon, authenticated using (
  exists(select 1 from public.physiology_topics p where p.id = physiology_topic_id and p.status = 'published' and p.deleted_at is null)
);
create policy disease_translations_public_read on public.disease_translations
for select to anon, authenticated using (
  exists(select 1 from public.diseases d where d.id = disease_id and d.status = 'published' and d.deleted_at is null)
);
create policy disease_stage_translations_public_read on public.disease_stage_translations
for select to anon, authenticated using (
  exists(
    select 1 from public.disease_stages ds join public.diseases d on d.id = ds.disease_id
    where ds.id = disease_stage_id and d.status = 'published' and d.deleted_at is null
  )
);
create policy structure_synonyms_public_read on public.structure_synonyms
for select to anon, authenticated using (
  exists(select 1 from public.anatomical_structures s where s.id = structure_id and s.status = 'published' and s.deleted_at is null)
);
create policy structure_relations_public_read on public.structure_relations
for select to anon, authenticated using (
  exists(select 1 from public.anatomical_structures s where s.id = structure_id and s.status = 'published' and s.deleted_at is null)
  and exists(select 1 from public.anatomical_structures r where r.id = related_structure_id and r.status = 'published' and r.deleted_at is null)
);
create policy structure_relations_staff_manage on public.structure_relations
for all to authenticated
using (private.can_edit_content('structure', structure_id))
with check (private.can_edit_content('structure', structure_id));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'system_translations', 'structure_translations', 'structure_synonyms',
    'physiology_translations', 'disease_translations', 'disease_stage_translations'
  ] loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.has_any_role(array[''editor'', ''reviewer'', ''admin'']::public.app_role[]))',
      table_name || '_staff_read', table_name
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (private.has_any_role(array[''admin'']::public.app_role[]))',
      table_name || '_admin_delete', table_name
    );
  end loop;
end;
$$;

create policy system_translations_staff_write on public.system_translations
for all to authenticated
using (private.can_edit_content('system', system_id))
with check (private.can_edit_content('system', system_id));
create policy structure_translations_staff_write on public.structure_translations
for all to authenticated
using (private.can_edit_content('structure', structure_id))
with check (private.can_edit_content('structure', structure_id));
create policy structure_synonyms_staff_write on public.structure_synonyms
for all to authenticated
using (private.can_edit_content('structure', structure_id))
with check (private.can_edit_content('structure', structure_id));
create policy physiology_translations_staff_write on public.physiology_translations
for all to authenticated
using (private.can_edit_content('physiology_topic', physiology_topic_id))
with check (private.can_edit_content('physiology_topic', physiology_topic_id));
create policy disease_translations_staff_write on public.disease_translations
for all to authenticated
using (private.can_edit_content('disease', disease_id))
with check (private.can_edit_content('disease', disease_id));
create policy disease_stage_translations_staff_write on public.disease_stage_translations
for all to authenticated
using (
  exists(
    select 1 from public.disease_stages ds
    where ds.id = disease_stage_id and private.can_edit_content('disease', ds.disease_id)
  )
)
with check (
  exists(
    select 1 from public.disease_stages ds
    where ds.id = disease_stage_id and private.can_edit_content('disease', ds.disease_id)
  )
);

create policy disease_stages_public_read on public.disease_stages
for select to anon, authenticated using (
  exists(select 1 from public.diseases d where d.id = disease_id and d.status = 'published' and d.deleted_at is null)
);
create policy disease_stages_staff_manage on public.disease_stages
for all to authenticated
using (
  private.has_any_role(array['reviewer']::public.app_role[])
  or private.can_edit_content('disease', disease_id)
)
with check (private.can_edit_content('disease', disease_id));
create policy mesh_mappings_public_read on public.mesh_mappings
for select to anon, authenticated using (
  exists(select 1 from public.three_d_assets a where a.id = asset_id and a.status = 'published' and a.deleted_at is null)
);
create policy mesh_mappings_staff_manage on public.mesh_mappings
for all to authenticated
using (
  private.has_any_role(array['reviewer']::public.app_role[])
  or private.can_edit_content('three_d_asset', asset_id::text)
)
with check (private.can_edit_content('three_d_asset', asset_id::text));

create policy structure_physiology_public_read on public.structure_physiology
for select to anon, authenticated using (
  exists(select 1 from public.anatomical_structures s where s.id = structure_id and s.status = 'published' and s.deleted_at is null)
  and exists(select 1 from public.physiology_topics p where p.id = physiology_topic_id and p.status = 'published' and p.deleted_at is null)
);
create policy structure_physiology_staff_manage on public.structure_physiology
for all to authenticated
using (private.can_edit_content('structure', structure_id))
with check (private.can_edit_content('structure', structure_id));

create policy disease_structures_public_read on public.disease_structures
for select to anon, authenticated using (
  exists(select 1 from public.diseases d where d.id = disease_id and d.status = 'published' and d.deleted_at is null)
  and exists(select 1 from public.anatomical_structures s where s.id = structure_id and s.status = 'published' and s.deleted_at is null)
);
create policy disease_structures_staff_manage on public.disease_structures
for all to authenticated
using (private.can_edit_content('disease', disease_id))
with check (private.can_edit_content('disease', disease_id));

create policy structure_references_public_read on public.structure_references
for select to anon, authenticated using (
  exists(select 1 from public.anatomical_structures s where s.id = structure_id and s.status = 'published' and s.deleted_at is null)
  and exists(select 1 from public.references r where r.id = reference_id and r.status = 'published' and r.deleted_at is null)
);
create policy structure_references_staff_manage on public.structure_references
for all to authenticated
using (private.can_edit_content('structure', structure_id))
with check (private.can_edit_content('structure', structure_id));

create policy disease_references_public_read on public.disease_references
for select to anon, authenticated using (
  exists(select 1 from public.diseases d where d.id = disease_id and d.status = 'published' and d.deleted_at is null)
  and exists(select 1 from public.references r where r.id = reference_id and r.status = 'published' and r.deleted_at is null)
);
create policy disease_references_staff_manage on public.disease_references
for all to authenticated
using (private.can_edit_content('disease', disease_id))
with check (private.can_edit_content('disease', disease_id));

create policy physiology_references_public_read on public.physiology_references
for select to anon, authenticated using (
  exists(select 1 from public.physiology_topics p where p.id = physiology_topic_id and p.status = 'published' and p.deleted_at is null)
  and exists(select 1 from public.references r where r.id = reference_id and r.status = 'published' and r.deleted_at is null)
);
create policy physiology_references_staff_manage on public.physiology_references
for all to authenticated
using (private.can_edit_content('physiology_topic', physiology_topic_id))
with check (private.can_edit_content('physiology_topic', physiology_topic_id));

create policy content_reviews_staff_read on public.content_reviews
for select to authenticated using (private.has_any_role(array['editor', 'reviewer', 'admin']::public.app_role[]));
create policy content_reviews_reviewer_insert on public.content_reviews
for insert to authenticated with check (
  reviewer_id = auth.uid() and private.has_any_role(array['reviewer', 'admin']::public.app_role[])
);
create policy content_reviews_reviewer_update on public.content_reviews
for update to authenticated
using (reviewer_id = auth.uid() or private.has_any_role(array['admin']::public.app_role[]))
with check (reviewer_id = auth.uid() or private.has_any_role(array['admin']::public.app_role[]));
create policy content_versions_staff_read on public.content_versions
for select to authenticated using (private.has_any_role(array['editor', 'reviewer', 'admin']::public.app_role[]));
create policy audit_log_staff_read on public.audit_log
for select to authenticated using (private.has_any_role(array['reviewer', 'admin']::public.app_role[]));

grant select on public.systems, public.system_translations, public.anatomical_structures,
  public.structure_translations, public.structure_synonyms, public.structure_relations, public.physiology_topics,
  public.physiology_translations, public.structure_physiology, public.diseases,
  public.disease_translations, public.disease_structures, public.disease_stages,
  public.disease_stage_translations, public.references, public.structure_references,
  public.disease_references, public.physiology_references, public.three_d_assets,
  public.mesh_mappings to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create or replace function public.search_medical_content(
  search_query text,
  result_limit integer default 12
)
returns table (
  id text,
  result_type text,
  system_id text,
  name_en text,
  name_ar text,
  href text
)
language sql
stable
security invoker
set search_path = ''
as $$
  with normalized as (
    select '%' || trim(search_query) || '%' as pattern
  ),
  structure_results as (
    select distinct
      structure.id,
      'structure'::text as result_type,
      structure.system_id,
      en.name as name_en,
      ar.name as name_ar,
      '/atlas/structure/' || structure.id as href,
      1 as priority
    from public.anatomical_structures structure
    join public.structure_translations en on en.structure_id = structure.id and en.locale = 'en'
    join public.structure_translations ar on ar.structure_id = structure.id and ar.locale = 'ar'
    cross join normalized
    where structure.status = 'published'
      and structure.deleted_at is null
      and (
        structure.canonical_name ilike normalized.pattern
        or coalesce(structure.latin_name, '') ilike normalized.pattern
        or en.name ilike normalized.pattern
        or ar.name ilike normalized.pattern
        or exists(
          select 1 from public.structure_synonyms synonym
          where synonym.structure_id = structure.id and synonym.synonym ilike normalized.pattern
        )
      )
  ),
  system_results as (
    select
      system.id,
      'system'::text,
      system.id,
      en.name,
      ar.name,
      '/systems/' || system.slug,
      2
    from public.systems system
    join public.system_translations en on en.system_id = system.id and en.locale = 'en'
    join public.system_translations ar on ar.system_id = system.id and ar.locale = 'ar'
    cross join normalized
    where system.status = 'published'
      and system.deleted_at is null
      and (system.canonical_name ilike normalized.pattern or en.name ilike normalized.pattern or ar.name ilike normalized.pattern)
  ),
  disease_results as (
    select
      disease.id,
      'disease'::text,
      null::text,
      en.name,
      ar.name,
      '/disease/' || disease.id,
      3
    from public.diseases disease
    join public.disease_translations en on en.disease_id = disease.id and en.locale = 'en'
    join public.disease_translations ar on ar.disease_id = disease.id and ar.locale = 'ar'
    cross join normalized
    where disease.status = 'published'
      and disease.deleted_at is null
      and (disease.canonical_name ilike normalized.pattern or en.name ilike normalized.pattern or ar.name ilike normalized.pattern)
  )
  select result.id, result.result_type, result.system_id, result.name_en, result.name_ar, result.href
  from (
    select * from structure_results
    union all
    select * from system_results
    union all
    select * from disease_results
  ) result
  where length(trim(search_query)) >= 2
  order by result.priority, result.name_en
  limit greatest(1, least(result_limit, 50))
$$;

grant execute on function public.search_medical_content(text, integer) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('medical-models', 'medical-models', false, 524288000, array['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']),
  ('medical-images', 'medical-images', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('thumbnails', 'thumbnails', false, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy published_medical_assets_read on storage.objects
for select to anon, authenticated using (
  bucket_id in ('medical-models', 'medical-images', 'thumbnails')
  and exists(
    select 1 from public.three_d_assets asset
    where asset.storage_bucket = bucket_id
      and asset.storage_path = name
      and asset.status = 'published'
      and asset.deleted_at is null
  )
);
create policy medical_assets_staff_read on storage.objects
for select to authenticated using (
  bucket_id in ('medical-models', 'medical-images', 'thumbnails')
  and private.has_any_role(array['editor', 'reviewer', 'admin']::public.app_role[])
);
create policy medical_assets_staff_insert on storage.objects
for insert to authenticated with check (
  bucket_id in ('medical-models', 'medical-images', 'thumbnails')
  and private.has_any_role(array['editor', 'admin']::public.app_role[])
);
create policy medical_assets_staff_update on storage.objects
for update to authenticated
using (
  bucket_id in ('medical-models', 'medical-images', 'thumbnails')
  and private.has_any_role(array['editor', 'admin']::public.app_role[])
)
with check (
  bucket_id in ('medical-models', 'medical-images', 'thumbnails')
  and private.has_any_role(array['editor', 'admin']::public.app_role[])
);
create policy medical_assets_admin_delete on storage.objects
for delete to authenticated using (
  bucket_id in ('medical-models', 'medical-images', 'thumbnails')
  and private.has_any_role(array['admin']::public.app_role[])
);
