import { z } from "zod";
import { getSupabaseClient } from "@/src/lib/supabase/client";
import { annotationGeometrySchema } from "@/src/data-access/imaging/schemas";
import type { ImagingStudy, Locale, LocalizedText } from "@/src/types/medical";

const locale = z.enum(["en", "ar"]);
const translation = z.object({ locale, title: z.string(), description: z.string() });
const namedTranslation = z.object({ locale, name: z.string(), description: z.string() });
const annotationTranslation = z.object({ locale, label: z.string(), description: z.string() });
const rowSchema = z.object({
  id: z.string(),
  slug: z.string(),
  modality: z.enum(["CT", "MRI", "XRAY", "HISTOLOGY", "PATHOLOGY"]),
  body_region: z.string(),
  classification: z.enum(["anatomical", "radiologic", "illustrative", "conceptual_pathology"]),
  source: z.string(),
  license: z.string(),
  attribution: z.string(),
  de_identified: z.boolean(),
  educational_use: z.boolean(),
  status: z.enum(["draft", "in_review", "approved", "published", "rejected", "archived"]),
  content_version: z.number(),
  review_due_at: z.string().nullable(),
  imaging_study_translations: z.array(translation),
  imaging_structure_links: z.array(z.object({ structure_id: z.string() })),
  imaging_disease_links: z.array(z.object({ disease_id: z.string() })),
  imaging_references: z.array(z.object({ reference_id: z.string() })),
  imaging_series: z.array(
    z.object({
      id: z.string(),
      orientation: z.enum(["axial", "coronal", "sagittal", "projection", "microscopy"]),
      sequence_name: z.string().nullable(),
      sort_order: z.number(),
      imaging_series_translations: z.array(namedTranslation),
      imaging_frames: z.array(
        z.object({
          id: z.string(),
          frame_index: z.number(),
          storage_bucket: z.string().nullable(),
          storage_path: z.string().nullable(),
          thumbnail_path: z.string().nullable(),
          generated_variant: z
            .enum(["chest-ct", "brain-mri", "chest-xray", "liver-histology", "kidney-histology"])
            .nullable(),
        }),
      ),
      imaging_annotations: z.array(
        z.object({
          id: z.string(),
          frame_index: z.number(),
          structure_id: z.string(),
          geometry_type: z.enum(["point", "rectangle", "polygon"]),
          geometry: z.unknown(),
          color: z.string(),
          imaging_annotation_translations: z.array(annotationTranslation),
        }),
      ),
    }),
  ),
});

function localized<T extends { locale: Locale }>(rows: T[], get: (row: T) => string): LocalizedText {
  return {
    en: get(rows.find((item) => item.locale === "en") ?? rows[0]),
    ar: get(rows.find((item) => item.locale === "ar") ?? rows[0]),
  };
}

export const supabaseImagingRepository = {
  async getStudy(id: string): Promise<ImagingStudy | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
      .from("imaging_studies")
      .select(
        "id,slug,modality,body_region,classification,source,license,attribution,de_identified,educational_use,status,content_version,review_due_at,imaging_study_translations(locale,title,description),imaging_structure_links(structure_id),imaging_disease_links(disease_id),imaging_references(reference_id),imaging_series(id,orientation,sequence_name,sort_order,imaging_series_translations(locale,name,description),imaging_frames(id,frame_index,storage_bucket,storage_path,thumbnail_path,generated_variant),imaging_annotations(id,frame_index,structure_id,geometry_type,geometry,color,imaging_annotation_translations(locale,label,description)))",
      )
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(`Imaging study failed to load: ${error.message}`);
    if (!data) return null;
    const row = rowSchema.parse(data);
    const series = await Promise.all(
      row.imaging_series
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(async (item) => ({
          id: item.id,
          studyId: row.id,
          name: localized(item.imaging_series_translations, (value) => value.name),
          orientation: item.orientation,
          sequence: item.sequence_name ?? undefined,
          frames: await Promise.all(
            item.imaging_frames
              .sort((a, b) => a.frame_index - b.frame_index)
              .map(async (frame) => {
                let imageUrl: string | undefined;
                if (frame.storage_bucket && frame.storage_path) {
                  const { data: signed } = await client.storage
                    .from(frame.storage_bucket)
                    .createSignedUrl(frame.storage_path, 3600);
                  imageUrl = signed?.signedUrl;
                }
                return {
                  id: frame.id,
                  index: frame.frame_index,
                  imageUrl,
                  generatedVariant: frame.generated_variant ?? undefined,
                };
              }),
          ),
          annotations: item.imaging_annotations.map((annotation) => ({
            id: annotation.id,
            frameIndex: annotation.frame_index,
            structureId: annotation.structure_id,
            label: localized(annotation.imaging_annotation_translations, (value) => value.label),
            description: localized(annotation.imaging_annotation_translations, (value) => value.description),
            geometry: annotationGeometrySchema.parse({
              type: annotation.geometry_type,
              ...(annotation.geometry as object),
            }),
            color: annotation.color,
          })),
        })),
    );
    return {
      id: row.id,
      slug: row.slug,
      modality: row.modality,
      bodyRegion: row.body_region,
      title: localized(row.imaging_study_translations, (value) => value.title),
      description: localized(row.imaging_study_translations, (value) => value.description),
      classification: row.classification,
      structureIds: row.imaging_structure_links.map((item) => item.structure_id),
      diseaseIds: row.imaging_disease_links.map((item) => item.disease_id),
      series,
      referenceIds: row.imaging_references.map((item) => item.reference_id),
      source: row.source,
      license: row.license,
      attribution: row.attribution,
      deIdentified: row.de_identified,
      educationalUse: row.educational_use,
      status: row.status as ImagingStudy["status"],
      version: row.content_version,
      reviewDueAt: row.review_due_at ?? undefined,
    };
  },
};
