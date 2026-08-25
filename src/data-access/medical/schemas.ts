import { z } from "zod";

export const localeSchema = z.enum(["en", "ar"]);

export const localizedTranslationSchema = z.object({
  locale: localeSchema,
  name: z.string(),
  description: z.string().default(""),
});

export const systemMetadataSchema = z.object({
  icon: z.string().default("circle"),
  accentColor: z.string().default("#718394"),
});

export const structureMetadataSchema = z.object({
  labelAnchor: z.tuple([z.number(), z.number(), z.number()]).optional(),
  studyNumber: z.number().int().positive().optional(),
});

export const diseaseVisualConfigSchema = z.object({
  morphTarget: z.string().optional(),
  materialPreset: z.string().optional(),
  animationPreset: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .optional(),
  opacity: z.number().min(0).max(1).optional(),
  scaleMultiplier: z.number().min(-0.9).max(4).optional(),
});

export const systemRowsSchema = z.array(
  z.object({
    id: z.string(),
    slug: z.string(),
    is_available: z.boolean(),
    sort_order: z.number(),
    metadata: z.unknown(),
    system_translations: z.array(localizedTranslationSchema),
  }),
);

const structureTranslationSchema = localizedTranslationSchema.extend({
  anatomy: z.string().default(""),
  physiology: z.string().default(""),
  location: z.string().default(""),
  blood_supply: z.string().nullable(),
  innervation: z.string().nullable(),
});

export const structureRowsSchema = z.array(
  z.object({
    id: z.string(),
    system_id: z.string(),
    parent_id: z.string().nullable(),
    latin_name: z.string().nullable(),
    sort_order: z.number(),
    metadata: z.unknown(),
    structure_translations: z.array(structureTranslationSchema),
    structure_relations: z.array(z.object({ related_structure_id: z.string() })),
    disease_structures: z.array(z.object({ disease_id: z.string() })),
    structure_references: z.array(z.object({ reference_id: z.string() })),
    mesh_mappings: z.array(z.object({ mesh_name: z.string() })),
  }),
);

const diseaseTranslationSchema = z.object({
  locale: localeSchema,
  name: z.string(),
  summary: z.string().default(""),
  etiology: z.string().default(""),
  pathogenesis: z.string().default(""),
  morphology: z.string().default(""),
  functional_effects: z.string().default(""),
});

const diseaseStageTranslationSchema = z.object({
  locale: localeSchema,
  name: z.string(),
  description: z.string().default(""),
});

export const diseaseRowsSchema = z.array(
  z.object({
    id: z.string(),
    disease_translations: z.array(diseaseTranslationSchema),
    disease_structures: z.array(z.object({ structure_id: z.string() })),
    disease_references: z.array(z.object({ reference_id: z.string() })),
    disease_stages: z.array(
      z.object({
        id: z.string(),
        stage_order: z.number(),
        visual_config: z.unknown(),
        disease_stage_translations: z.array(diseaseStageTranslationSchema),
      }),
    ),
  }),
);

export const referenceRowsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    publication_year: z.number().nullable(),
    edition: z.string().nullable(),
    publisher: z.string().nullable(),
    doi: z.string().nullable(),
    pmid: z.string().nullable(),
    url: z.string().nullable(),
    reference_type: z.string(),
  }),
);

export const assetRowsSchema = z.array(
  z.object({
    id: z.string(),
    system_id: z.string(),
    root_structure_id: z.string().nullable(),
    name: z.string(),
    asset_type: z.string(),
    storage_bucket: z.string().nullable(),
    storage_path: z.string().nullable(),
    format: z.string(),
    version: z.string(),
    license: z.string(),
    attribution: z.string(),
    metadata: z.unknown(),
    mesh_mappings: z.array(z.object({ mesh_name: z.string(), structure_id: z.string() })),
  }),
);

export const searchRowsSchema = z.array(
  z.object({
    id: z.string(),
    result_type: z.enum(["system", "structure", "disease"]),
    system_id: z.string().nullable(),
    name_en: z.string(),
    name_ar: z.string(),
    href: z.string(),
  }),
);

export const contentStatusSchema = z.enum([
  "draft",
  "in_review",
  "approved",
  "published",
  "rejected",
  "archived",
]);

export const localizedEditorSchema = z.object({
  en: z.string().trim().min(2).max(20_000),
  ar: z.string().trim().min(2).max(20_000),
});
