import { heartStructures } from "@/src/data/anatomy/heartStructures";
import type { ModelAsset } from "@/src/types/medical";

export const modelAssets: ModelAsset[] = [
  {
    id: "MODEL_PROCEDURAL_HEART",
    url: null,
    systemId: "SYS_CARDIOVASCULAR",
    structureIds: heartStructures.map((structure) => structure.id),
    format: "procedural",
    attribution: {
      en: "Original procedural educational heart model generated from Three.js geometry.",
      ar: "نموذج تعليمي أصلي للقلب يُنشأ إجرائيًا باستخدام هندسة Three.js.",
    },
    license: "Project-owned original geometry",
  },
];

export const meshRegistry: Readonly<Record<string, string>> = Object.fromEntries(
  heartStructures.flatMap((structure) => structure.meshIds.map((meshId) => [meshId, structure.id])),
);
