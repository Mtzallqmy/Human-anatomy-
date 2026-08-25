import type { LocalizedText } from "@/src/types/medical";

export interface BloodFlowStep {
  structureId: string;
  name: LocalizedText;
  oxygenation: "deoxygenated" | "oxygenated";
}

export const bloodFlowSteps: BloodFlowStep[] = [
  {
    structureId: "ANAT_HEART_SVC",
    name: { en: "Venae cavae", ar: "الوريدان الأجوفان" },
    oxygenation: "deoxygenated",
  },
  {
    structureId: "ANAT_HEART_RA",
    name: { en: "Right atrium", ar: "الأذين الأيمن" },
    oxygenation: "deoxygenated",
  },
  {
    structureId: "ANAT_HEART_TRICUSPID",
    name: { en: "Tricuspid valve", ar: "الصمام ثلاثي الشرفات" },
    oxygenation: "deoxygenated",
  },
  {
    structureId: "ANAT_HEART_RV",
    name: { en: "Right ventricle", ar: "البطين الأيمن" },
    oxygenation: "deoxygenated",
  },
  {
    structureId: "ANAT_HEART_PULMONARY_TRUNK",
    name: { en: "Pulmonary circulation", ar: "الدوران الرئوي" },
    oxygenation: "deoxygenated",
  },
  {
    structureId: "ANAT_HEART_LA",
    name: { en: "Left atrium", ar: "الأذين الأيسر" },
    oxygenation: "oxygenated",
  },
  {
    structureId: "ANAT_HEART_MITRAL",
    name: { en: "Mitral valve", ar: "الصمام التاجي" },
    oxygenation: "oxygenated",
  },
  {
    structureId: "ANAT_HEART_LV",
    name: { en: "Left ventricle", ar: "البطين الأيسر" },
    oxygenation: "oxygenated",
  },
  {
    structureId: "ANAT_HEART_AORTA",
    name: { en: "Systemic circulation", ar: "الدوران الجهازي" },
    oxygenation: "oxygenated",
  },
];
