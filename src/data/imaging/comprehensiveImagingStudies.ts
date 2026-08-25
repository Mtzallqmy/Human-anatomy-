import type {
  GeneratedImagingVariant,
  ImagingAnnotation,
  ImagingFrame,
  ImagingStudy,
  LocalizedText,
} from "@/src/types/medical";

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

function frames(count: number, variant: GeneratedImagingVariant): ImagingFrame[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${variant.toUpperCase().replaceAll("-", "_")}_FRAME_${String(index).padStart(3, "0")}`,
    index,
    generatedVariant: variant,
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
  color = "#62d5df",
): ImagingAnnotation {
  return {
    id,
    frameIndex,
    structureId,
    label: text(en, ar),
    description: text(
      `${en} is highlighted on this project-generated educational image.`,
      `تم تمييز ${ar} في هذه الصورة التعليمية المولدة داخل المشروع.`,
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
  version: 2,
  reviewDueAt: "2027-08-01",
};

export const comprehensiveImagingStudies: ImagingStudy[] = [
  {
    ...shared,
    id: "IMG_SKELETAL_XRAY_EDU",
    slug: "skeletal-xray-educational",
    modality: "XRAY",
    bodyRegion: "appendicular-skeleton",
    title: text("Long-bone X-ray landmarks", "معالم الأشعة السينية للعظم الطويل"),
    description: text(
      "A projection-style educational series for cortical bone, trabecular bone, marrow cavity and joint-surface relationships.",
      "سلسلة تعليمية إسقاطية لتمييز العظم القشري والإسفنجي وتجويف النخاع وعلاقات السطوح المفصلية.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_COMPACT_BONE", "ANAT_TRABECULAR_BONE", "ANAT_BONE_MARROW", "ANAT_SYNOVIAL_JOINT"],
    diseaseIds: ["DIS_SKELETAL_OSTEOPOROSIS", "DIS_SKELETAL_OSTEOMYELITIS"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_SKELETAL_XRAY",
        studyId: "IMG_SKELETAL_XRAY_EDU",
        name: text("AP long-bone teaching view", "منظر تعليمي أمامي خلفي للعظم الطويل"),
        orientation: "projection",
        sequence: "Generated X-ray-like illustration",
        frames: frames(5, "bone-xray"),
        annotations: [
          annotation("ANN_BONE_CORTEX", 2, "ANAT_COMPACT_BONE", "Cortical bone", "العظم القشري", 0.34, 0.45, "#f0ead9"),
          annotation("ANN_BONE_TRAB", 2, "ANAT_TRABECULAR_BONE", "Trabecular bone", "العظم الإسفنجي", 0.5, 0.22, "#e6cba7"),
          annotation("ANN_BONE_MARROW", 2, "ANAT_BONE_MARROW", "Marrow cavity", "تجويف النخاع", 0.52, 0.51, "#e49a9a"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_MUSCLE_MRI_EDU",
    slug: "muscle-mri-educational",
    modality: "MRI",
    bodyRegion: "thigh-muscle",
    title: text("Skeletal muscle MRI — educational module", "رنين العضلات الهيكلية — وحدة تعليمية"),
    description: text(
      "A generated cross-sectional MRI-like series showing muscle compartments, fascia and tendon transition.",
      "سلسلة مقطعية مولدة شبيهة بالرنين تُظهر حجرات العضلات واللفافة والانتقال إلى الوتر.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_SKELETAL_MUSCLE", "ANAT_MUSCLE_FIBER", "ANAT_TENDON"],
    diseaseIds: ["DIS_MUSCULAR_DYSTROPHY", "DIS_INFLAMMATORY_MYOPATHY"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_MUSCLE_MRI",
        studyId: "IMG_MUSCLE_MRI_EDU",
        name: text("Axial muscle compartments", "حجرات العضلات بالمقطع المحوري"),
        orientation: "axial",
        sequence: "Generated T1/T2 teaching composite",
        frames: frames(12, "muscle-mri"),
        annotations: [
          annotation("ANN_MUSCLE_BELLY", 6, "ANAT_SKELETAL_MUSCLE", "Muscle belly", "بطن العضلة", 0.34, 0.45, "#d98b88"),
          annotation("ANN_MUSCLE_TENDON", 6, "ANAT_TENDON", "Tendon", "الوتر", 0.62, 0.52, "#f1d5a8"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_THYROID_US_EDU",
    slug: "thyroid-ultrasound-educational",
    modality: "ULTRASOUND",
    bodyRegion: "neck-thyroid",
    title: text("Thyroid ultrasound landmarks", "معالم موجات فوق صوتية للغدة الدرقية"),
    description: text(
      "A generated ultrasound-like module for thyroid lobes, isthmus and adjacent airway relationships.",
      "وحدة مولدة شبيهة بالأمواج فوق الصوتية لتمييز فصي الدرق والبرزخ وعلاقتهما بالطريق الهوائي.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_THYROID", "ANAT_PARATHYROIDS"],
    diseaseIds: ["DIS_HYPOTHYROIDISM", "DIS_HYPERTHYROIDISM"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_GUYTON_HALL"],
    series: [
      {
        id: "SER_THYROID_US",
        studyId: "IMG_THYROID_US_EDU",
        name: text("Transverse thyroid view", "منظر عرضي للغدة الدرقية"),
        orientation: "axial",
        sequence: "Generated ultrasound-like illustration",
        frames: frames(8, "thyroid-ultrasound"),
        annotations: [
          annotation("ANN_THYROID", 4, "ANAT_THYROID", "Thyroid lobe", "فص الغدة الدرقية", 0.38, 0.48, "#e1a6c4"),
          annotation("ANN_PARATHYROID", 4, "ANAT_PARATHYROIDS", "Parathyroid region", "منطقة جارات الدرق", 0.62, 0.44, "#e9cf87"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_LYMPH_NODE_US_EDU",
    slug: "lymph-node-ultrasound-educational",
    modality: "ULTRASOUND",
    bodyRegion: "superficial-lymph-node",
    title: text("Lymph-node ultrasound architecture", "بنية العقدة اللمفاوية بالأمواج فوق الصوتية"),
    description: text(
      "A generated module illustrating cortex, hilum and surrounding lymphatic tissue relationships.",
      "وحدة مولدة توضح قشرة العقدة والهلال والعلاقات مع النسيج اللمفاوي المحيط.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_LYMPH_NODES", "ANAT_LYMPH_VESSELS"],
    diseaseIds: ["DIS_LYMPHEDEMA", "DIS_LYMPHOMA"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_LYMPH_NODE_US",
        studyId: "IMG_LYMPH_NODE_US_EDU",
        name: text("Superficial node view", "منظر عقدة سطحية"),
        orientation: "projection",
        sequence: "Generated ultrasound-like illustration",
        frames: frames(8, "lymph-node-ultrasound"),
        annotations: [
          annotation("ANN_NODE", 4, "ANAT_LYMPH_NODES", "Lymph node", "العقدة اللمفاوية", 0.5, 0.5, "#97d3a4"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_PELVIC_US_EDU",
    slug: "pelvic-ultrasound-educational",
    modality: "ULTRASOUND",
    bodyRegion: "pelvis",
    title: text("Pelvic ultrasound — reproductive anatomy", "الأمواج فوق الصوتية للحوض — التشريح التناسلي"),
    description: text(
      "A generated sagittal/transverse teaching series for uterus, ovaries and adjacent pelvic landmarks.",
      "سلسلة تعليمية مولدة بمناظر سهمية وعرضية للرحم والمبيضين ومعالم الحوض المجاورة.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_UTERUS", "ANAT_OVARIES", "ANAT_UTERINE_TUBES"],
    diseaseIds: ["DIS_ENDOMETRIOSIS", "DIS_POLYCYSTIC_OVARY"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_GUYTON_HALL"],
    series: [
      {
        id: "SER_PELVIC_US",
        studyId: "IMG_PELVIC_US_EDU",
        name: text("Pelvic reproductive landmarks", "معالم الجهاز التناسلي في الحوض"),
        orientation: "sagittal",
        sequence: "Generated ultrasound-like illustration",
        frames: frames(10, "pelvic-ultrasound"),
        annotations: [
          annotation("ANN_UTERUS", 5, "ANAT_UTERUS", "Uterus", "الرحم", 0.5, 0.47, "#e7a4b7"),
          annotation("ANN_OVARY", 5, "ANAT_OVARIES", "Ovary", "المبيض", 0.68, 0.48, "#d7b0d8"),
        ],
      },
    ],
  },
  {
    ...shared,
    id: "IMG_SKIN_HISTOLOGY_EDU",
    slug: "skin-histology-educational",
    modality: "HISTOLOGY",
    bodyRegion: "skin",
    title: text("Skin histology and barrier layers", "نسيج الجلد وطبقات الحاجز"),
    description: text(
      "A generated microscopic module showing epidermis, dermis, subcutaneous tissue and adnexal structures.",
      "وحدة مجهرية مولدة تُظهر البشرة والأدمة والنسيج تحت الجلد والتراكيب الملحقة.",
    ),
    classification: "illustrative",
    structureIds: ["ANAT_EPIDERMIS", "ANAT_DERMIS", "ANAT_HYPODERMIS", "ANAT_SWEAT_GLAND"],
    diseaseIds: ["DIS_PSORIASIS", "DIS_MELANOMA"],
    referenceIds: ["REF_GRAYS_ANATOMY", "REF_ROBBINS_COTRAN"],
    series: [
      {
        id: "SER_SKIN_HISTOLOGY",
        studyId: "IMG_SKIN_HISTOLOGY_EDU",
        name: text("Layered skin section", "مقطع طبقي للجلد"),
        orientation: "microscopy",
        sequence: "Generated histology teaching illustration",
        frames: frames(3, "skin-histology"),
        annotations: [
          annotation("ANN_EPIDERMIS", 1, "ANAT_EPIDERMIS", "Epidermis", "البشرة", 0.5, 0.22, "#d89b89"),
          annotation("ANN_DERMIS", 1, "ANAT_DERMIS", "Dermis", "الأدمة", 0.5, 0.48, "#c98592"),
          annotation("ANN_HYPODERMIS", 1, "ANAT_HYPODERMIS", "Hypodermis", "تحت الجلد", 0.5, 0.75, "#e0bd75"),
        ],
      },
    ],
  },
];
