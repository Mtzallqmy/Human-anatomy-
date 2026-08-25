import { allHumanStructures } from "@/src/data/anatomy/humanBodyCatalog";
import { supplementalStructures } from "@/src/data/anatomy/comprehensiveSystems";
import type { ModelAsset } from "@/src/types/medical";

const catalogStructures = [...allHumanStructures, ...supplementalStructures];

const definitions = [
  ["MODEL_PROCEDURAL_FULL_BODY", "SYS_FULL_BODY", "ANAT_HUMAN_BODY"],
  ["MODEL_PROCEDURAL_HEART", "SYS_CARDIOVASCULAR", "ANAT_HEART"],
  ["MODEL_PROCEDURAL_RESPIRATORY", "SYS_RESPIRATORY", "ANAT_RESPIRATORY"],
  ["MODEL_PROCEDURAL_DIGESTIVE", "SYS_DIGESTIVE", "ANAT_DIGESTIVE"],
  ["MODEL_PROCEDURAL_URINARY", "SYS_URINARY", "ANAT_URINARY"],
  ["MODEL_PROCEDURAL_NERVOUS", "SYS_NERVOUS", "ANAT_NERVOUS"],
  ["MODEL_PROCEDURAL_MUSCULOSKELETAL", "SYS_MUSCULOSKELETAL", "ANAT_MUSCULOSKELETAL"],
  ["MODEL_PROCEDURAL_SKELETAL", "SYS_SKELETAL", "ANAT_SKELETAL"],
  ["MODEL_PROCEDURAL_MUSCULAR", "SYS_MUSCULAR", "ANAT_MUSCULAR"],
  ["MODEL_PROCEDURAL_ENDOCRINE", "SYS_ENDOCRINE", "ANAT_ENDOCRINE"],
  ["MODEL_PROCEDURAL_LYMPHATIC", "SYS_LYMPHATIC", "ANAT_LYMPHATIC"],
  ["MODEL_PROCEDURAL_REPRODUCTIVE", "SYS_REPRODUCTIVE", "ANAT_REPRODUCTIVE"],
  ["MODEL_PROCEDURAL_INTEGUMENTARY", "SYS_INTEGUMENTARY", "ANAT_INTEGUMENTARY"],
] as const;

export const modelAssets: ModelAsset[] = definitions.map(([id, systemId, rootStructureId]) => ({
  id,
  url: null,
  systemId,
  rootStructureId,
  structureIds: catalogStructures
    .filter((structure) => structure.systemId === systemId)
    .map((structure) => structure.id),
  format: "procedural",
  attribution: {
    en: "Original simplified educational geometry generated in Three.js; not a diagnostic model.",
    ar: "هندسة تعليمية مبسطة أصلية منشأة باستخدام Three.js وليست نموذجًا تشخيصيًا.",
  },
  license: "Project-owned original geometry",
  version: "2.0.0",
  lod: systemId === "SYS_FULL_BODY" ? "simplified" : "standard",
}));

export const meshRegistry: Readonly<Record<string, string>> = Object.fromEntries(
  catalogStructures.flatMap((structure) => structure.meshIds.map((meshId) => [meshId, structure.id])),
);
