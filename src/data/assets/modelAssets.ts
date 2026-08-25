import { allHumanStructures } from "@/src/data/anatomy/humanBodyCatalog";
import type { ModelAsset } from "@/src/types/medical";

const definitions = [
  ["MODEL_PROCEDURAL_FULL_BODY", "SYS_FULL_BODY", "ANAT_HUMAN_BODY"],
  ["MODEL_PROCEDURAL_HEART", "SYS_CARDIOVASCULAR", "ANAT_HEART"],
  ["MODEL_PROCEDURAL_RESPIRATORY", "SYS_RESPIRATORY", "ANAT_RESPIRATORY"],
  ["MODEL_PROCEDURAL_DIGESTIVE", "SYS_DIGESTIVE", "ANAT_DIGESTIVE"],
  ["MODEL_PROCEDURAL_URINARY", "SYS_URINARY", "ANAT_URINARY"],
  ["MODEL_PROCEDURAL_NERVOUS", "SYS_NERVOUS", "ANAT_NERVOUS"],
  ["MODEL_PROCEDURAL_MUSCULOSKELETAL", "SYS_MUSCULOSKELETAL", "ANAT_MUSCULOSKELETAL"],
] as const;

export const modelAssets: ModelAsset[] = definitions.map(([id, systemId, rootStructureId]) => ({
  id,
  url: null,
  systemId,
  rootStructureId,
  structureIds: allHumanStructures
    .filter((structure) => structure.systemId === systemId)
    .map((structure) => structure.id),
  format: "procedural",
  attribution: {
    en: "Original simplified educational geometry generated in Three.js; not a diagnostic model.",
    ar: "هندسة تعليمية مبسطة أصلية منشأة باستخدام Three.js وليست نموذجًا تشخيصيًا.",
  },
  license: "Project-owned original geometry",
  version: "1.0.0",
  lod: systemId === "SYS_FULL_BODY" ? "simplified" : "standard",
}));

export const meshRegistry: Readonly<Record<string, string>> = Object.fromEntries(
  allHumanStructures.flatMap((structure) => structure.meshIds.map((meshId) => [meshId, structure.id])),
);
