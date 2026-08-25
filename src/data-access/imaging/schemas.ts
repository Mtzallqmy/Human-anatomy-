import { z } from "zod";

export const normalizedCoordinateSchema = z.number().min(0).max(1);

export const annotationGeometrySchema = z.object({
  type: z.enum(["point", "rectangle", "polygon"]),
  coordinates: z.array(z.array(normalizedCoordinateSchema).min(2).max(2)).min(1),
});

export const imagingAnnotationSchema = z.object({
  id: z.string().min(1),
  frameIndex: z.number().int().nonnegative(),
  structureId: z.string().min(1),
  label: z.object({ en: z.string().min(1), ar: z.string().min(1) }),
  description: z.object({ en: z.string(), ar: z.string() }),
  geometry: annotationGeometrySchema,
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
});

export const imagingStudyDraftSchema = z.object({
  id: z.string().regex(/^IMG_[A-Z0-9_]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  modality: z.enum(["CT", "MRI", "XRAY", "HISTOLOGY", "PATHOLOGY"]),
  bodyRegion: z.string().trim().min(2).max(120),
  title: z.object({ en: z.string().trim().min(2), ar: z.string().trim().min(2) }),
  description: z.object({ en: z.string().trim().min(2), ar: z.string().trim().min(2) }),
  classification: z.enum(["anatomical", "radiologic", "illustrative", "conceptual_pathology"]),
  source: z.string().trim().min(2),
  license: z.string().trim().min(2),
  attribution: z.string().trim().min(2),
  deIdentified: z.literal(true),
  educationalUse: z.literal(true),
});

export const imagingUploadSchema = z.object({
  size: z.number().max(25 * 1024 * 1024, "Each upload must be 25 MB or smaller."),
  type: z.enum(["image/png", "image/jpeg", "image/webp"]),
});
