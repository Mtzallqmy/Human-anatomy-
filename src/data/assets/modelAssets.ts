import { allHumanStructures } from "@/src/data/anatomy/humanBodyCatalog";
import { supplementalStructures } from "@/src/data/anatomy/comprehensiveSystems";
import type { ModelAsset } from "@/src/types/medical";

const catalogStructures = [...allHumanStructures, ...supplementalStructures];
const VANATOME_MODEL_BASE = "https://atlas.vanatome.vixotic.in/models";

const licensedAttribution = {
  en: "Z-Anatomy contributors (Gauthier Kervyn, Marcin Zielinski and contributors), web-optimized by Vanatome. Adapted for interactive educational use.",
  ar: "مساهمو Z-Anatomy (غوتييه كيرفين ومارتسين زيلينسكي ومساهمون آخرون)، مع تحسينات للويب بواسطة Vanatome. مكيّف للاستخدام التعليمي التفاعلي.",
};

const proceduralAttribution = {
  en: "Original simplified educational geometry generated in Three.js; used as an offline/failure fallback and not as a diagnostic model.",
  ar: "هندسة تعليمية مبسطة أصلية منشأة باستخدام Three.js، وتُستخدم كبديل عند تعذر الأصل عالي الدقة وليست نموذجًا تشخيصيًا.",
};

type AssetDefinition = {
  id: string;
  systemId: string;
  rootStructureId: string;
  bundle?: string;
  lod?: ModelAsset["lod"];
};

const definitions: AssetDefinition[] = [
  { id: "MODEL_PROCEDURAL_FULL_BODY", systemId: "SYS_FULL_BODY", rootStructureId: "ANAT_HUMAN_BODY", lod: "simplified" },
  { id: "MODEL_ZANATOMY_CARDIOVASCULAR", systemId: "SYS_CARDIOVASCULAR", rootStructureId: "ANAT_HEART", bundle: "cardiovascular", lod: "detailed" },
  { id: "MODEL_ZANATOMY_RESPIRATORY", systemId: "SYS_RESPIRATORY", rootStructureId: "ANAT_RESPIRATORY", bundle: "respiratory", lod: "detailed" },
  { id: "MODEL_ZANATOMY_DIGESTIVE", systemId: "SYS_DIGESTIVE", rootStructureId: "ANAT_DIGESTIVE", bundle: "digestive", lod: "detailed" },
  { id: "MODEL_ZANATOMY_URINARY", systemId: "SYS_URINARY", rootStructureId: "ANAT_URINARY", bundle: "urinary", lod: "detailed" },
  { id: "MODEL_ZANATOMY_NERVOUS", systemId: "SYS_NERVOUS", rootStructureId: "ANAT_NERVOUS", bundle: "nervous", lod: "detailed" },
  { id: "MODEL_PROCEDURAL_MUSCULOSKELETAL", systemId: "SYS_MUSCULOSKELETAL", rootStructureId: "ANAT_MUSCULOSKELETAL" },
  { id: "MODEL_ZANATOMY_SKELETAL", systemId: "SYS_SKELETAL", rootStructureId: "ANAT_SKELETAL", bundle: "skeletal", lod: "detailed" },
  { id: "MODEL_ZANATOMY_MUSCULAR", systemId: "SYS_MUSCULAR", rootStructureId: "ANAT_MUSCULAR", bundle: "muscular", lod: "detailed" },
  { id: "MODEL_ZANATOMY_ENDOCRINE", systemId: "SYS_ENDOCRINE", rootStructureId: "ANAT_ENDOCRINE", bundle: "endocrine", lod: "detailed" },
  { id: "MODEL_ZANATOMY_LYMPHATIC", systemId: "SYS_LYMPHATIC", rootStructureId: "ANAT_LYMPHATIC", bundle: "lymphatic", lod: "detailed" },
  { id: "MODEL_ZANATOMY_REPRODUCTIVE", systemId: "SYS_REPRODUCTIVE", rootStructureId: "ANAT_REPRODUCTIVE", bundle: "reproductive", lod: "detailed" },
  { id: "MODEL_PROCEDURAL_INTEGUMENTARY", systemId: "SYS_INTEGUMENTARY", rootStructureId: "ANAT_INTEGUMENTARY" },
];

export const modelAssets: ModelAsset[] = definitions.map((definition) => {
  const isLicensed = Boolean(definition.bundle);
  return {
    id: definition.id,
    url: definition.bundle
      ? `${VANATOME_MODEL_BASE}/z-anatomy-1.4.0-${definition.bundle}.glb`
      : null,
    systemId: definition.systemId,
    rootStructureId: definition.rootStructureId,
    structureIds: catalogStructures
      .filter((structure) => structure.systemId === definition.systemId)
      .map((structure) => structure.id),
    format: isLicensed ? "glb" : "procedural",
    attribution: isLicensed ? licensedAttribution : proceduralAttribution,
    license: isLicensed ? "CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/" : "Project-owned original geometry",
    version: isLicensed ? "Z-Anatomy / Vanatome 1.4.0" : "2.1.0",
    lod: definition.lod ?? "standard",
  };
});

export const meshRegistry: Readonly<Record<string, string>> = Object.fromEntries(
  catalogStructures.flatMap((structure) => structure.meshIds.map((meshId) => [meshId, structure.id])),
);
