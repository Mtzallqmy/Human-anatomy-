import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/src/lib/supabase/client";
import type { Database, Json } from "@/src/types/database";
import {
  assetDraftSchema,
  diseaseDraftSchema,
  diseaseStageDraftSchema,
  physiologyDraftSchema,
  referenceDraftSchema,
  structureDraftSchema,
  systemDraftSchema,
  type StructureDraftInput,
} from "./adminSchemas";
import {
  imagingAnnotationSchema,
  imagingStudyDraftSchema,
  imagingUploadSchema,
} from "@/src/data-access/imaging/schemas";

type Client = SupabaseClient<Database>;
type ContentStatus = Database["public"]["Enums"]["content_status"];
type EntityType = Database["public"]["Enums"]["content_entity_type"];
type AppRole = Database["public"]["Enums"]["app_role"];
type Resource =
  "systems" | "anatomical_structures" | "diseases" | "physiology_topics" | "references" | "three_d_assets";
type DashboardResource = Resource | "imaging_studies";

function client(): Client {
  const value = getSupabaseClient();
  if (!value) throw new Error("Supabase is not configured.");
  return value;
}

function assertResult(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export const adminRepository = {
  async dashboard() {
    const db = client();
    const resources: DashboardResource[] = [
      "systems",
      "anatomical_structures",
      "diseases",
      "physiology_topics",
      "references",
      "three_d_assets",
      "imaging_studies",
    ];
    const values = await Promise.all(
      resources.map(async (resource) => {
        const { count, error } = await db.from(resource).select("*", { count: "exact", head: true });
        assertResult(error);
        return [resource, count ?? 0] as const;
      }),
    );
    const { count: waiting, error: waitingError } = await db
      .from("anatomical_structures")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_review");
    assertResult(waitingError);
    return { ...Object.fromEntries(values), waiting: waiting ?? 0 } as Record<
      DashboardResource | "waiting",
      number
    >;
  },

  async list(resource: Resource, page = 0, pageSize = 25) {
    const { data, error, count } = await client()
      .from(resource)
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);
    assertResult(error);
    return { rows: data ?? [], count: count ?? 0 };
  },

  async createStructure(raw: StructureDraftInput) {
    const input = structureDraftSchema.parse(raw);
    const db = client();
    const { error: structureError } = await db.from("anatomical_structures").insert({
      id: input.id,
      system_id: input.systemId,
      parent_id: input.parentId || null,
      slug: input.slug,
      canonical_name: input.canonicalName,
      latin_name: input.latinName || null,
      status: "draft",
    });
    assertResult(structureError);
    const { error: translationError } = await db.from("structure_translations").insert([
      {
        structure_id: input.id,
        locale: "en",
        name: input.name.en,
        description: input.description.en,
        anatomy: input.anatomy.en,
        physiology: input.physiology.en,
        location: input.location.en,
      },
      {
        structure_id: input.id,
        locale: "ar",
        name: input.name.ar,
        description: input.description.ar,
        anatomy: input.anatomy.ar,
        physiology: input.physiology.ar,
        location: input.location.ar,
      },
    ]);
    assertResult(translationError);
    return input.id;
  },

  async createReference(raw: unknown) {
    const input = referenceDraftSchema.parse(raw);
    const { error } = await client()
      .from("references")
      .insert({
        id: input.id,
        title: input.title,
        authors: input.authors,
        publisher: input.publisher || null,
        edition: input.edition || null,
        publication_year: input.publicationYear ?? null,
        doi: input.doi || null,
        pmid: input.pmid || null,
        url: input.url || null,
        status: "draft",
      });
    assertResult(error);
  },

  async createDisease(raw: unknown) {
    const input = diseaseDraftSchema.parse(raw);
    const db = client();
    const { error } = await db
      .from("diseases")
      .insert({ id: input.id, slug: input.slug, canonical_name: input.canonicalName, status: "draft" });
    assertResult(error);
    const { error: translationError } = await db.from("disease_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        disease_id: input.id,
        locale,
        name: input.name[locale],
        summary: input.summary[locale],
        etiology: input.etiology[locale],
        pathogenesis: input.pathogenesis[locale],
        morphology: input.morphology[locale],
        functional_effects: input.functionalEffects[locale],
      })),
    );
    assertResult(translationError);
    const { error: relationError } = await db.from("disease_structures").insert(
      input.affectedStructureIds.map((structureId, index) => ({
        disease_id: input.id,
        structure_id: structureId,
        is_primary: index === 0,
      })),
    );
    assertResult(relationError);
  },

  async createDiseaseStage(raw: unknown) {
    const input = diseaseStageDraftSchema.parse(raw);
    const db = client();
    const { error } = await db.from("disease_stages").insert({
      id: input.id,
      disease_id: input.diseaseId,
      stage_order: input.order,
      progress_min: input.progressMin,
      progress_max: input.progressMax,
      visual_config: input.visualConfig as Json,
    });
    assertResult(error);
    const { error: translationError } = await db.from("disease_stage_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        disease_stage_id: input.id,
        locale,
        name: input.name[locale],
        description: input.description[locale],
      })),
    );
    assertResult(translationError);
  },

  async createPhysiology(raw: unknown) {
    const input = physiologyDraftSchema.parse(raw);
    const db = client();
    const { error } = await db
      .from("physiology_topics")
      .insert({ id: input.id, slug: input.slug, canonical_name: input.canonicalName, status: "draft" });
    assertResult(error);
    const { error: translationError } = await db.from("physiology_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        physiology_topic_id: input.id,
        locale,
        name: input.name[locale],
        summary: input.summary[locale],
        mechanism: input.mechanism[locale],
      })),
    );
    assertResult(translationError);
  },

  async createSystem(raw: unknown) {
    const input = systemDraftSchema.parse(raw);
    const db = client();
    const { error } = await db.from("systems").insert({
      id: input.id,
      slug: input.slug,
      canonical_name: input.canonicalName,
      status: "draft",
      is_available: false,
    });
    assertResult(error);
    const { error: translationError } = await db.from("system_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        system_id: input.id,
        locale,
        name: input.name[locale],
        description: input.description[locale],
      })),
    );
    assertResult(translationError);
  },

  async transition(resource: Resource, id: string, status: ContentStatus) {
    const idColumn = resource === "three_d_assets" ? "id" : "id";
    const { error } = await client().from(resource).update({ status }).eq(idColumn, id);
    assertResult(error);
  },

  async rename(resource: Resource, id: string, value: string) {
    const db = client();
    if (resource === "references") {
      const { error } = await db.from("references").update({ title: value }).eq("id", id);
      assertResult(error);
      return;
    }
    if (resource === "three_d_assets") {
      const { error } = await db.from("three_d_assets").update({ name: value }).eq("id", id);
      assertResult(error);
      return;
    }
    const table = resource as "systems" | "anatomical_structures" | "diseases" | "physiology_topics";
    const { error } = await db.from(table).update({ canonical_name: value }).eq("id", id);
    assertResult(error);
  },

  async updateSystemSettings(id: string, isAvailable: boolean, sortOrder: number) {
    const { error } = await client()
      .from("systems")
      .update({ is_available: isAvailable, sort_order: sortOrder })
      .eq("id", id);
    assertResult(error);
  },

  async review(
    entityType: EntityType,
    entityId: string,
    decision: "approved" | "rejected" | "changes_requested",
    notes: string,
    reviewerId: string,
  ) {
    const db = client();
    const { error: reviewError } = await db.from("content_reviews").insert({
      entity_type: entityType,
      entity_id: entityId,
      reviewer_id: reviewerId,
      decision,
      notes,
      reviewed_at: new Date().toISOString(),
    });
    assertResult(reviewError);
    const resource = (
      {
        structure: "anatomical_structures",
        disease: "diseases",
        physiology_topic: "physiology_topics",
        reference: "references",
        system: "systems",
        three_d_asset: "three_d_assets",
      } as const
    )[entityType];
    await this.transition(resource, entityId, decision === "approved" ? "approved" : "rejected");
  },

  async uploadAsset(file: File, raw: unknown) {
    const input = assetDraftSchema.parse(raw);
    if (!/\.(glb|gltf)$/i.test(file.name)) throw new Error("Only GLB or GLTF files are supported.");
    const db = client();
    const path = `${input.systemId.toLowerCase()}/${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${input.version}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await db.storage
      .from("medical-models")
      .upload(path, file, { upsert: false, contentType: file.type || "model/gltf-binary" });
    assertResult(uploadError);
    const { data, error } = await db
      .from("three_d_assets")
      .insert({
        system_id: input.systemId,
        root_structure_id: input.rootStructureId || null,
        name: input.name,
        asset_type: "model",
        storage_bucket: "medical-models",
        storage_path: path,
        format: file.name.toLowerCase().endsWith(".gltf") ? "gltf" : "glb",
        file_size: file.size,
        version: input.version,
        license: input.license,
        attribution: input.attribution,
        status: "draft",
      })
      .select("id")
      .single();
    assertResult(error);
    return data?.id;
  },

  async saveMeshMappings(assetId: string, mappings: Array<{ meshName: string; structureId: string }>) {
    const { error } = await client()
      .from("mesh_mappings")
      .upsert(
        mappings.map((item) => ({
          asset_id: assetId,
          mesh_name: item.meshName,
          structure_id: item.structureId,
        })),
        { onConflict: "asset_id,mesh_name" },
      );
    assertResult(error);
  },

  async listProfiles() {
    const { data, error } = await client()
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    assertResult(error);
    return data ?? [];
  },

  async updateProfile(id: string, role: AppRole, status: "pending" | "active" | "suspended") {
    const { error } = await client().from("profiles").update({ role, status }).eq("id", id);
    assertResult(error);
  },

  async listImagingStudies() {
    const { data, error } = await client()
      .from("imaging_studies")
      .select(
        "id,slug,modality,body_region,classification,status,source,license,attribution,de_identified,educational_use,review_due_at,updated_at,imaging_study_translations(locale,title,description),imaging_structure_links(structure_id)",
      )
      .order("updated_at", { ascending: false });
    assertResult(error);
    return data ?? [];
  },

  async createImagingStudy(
    raw: unknown,
    series: {
      id: string;
      orientation: "axial" | "coronal" | "sagittal" | "projection" | "microscopy";
      name: { en: string; ar: string };
      sequence?: string;
    },
    structureIds: string[],
  ) {
    const input = imagingStudyDraftSchema.parse(raw);
    if (!/^SER_[A-Z0-9_]+$/.test(series.id)) throw new Error("Series ID must start with SER_.");
    const db = client();
    const { error } = await db.from("imaging_studies").insert({
      id: input.id,
      slug: input.slug,
      modality: input.modality,
      body_region: input.bodyRegion,
      classification: input.classification,
      source: input.source,
      license: input.license,
      attribution: input.attribution,
      de_identified: input.deIdentified,
      educational_use: input.educationalUse,
      status: "draft",
    });
    assertResult(error);
    const { error: translationError } = await db.from("imaging_study_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        study_id: input.id,
        locale,
        title: input.title[locale],
        description: input.description[locale],
      })),
    );
    assertResult(translationError);
    const { error: seriesError } = await db.from("imaging_series").insert({
      id: series.id,
      study_id: input.id,
      orientation: series.orientation,
      sequence_name: series.sequence ?? null,
    });
    assertResult(seriesError);
    const { error: seriesTranslationError } = await db.from("imaging_series_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        series_id: series.id,
        locale,
        name: series.name[locale],
      })),
    );
    assertResult(seriesTranslationError);
    if (structureIds.length) {
      const { error: linkError } = await db.from("imaging_structure_links").insert(
        structureIds.map((structureId, index) => ({
          study_id: input.id,
          structure_id: structureId,
          is_primary: index === 0,
        })),
      );
      assertResult(linkError);
    }
  },

  async uploadImagingFrames(studyId: string, seriesId: string, files: File[]) {
    if (files.length > 100) throw new Error("A batch may contain at most 100 web-ready frames.");
    const db = client();
    for (const [index, file] of files.entries()) {
      imagingUploadSchema.parse({ size: file.size, type: file.type });
      const safeName = `${String(index).padStart(4, "0")}-${crypto.randomUUID()}.webp`;
      const path = `draft/${studyId.toLowerCase()}/${seriesId.toLowerCase()}/frames/${safeName}`;
      const { error: uploadError } = await db.storage.from("medical-imaging").upload(path, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600",
      });
      assertResult(uploadError);
      const { error: frameError } = await db.from("imaging_frames").insert({
        id: `${seriesId}_FRAME_${String(index).padStart(4, "0")}`,
        series_id: seriesId,
        frame_index: index,
        storage_bucket: "medical-imaging",
        storage_path: path,
      });
      assertResult(frameError);
    }
  },

  async saveImagingAnnotation(raw: unknown, seriesId: string) {
    const input = imagingAnnotationSchema.parse(raw);
    const db = client();
    const { error } = await db.from("imaging_annotations").insert({
      id: input.id,
      series_id: seriesId,
      frame_index: input.frameIndex,
      structure_id: input.structureId,
      geometry_type: input.geometry.type,
      geometry: input.geometry as Json,
      color: input.color,
    });
    assertResult(error);
    const { error: translationError } = await db.from("imaging_annotation_translations").insert(
      (["en", "ar"] as const).map((locale) => ({
        annotation_id: input.id,
        locale,
        label: input.label[locale],
        description: input.description[locale],
      })),
    );
    assertResult(translationError);
  },

  async transitionImaging(id: string, status: ContentStatus) {
    const { error } = await client().from("imaging_studies").update({ status }).eq("id", id);
    assertResult(error);
  },
};

export type AdminResource = Resource;
