import { z } from "zod";

const bilingual = z.object({ en: z.string().trim().min(2), ar: z.string().trim().min(2) });

export const structureDraftSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^ANAT_[A-Z0-9_]+$/, "Use an ID such as ANAT_HEART_APEX"),
  systemId: z.string().trim().min(1),
  parentId: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  canonicalName: z.string().trim().min(2),
  latinName: z.string().trim().optional(),
  name: bilingual,
  description: bilingual,
  anatomy: bilingual,
  physiology: bilingual,
  location: bilingual,
});

export type StructureDraftInput = z.infer<typeof structureDraftSchema>;

export const referenceDraftSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^REF_[A-Z0-9_]+$/),
  title: z.string().trim().min(3),
  authors: z.array(z.string().trim().min(2)).min(1),
  publisher: z.string().trim().optional(),
  edition: z.string().trim().optional(),
  publicationYear: z.number().int().min(1500).max(2200).optional(),
  doi: z.string().trim().optional(),
  pmid: z.string().trim().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

export const assetDraftSchema = z.object({
  systemId: z.string().min(1),
  rootStructureId: z.string().optional(),
  name: z.string().trim().min(2),
  version: z.string().trim().min(1),
  license: z.string().trim().min(2),
  attribution: z.string().trim().min(2),
});

export const diseaseDraftSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^DIS_[A-Z0-9_]+$/),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  canonicalName: z.string().trim().min(2),
  name: bilingual,
  summary: bilingual,
  etiology: bilingual,
  pathogenesis: bilingual,
  morphology: bilingual,
  functionalEffects: bilingual,
  affectedStructureIds: z.array(z.string()).min(1),
});

export const diseaseStageDraftSchema = z
  .object({
    id: z
      .string()
      .trim()
      .regex(/^STAGE_[A-Z0-9_]+$/),
    diseaseId: z
      .string()
      .trim()
      .regex(/^DIS_[A-Z0-9_]+$/),
    order: z.number().int().min(0),
    progressMin: z.number().min(0).max(1),
    progressMax: z.number().min(0).max(1),
    name: bilingual,
    description: bilingual,
    visualConfig: z.record(z.string(), z.json()),
  })
  .refine((value) => value.progressMin <= value.progressMax, {
    message: "Progress minimum must not exceed maximum.",
  });

export const physiologyDraftSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^PHYS_[A-Z0-9_]+$/),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  canonicalName: z.string().trim().min(2),
  name: bilingual,
  summary: bilingual,
  mechanism: bilingual,
});

export const systemDraftSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^SYS_[A-Z0-9_]+$/),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  canonicalName: z.string().trim().min(2),
  name: bilingual,
  description: bilingual,
});
