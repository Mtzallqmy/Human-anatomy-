import type { ImagingAnnotation, ImagingFrame, ImagingStudy, LocalizedText } from "@/src/types/medical";

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

function frames(
  count: number,
  generatedVariant: NonNullable<ImagingFrame["generatedVariant"]>,
): ImagingFrame[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${generatedVariant.toUpperCase()}_FRAME_${String(index).padStart(3, "0")}`,
    index,
    generatedVariant,
  }));
}

function annotation(
  id: string,
  frameIndex: number,
  structureId: string,
  en: string,
  ar: string,
  x: number,
  y: number,
  color = "#5bd3df",
): ImagingAnnotation {
  return {
    id,
    frameIndex,
    structureId,
    label: text(en, ar),
    description: text(
      `${en} is identified on this generated educational illustration.`,
      `تم تحديد ${ar} في هذا الرسم التعليمي المولّد.`,
    ),
    geometry: { type: "point", coordinates: [[x, y]] },
    color,
  };
}

const shared = {
  source: "Project-generated educational illustration",
  license: "Project-owned original educational visual",
  attribution: "Anatomica Medical Atlas",
  deIdentified: true,
  educationalUse: true,
  status: "published" as const,
  version: 1,
  reviewDueAt: "2027-08-01",
};

export const imagingStudies: ImagingStudy[] = [
  {
    ...shared,
    id: "IMG_CHEST_CT_EDU",
    slug: "chest-ct-educational",
    modality: "CT",
    bodyRegion: "chest",
    title: text("Axial chest CT — educational module", "الأشعة المقطعية المحورية للصدر — وحدة تعليمية"),
    description: text(
      "A generated, non-clinical slice series for learning thoracic cross-sectional relationships.",
      "سلسلة مقاطع مولدة وغير سريرية لتعلم العلاقات التشريحية المقطعية في الصدر.",
    ),
    classification: "illustrative",
    structureIds: [
      "ANAT_LUNG_RIGHT",
      "ANAT_LUNG_LEFT",
      "ANAT_HEART",
      "ANAT_HEART_AORTA",
      "ANAT_VERTEBRAL_COLUMN",
      "ANAT_RIB_CAGE",
    ],
    diseaseIds: ["DIS_PULMONARY_FIBROSIS"],
    referenceIds: ["REF_GRAYS_ANATOMY"],
    series: [
      {
        id: "SER_CHEST_CT_AXIAL",
        studyId: "IMG_CHEST_CT_EDU",
        name: text("Axial chest series", "سلسلة الصدر المحورية"),
        orientation: "axial",
        sequence: "Generated CT-like illustration",
        frames: frames(28, "chest-ct"),
        annotations: [
          annotation("ANN_CT_RL", 14, "ANAT_LUNG_RIGHT", "Right lung", "الرئة اليمنى", 0.29, 0.47),
          annotation("ANN_CT_LL", 14, "ANAT_LUNG_LEFT", "Left lung", "الرئة اليسرى", 0.71, 0.47),
          annotation("ANN_CT_HEART", 14, "ANAT_HEART", "Heart", "القلب", 0.53, 0.59, "#f28b82"),
          annotation("ANN_CT_AORTA", 14, "ANAT_HEART_AORTA", "Aorta", "الأبهر", 0.49, 0.37, "#ffb26b"),
          annotation(
            "ANN_CT_SPINE",
            14,
            "ANAT_VERTEBRAL_COLUMN",
            "Vertebral body",
            "جسم الفقرة",
            0.5,
            0.77,
            "#f4e2c5",
          ),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_BRAIN_MRI_EDU",
    slug: "brain-mri-educational",
    modality: "MRI",
    bodyRegion: "brain",
    title: text("Axial brain MRI — educational module", "الرنين المغناطيسي المحوري للدماغ — وحدة تعليمية"),
    description: text(
      "A generated T2-like teaching series showing major brain regions and ventricles.",
      "سلسلة تعليمية مولدة شبيهة بتسلسل T2 تُظهر مناطق الدماغ الرئيسية والبطينات.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_CEREBRUM", "ANAT_BRAIN_VENTRICLES", "ANAT_CEREBELLUM", "ANAT_BRAINSTEM"],
    diseaseIds: ["DIS_ISCHEMIC_STROKE", "DIS_BRAIN_TUMOR"],
    referenceIds: ["REF_GRAYS_ANATOMY"],
    series: [
      {
        id: "SER_BRAIN_MRI_T2",
        studyId: "IMG_BRAIN_MRI_EDU",
        name: text("Axial T2-like series", "سلسلة محورية شبيهة بـT2"),
        orientation: "axial",
        sequence: "Generated T2-like illustration",
        frames: frames(24, "brain-mri"),
        annotations: [
          annotation("ANN_MRI_CEREBRUM", 12, "ANAT_CEREBRUM", "Cerebrum", "المخ", 0.33, 0.43),
          annotation(
            "ANN_MRI_VENT",
            12,
            "ANAT_BRAIN_VENTRICLES",
            "Lateral ventricles",
            "البطينات الجانبية",
            0.51,
            0.5,
            "#86cfff",
          ),
          annotation("ANN_MRI_CEREBELLUM", 7, "ANAT_CEREBELLUM", "Cerebellum", "المخيخ", 0.5, 0.68),
          annotation("ANN_MRI_STEM", 7, "ANAT_BRAINSTEM", "Brainstem", "جذع الدماغ", 0.5, 0.55, "#ffd27e"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_CHEST_XRAY_EDU",
    slug: "chest-xray-educational",
    modality: "XRAY",
    bodyRegion: "chest",
    title: text("PA chest X-ray landmarks", "معالم صورة الصدر الشعاعية بوضعية PA"),
    description: text(
      "A generated projection illustration for recognizing the lungs, cardiac silhouette, diaphragm, and ribs.",
      "رسم إسقاطي مولد للتعرف إلى الرئتين وظل القلب والحجاب الحاجز والأضلاع.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_LUNG_RIGHT", "ANAT_LUNG_LEFT", "ANAT_HEART", "ANAT_DIAPHRAGM", "ANAT_RIB_CAGE"],
    diseaseIds: [],
    referenceIds: ["REF_GRAYS_ANATOMY"],
    series: [
      {
        id: "SER_CHEST_XRAY_PA",
        studyId: "IMG_CHEST_XRAY_EDU",
        name: text("Posteroanterior view", "وضعية خلفية أمامية"),
        orientation: "projection",
        frames: frames(1, "chest-xray"),
        annotations: [
          annotation("ANN_XRAY_RL", 0, "ANAT_LUNG_RIGHT", "Right lung field", "حقل الرئة اليمنى", 0.33, 0.43),
          annotation("ANN_XRAY_LL", 0, "ANAT_LUNG_LEFT", "Left lung field", "حقل الرئة اليسرى", 0.67, 0.43),
          annotation(
            "ANN_XRAY_HEART",
            0,
            "ANAT_HEART",
            "Cardiac silhouette",
            "ظل القلب",
            0.54,
            0.61,
            "#f28b82",
          ),
          annotation("ANN_XRAY_DIAPH", 0, "ANAT_DIAPHRAGM", "Diaphragm", "الحجاب الحاجز", 0.5, 0.78),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_LIVER_HISTOLOGY_EDU",
    slug: "liver-histology-educational",
    modality: "HISTOLOGY",
    bodyRegion: "liver",
    title: text("Liver histology overview", "نظرة عامة على نسيج الكبد"),
    description: text(
      "A generated microscopic pattern demonstrating lobular organization.",
      "نمط مجهري مولد يوضح التنظيم الفصيصي.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_LIVER"],
    diseaseIds: ["DIS_CIRRHOSIS"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_LIVER_HISTOLOGY",
        studyId: "IMG_LIVER_HISTOLOGY_EDU",
        name: text("Liver lobule illustration", "رسم الفصيص الكبدي"),
        orientation: "microscopy",
        frames: frames(1, "liver-histology"),
        annotations: [
          annotation(
            "ANN_HIST_LIVER",
            0,
            "ANAT_LIVER",
            "Hepatic lobule",
            "الفصيص الكبدي",
            0.5,
            0.5,
            "#7b3049",
          ),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_KIDNEY_HISTOLOGY_EDU",
    slug: "kidney-histology-educational",
    modality: "HISTOLOGY",
    bodyRegion: "kidney",
    title: text("Kidney histology overview", "نظرة عامة على نسيج الكلية"),
    description: text(
      "A generated microscopic pattern showing glomerular and tubular relationships.",
      "نمط مجهري مولد يوضح العلاقات بين الكبيبات والنبيبات.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_KIDNEY_LEFT", "ANAT_RENAL_CORTEX"],
    diseaseIds: ["DIS_CHRONIC_KIDNEY"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_KIDNEY_HISTOLOGY",
        studyId: "IMG_KIDNEY_HISTOLOGY_EDU",
        name: text("Renal cortex illustration", "رسم قشرة الكلية"),
        orientation: "microscopy",
        frames: frames(1, "kidney-histology"),
        annotations: [
          annotation("ANN_HIST_GLOM", 0, "ANAT_RENAL_CORTEX", "Glomerulus", "الكبيبة", 0.43, 0.46, "#734a80"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_FIBROSIS_PATHOLOGY_EDU",
    slug: "pulmonary-fibrosis-pathology",
    modality: "PATHOLOGY",
    bodyRegion: "lung",
    title: text("Pulmonary fibrosis — conceptual comparison", "التليف الرئوي — مقارنة توضيحية"),
    description: text(
      "Generated healthy-versus-fibrotic educational comparison.",
      "مقارنة تعليمية مولدة بين الرئة السليمة والمتليفة.",
    ),
    classification: "conceptual_pathology",
    structureIds: ["ANAT_LUNG_LEFT"],
    diseaseIds: ["DIS_PULMONARY_FIBROSIS"],
    referenceIds: ["REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_FIBROSIS_COMPARE",
        studyId: "IMG_FIBROSIS_PATHOLOGY_EDU",
        name: text("Progression illustration", "رسم تطور المرض"),
        orientation: "projection",
        frames: frames(2, "chest-xray"),
        annotations: [],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_CIRRHOSIS_PATHOLOGY_EDU",
    slug: "cirrhosis-pathology",
    modality: "PATHOLOGY",
    bodyRegion: "liver",
    title: text("Cirrhosis — conceptual comparison", "تشمع الكبد — مقارنة توضيحية"),
    description: text(
      "Generated healthy-versus-cirrhotic educational comparison.",
      "مقارنة تعليمية مولدة بين الكبد السليم والمتشمع.",
    ),
    classification: "conceptual_pathology",
    structureIds: ["ANAT_LIVER"],
    diseaseIds: ["DIS_CIRRHOSIS"],
    referenceIds: ["REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_CIRRHOSIS_COMPARE",
        studyId: "IMG_CIRRHOSIS_PATHOLOGY_EDU",
        name: text("Progression illustration", "رسم تطور المرض"),
        orientation: "projection",
        frames: frames(2, "liver-histology"),
        annotations: [],
      },
    ],
  },
];

export const getImagingStudiesForStructure = (structureId: string) =>
  imagingStudies.filter((study) => study.status === "published" && study.structureIds.includes(structureId));

export const getImagingStudiesForDisease = (diseaseId: string) =>
  imagingStudies.filter((study) => study.status === "published" && study.diseaseIds.includes(diseaseId));
