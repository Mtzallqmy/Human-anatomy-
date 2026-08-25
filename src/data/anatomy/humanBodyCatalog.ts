import { heartStructures } from "@/src/data/anatomy/heartStructures";
import type {
  AnatomicalStructure,
  Disease,
  LocalizedText,
  PhysiologyAnimation,
  StructureRelationship,
} from "@/src/types/medical";

type Seed = readonly [id: string, en: string, ar: string, latin?: string, parentId?: string];

const referenceIds = ["REF_FIPAT_TA2", "REF_GRAYS_ANATOMY", "REF_GUYTON_HALL"];

function text(en: string, ar: string): LocalizedText {
  return { en, ar };
}

function createStructures(systemId: string, rootId: string, seeds: readonly Seed[]): AnatomicalStructure[] {
  const childIds = seeds.filter(([id]) => id !== rootId).map(([id]) => id);
  return seeds.map(([id, en, ar, latin, explicitParent], index) => {
    const isRoot = id === rootId;
    const column = (index % 3) - 1;
    const row = Math.floor(index / 3);
    return {
      id,
      name: text(en, ar),
      latinName: latin,
      description: text(
        `${en} is presented as part of the ${systemId.replace("SYS_", "").toLowerCase()} learning module.`,
        `يُعرض ${ar} ضمن الوحدة التعليمية الخاصة بهذا الجهاز.`,
      ),
      anatomy: text(
        `${en} has characteristic regional relationships and subdivisions that support its role within the organ system.`,
        `يمتلك ${ar} علاقات تشريحية وأجزاء مميزة تدعم دوره ضمن الجهاز.`,
      ),
      physiology: text(
        `${en} contributes to the coordinated function of the system through connected anatomical pathways.`,
        `يسهم ${ar} في الوظيفة المتناسقة للجهاز عبر مسارات تشريحية مترابطة.`,
      ),
      location: text(
        isRoot
          ? "Distributed through its principal body region."
          : `Within the region of the ${en.toLowerCase()}.`,
        isRoot ? "يمتد ضمن منطقته الرئيسية في الجسم." : `ضمن المنطقة التشريحية الخاصة بـ${ar}.`,
      ),
      systemId,
      parentId: isRoot ? undefined : explicitParent || rootId,
      childrenIds: isRoot
        ? childIds.filter(
            (childId) => !seeds.some(([id, , , , parent]) => id === childId && parent && parent !== rootId),
          )
        : seeds.filter(([, , , , parent]) => parent === id).map(([childId]) => childId),
      relatedStructureIds: [],
      relatedDiseaseIds: [],
      meshIds: isRoot ? [] : [`Mesh_${id}`],
      referenceIds,
      labelAnchor: [column * 0.95, 2.25 - row * 0.62, column === 0 ? 0.55 : 0.15],
      studyNumber: isRoot ? undefined : index,
    };
  });
}

const respiratorySeeds = [
  ["ANAT_RESPIRATORY", "Respiratory system", "الجهاز التنفسي", "Systema respiratorium"],
  ["ANAT_NASAL_CAVITY", "Nasal cavity", "التجويف الأنفي", "Cavitas nasi"],
  ["ANAT_PHARYNX", "Pharynx", "البلعوم", "Pharynx"],
  ["ANAT_LARYNX", "Larynx", "الحنجرة", "Larynx"],
  ["ANAT_TRACHEA", "Trachea", "الرغامى", "Trachea"],
  ["ANAT_LUNG_RIGHT", "Right lung", "الرئة اليمنى", "Pulmo dexter"],
  ["ANAT_LUNG_LEFT", "Left lung", "الرئة اليسرى", "Pulmo sinister"],
  ["ANAT_MAIN_BRONCHI", "Main bronchi", "الشعبتان الرئيسيتان", "Bronchi principales"],
  ["ANAT_BRONCHIAL_TREE", "Bronchial tree", "الشجرة القصبية", "Arbor bronchialis"],
  ["ANAT_ALVEOLI", "Alveoli", "الحويصلات الهوائية", "Alveoli pulmonis"],
  ["ANAT_DIAPHRAGM", "Diaphragm", "الحجاب الحاجز", "Diaphragma"],
] as const satisfies readonly Seed[];

const digestiveSeeds = [
  ["ANAT_DIGESTIVE", "Digestive system", "الجهاز الهضمي", "Systema digestorium"],
  ["ANAT_ORAL_CAVITY", "Oral cavity", "التجويف الفموي", "Cavitas oris"],
  ["ANAT_DIGESTIVE_PHARYNX", "Pharynx", "البلعوم", "Pharynx"],
  ["ANAT_ESOPHAGUS", "Esophagus", "المريء", "Oesophagus"],
  ["ANAT_STOMACH", "Stomach", "المعدة", "Gaster"],
  ["ANAT_LIVER", "Liver", "الكبد", "Hepar"],
  ["ANAT_GALLBLADDER", "Gallbladder", "المرارة", "Vesica biliaris"],
  ["ANAT_PANCREAS", "Pancreas", "البنكرياس", "Pancreas"],
  ["ANAT_DUODENUM", "Duodenum", "الاثنا عشر", "Duodenum"],
  ["ANAT_SMALL_INTESTINE", "Small intestine", "الأمعاء الدقيقة", "Intestinum tenue"],
  ["ANAT_LARGE_INTESTINE", "Large intestine", "الأمعاء الغليظة", "Intestinum crassum"],
  ["ANAT_RECTUM", "Rectum", "المستقيم", "Rectum"],
] as const satisfies readonly Seed[];

const urinarySeeds = [
  ["ANAT_URINARY", "Urinary system", "الجهاز البولي", "Systema urinarium"],
  ["ANAT_KIDNEY_RIGHT", "Right kidney", "الكلية اليمنى", "Ren dexter"],
  ["ANAT_KIDNEY_LEFT", "Left kidney", "الكلية اليسرى", "Ren sinister"],
  ["ANAT_RENAL_CORTEX", "Renal cortex", "قشرة الكلية", "Cortex renalis", "ANAT_KIDNEY_LEFT"],
  ["ANAT_RENAL_MEDULLA", "Renal medulla", "لب الكلية", "Medulla renalis", "ANAT_KIDNEY_LEFT"],
  ["ANAT_RENAL_PELVIS", "Renal pelvis", "حويضة الكلية", "Pelvis renalis", "ANAT_KIDNEY_LEFT"],
  ["ANAT_URETERS", "Ureters", "الحالبان", "Ureteres"],
  ["ANAT_URINARY_BLADDER", "Urinary bladder", "المثانة البولية", "Vesica urinaria"],
  ["ANAT_URETHRA", "Urethra", "الإحليل", "Urethra"],
] as const satisfies readonly Seed[];

const nervousSeeds = [
  ["ANAT_NERVOUS", "Nervous system", "الجهاز العصبي", "Systema nervosum"],
  ["ANAT_BRAIN", "Brain", "الدماغ", "Encephalon"],
  ["ANAT_CEREBRUM", "Cerebrum", "المخ", "Cerebrum", "ANAT_BRAIN"],
  ["ANAT_FRONTAL_LOBE", "Frontal lobe", "الفص الجبهي", "Lobus frontalis", "ANAT_CEREBRUM"],
  ["ANAT_PARIETAL_LOBE", "Parietal lobe", "الفص الجداري", "Lobus parietalis", "ANAT_CEREBRUM"],
  ["ANAT_TEMPORAL_LOBE", "Temporal lobe", "الفص الصدغي", "Lobus temporalis", "ANAT_CEREBRUM"],
  ["ANAT_OCCIPITAL_LOBE", "Occipital lobe", "الفص القذالي", "Lobus occipitalis", "ANAT_CEREBRUM"],
  ["ANAT_CEREBELLUM", "Cerebellum", "المخيخ", "Cerebellum", "ANAT_BRAIN"],
  ["ANAT_BRAINSTEM", "Brainstem", "جذع الدماغ", "Truncus encephali", "ANAT_BRAIN"],
  ["ANAT_BRAIN_VENTRICLES", "Brain ventricles", "بطينات الدماغ", "Ventriculi cerebri", "ANAT_BRAIN"],
  ["ANAT_SPINAL_CORD", "Spinal cord", "الحبل الشوكي", "Medulla spinalis"],
  ["ANAT_PERIPHERAL_NERVES", "Major peripheral nerves", "الأعصاب المحيطية الرئيسية", "Nervi peripherici"],
] as const satisfies readonly Seed[];

const musculoskeletalSeeds = [
  ["ANAT_MUSCULOSKELETAL", "Musculoskeletal system", "الجهاز العضلي الهيكلي", "Systema musculoskeletale"],
  ["ANAT_SKULL", "Skull", "الجمجمة", "Cranium"],
  ["ANAT_VERTEBRAL_COLUMN", "Vertebral column", "العمود الفقري", "Columna vertebralis"],
  ["ANAT_RIB_CAGE", "Rib cage", "القفص الصدري", "Compages thoracis"],
  ["ANAT_PELVIS", "Pelvis", "الحوض", "Pelvis"],
  ["ANAT_UPPER_LIMB", "Upper limb skeleton", "هيكل الطرف العلوي", "Skeleton membri superioris"],
  ["ANAT_LOWER_LIMB", "Lower limb skeleton", "هيكل الطرف السفلي", "Skeleton membri inferioris"],
  ["ANAT_DELTOID", "Deltoid", "العضلة الدالية", "Musculus deltoideus"],
  ["ANAT_PECTORALIS_MAJOR", "Pectoralis major", "العضلة الصدرية الكبرى", "Musculus pectoralis major"],
  ["ANAT_BICEPS", "Biceps brachii", "العضلة ذات الرأسين العضدية", "Musculus biceps brachii"],
  ["ANAT_TRICEPS", "Triceps brachii", "العضلة ثلاثية الرؤوس العضدية", "Musculus triceps brachii"],
  ["ANAT_RECTUS_ABDOMINIS", "Rectus abdominis", "العضلة المستقيمة البطنية", "Musculus rectus abdominis"],
  ["ANAT_QUADRICEPS", "Quadriceps", "العضلة رباعية الرؤوس", "Musculus quadriceps femoris"],
  ["ANAT_HAMSTRINGS", "Hamstrings", "عضلات باطن الفخذ", "Musculi ischiocrurales"],
  ["ANAT_GASTROCNEMIUS", "Gastrocnemius", "العضلة التوأمية", "Musculus gastrocnemius"],
] as const satisfies readonly Seed[];

export const expandedStructures = [
  ...createStructures("SYS_RESPIRATORY", "ANAT_RESPIRATORY", respiratorySeeds),
  ...createStructures("SYS_DIGESTIVE", "ANAT_DIGESTIVE", digestiveSeeds),
  ...createStructures("SYS_URINARY", "ANAT_URINARY", urinarySeeds),
  ...createStructures("SYS_NERVOUS", "ANAT_NERVOUS", nervousSeeds),
  ...createStructures("SYS_MUSCULOSKELETAL", "ANAT_MUSCULOSKELETAL", musculoskeletalSeeds),
];

export const fullBodyStructure: AnatomicalStructure = {
  id: "ANAT_HUMAN_BODY",
  name: text("Human body", "جسم الإنسان"),
  latinName: "Corpus humanum",
  description: text(
    "A simplified overview that combines major organ-system layers without loading every detailed asset.",
    "عرض مبسط يجمع طبقات أجهزة الجسم الرئيسية دون تحميل جميع الأصول عالية التفاصيل.",
  ),
  anatomy: text(
    "Organ systems occupy related regions and remain connected through vessels, nerves, fascia, and body cavities.",
    "تشغل أجهزة الجسم مناطق مترابطة وتتصل عبر الأوعية والأعصاب واللفافات وتجاويف الجسم.",
  ),
  physiology: text(
    "Normal function emerges from coordinated activity across multiple systems.",
    "تنشأ الوظيفة الطبيعية من النشاط المنسق بين أجهزة متعددة.",
  ),
  location: text("Whole body", "كامل الجسم"),
  systemId: "SYS_FULL_BODY",
  childrenIds: [],
  relatedStructureIds: [],
  relatedDiseaseIds: [],
  meshIds: [
    "BodyLayer_Cardiovascular",
    "BodyLayer_Respiratory",
    "BodyLayer_Digestive",
    "BodyLayer_Urinary",
    "BodyLayer_Nervous",
    "BodyLayer_Musculoskeletal",
  ],
  referenceIds,
  labelAnchor: [0, 2.4, 0],
};

const diseaseSeeds = [
  ["DIS_ASTHMA", "Asthma", "الربو", "ANAT_MAIN_BRONCHI", "Reversible airway narrowing and inflammation."],
  [
    "DIS_PNEUMONIA",
    "Pneumonia",
    "ذات الرئة",
    "ANAT_LUNG_RIGHT",
    "Inflammatory filling of affected air spaces.",
  ],
  [
    "DIS_EMPHYSEMA",
    "COPD / Emphysema",
    "الانسداد الرئوي والنفاخ",
    "ANAT_ALVEOLI",
    "Loss of elastic alveolar surface area.",
  ],
  [
    "DIS_PULMONARY_FIBROSIS",
    "Pulmonary fibrosis",
    "التليف الرئوي",
    "ANAT_LUNG_LEFT",
    "Progressive interstitial scarring and reduced compliance.",
  ],
  [
    "DIS_GERD",
    "Gastroesophageal reflux",
    "الارتجاع المعدي المريئي",
    "ANAT_ESOPHAGUS",
    "Reflux of gastric contents into the esophagus.",
  ],
  [
    "DIS_PEPTIC_ULCER",
    "Peptic ulcer",
    "القرحة الهضمية",
    "ANAT_STOMACH",
    "A mucosal defect exposed to acid and pepsin.",
  ],
  [
    "DIS_FATTY_LIVER",
    "Fatty liver",
    "الكبد الدهني",
    "ANAT_LIVER",
    "Excess triglyceride accumulation in hepatocytes.",
  ],
  [
    "DIS_CIRRHOSIS",
    "Cirrhosis",
    "تشمع الكبد",
    "ANAT_LIVER",
    "Diffuse fibrosis with regenerative nodules and architectural distortion.",
  ],
  [
    "DIS_GALLSTONES",
    "Gallstones",
    "حصوات المرارة",
    "ANAT_GALLBLADDER",
    "Crystalline material formed within the biliary system.",
  ],
  [
    "DIS_KIDNEY_STONES",
    "Kidney stones",
    "حصوات الكلى",
    "ANAT_RENAL_PELVIS",
    "Mineral concretions within the urinary tract.",
  ],
  [
    "DIS_HYDRONEPHROSIS",
    "Hydronephrosis",
    "موه الكلية",
    "ANAT_RENAL_PELVIS",
    "Dilation of the collecting system caused by urinary obstruction.",
  ],
  [
    "DIS_CHRONIC_KIDNEY",
    "Chronic kidney disease",
    "مرض الكلى المزمن",
    "ANAT_KIDNEY_LEFT",
    "Progressive loss of renal structure and filtration capacity.",
  ],
  [
    "DIS_POLYCYSTIC_KIDNEY",
    "Polycystic kidney disease",
    "داء الكلى متعددة الكيسات",
    "ANAT_KIDNEY_RIGHT",
    "Multiple expanding renal cysts alter normal tissue.",
  ],
  [
    "DIS_ISCHEMIC_STROKE",
    "Ischemic stroke",
    "السكتة الدماغية الإقفارية",
    "ANAT_CEREBRUM",
    "Interrupted arterial flow causes focal brain injury.",
  ],
  [
    "DIS_HEMORRHAGIC_STROKE",
    "Hemorrhagic stroke",
    "السكتة الدماغية النزفية",
    "ANAT_CEREBRUM",
    "Bleeding within or around the brain injures tissue.",
  ],
  [
    "DIS_MULTIPLE_SCLEROSIS",
    "Multiple sclerosis",
    "التصلب المتعدد",
    "ANAT_SPINAL_CORD",
    "Immune-mediated injury to central nervous system myelin.",
  ],
  [
    "DIS_BRAIN_TUMOR",
    "Brain tumor",
    "ورم الدماغ",
    "ANAT_FRONTAL_LOBE",
    "A localized illustrative intracranial mass.",
  ],
  [
    "DIS_FRACTURE",
    "Bone fracture",
    "كسر العظام",
    "ANAT_UPPER_LIMB",
    "Loss of structural continuity in bone.",
  ],
  [
    "DIS_OSTEOARTHRITIS",
    "Osteoarthritis",
    "الفصال العظمي",
    "ANAT_LOWER_LIMB",
    "Degenerative change involving articular cartilage and adjacent bone.",
  ],
  [
    "DIS_OSTEOPOROSIS",
    "Osteoporosis",
    "هشاشة العظام",
    "ANAT_VERTEBRAL_COLUMN",
    "Reduced bone mass and microarchitectural strength.",
  ],
  [
    "DIS_HERNIATED_DISC",
    "Herniated disc",
    "القرص المنفتق",
    "ANAT_VERTEBRAL_COLUMN",
    "Displacement of disc material may affect neural structures.",
  ],
  [
    "DIS_MUSCLE_TEAR",
    "Muscle tear",
    "تمزق العضلات",
    "ANAT_HAMSTRINGS",
    "Partial disruption of muscle or myotendinous fibers.",
  ],
] as const;

function disease([id, en, ar, structureId, summary]: (typeof diseaseSeeds)[number]): Disease {
  const stage = (order: number, nameEn: string, nameAr: string, scaleMultiplier = 0) => ({
    id: `${id}_STAGE_${order}`,
    order,
    name: text(nameEn, nameAr),
    description: text(`${nameEn} educational appearance.`, `مظهر تعليمي لمرحلة ${nameAr}.`),
    visualState: { color: order ? "#d98a63" : "#b96b66", scaleMultiplier },
  });
  return {
    id,
    name: text(en, ar),
    summary: text(summary, `حالة مرضية تعليمية مرتبطة بـ${ar}.`),
    etiology: text(
      "Multiple acquired or inherited factors may contribute.",
      "قد تسهم عوامل مكتسبة أو وراثية متعددة.",
    ),
    pathogenesis: text(summary, `يوضح المسار التعليمي التغير التدريجي المرتبط بـ${ar}.`),
    morphology: text(
      "The visual state highlights the affected structure conceptually.",
      "تبرز الحالة البصرية التركيب المصاب بصورة توضيحية.",
    ),
    functionalEffects: text(
      "Function may decline as structural change advances.",
      "قد تتراجع الوظيفة مع تقدم التغير البنيوي.",
    ),
    affectedStructureIds: [structureId],
    stages: [
      stage(0, "Healthy", "سليم"),
      stage(1, "Early", "مبكر"),
      stage(2, "Moderate", "متوسط", 0.03),
      stage(3, "Advanced", "متقدم", 0.07),
    ],
    referenceIds: ["REF_ROBBINS_COTRAN", "REF_GUYTON_HALL"],
    visualizationType: "material",
    visualizationAccuracy: "illustrative",
  };
}

export const expandedDiseases = diseaseSeeds.map(disease);

for (const structure of expandedStructures) {
  structure.relatedDiseaseIds = expandedDiseases
    .filter((item) => item.affectedStructureIds.includes(structure.id))
    .map((item) => item.id);
}

const animationSeeds = [
  [
    "PHYS_RESPIRATORY_AIRFLOW",
    "SYS_RESPIRATORY",
    "Airflow and ventilation",
    "تدفق الهواء والتهوية",
    ["ANAT_NASAL_CAVITY", "ANAT_TRACHEA", "ANAT_MAIN_BRONCHI", "ANAT_BRONCHIAL_TREE", "ANAT_ALVEOLI"],
  ],
  [
    "PHYS_DIGESTIVE_TRANSIT",
    "SYS_DIGESTIVE",
    "Digestive transit",
    "انتقال الغذاء",
    ["ANAT_ORAL_CAVITY", "ANAT_ESOPHAGUS", "ANAT_STOMACH", "ANAT_SMALL_INTESTINE", "ANAT_LARGE_INTESTINE"],
  ],
  [
    "PHYS_URINARY_FLOW",
    "SYS_URINARY",
    "Filtration and urine flow",
    "الترشيح وتدفق البول",
    [
      "ANAT_KIDNEY_LEFT",
      "ANAT_RENAL_CORTEX",
      "ANAT_RENAL_MEDULLA",
      "ANAT_RENAL_PELVIS",
      "ANAT_URETERS",
      "ANAT_URINARY_BLADDER",
    ],
  ],
  [
    "PHYS_NEURAL_SIGNAL",
    "SYS_NERVOUS",
    "Neural signal pathway",
    "مسار الإشارة العصبية",
    ["ANAT_BRAIN", "ANAT_BRAINSTEM", "ANAT_SPINAL_CORD", "ANAT_PERIPHERAL_NERVES"],
  ],
  [
    "PHYS_MOVEMENT_CHAIN",
    "SYS_MUSCULOSKELETAL",
    "Movement chain",
    "سلسلة الحركة",
    ["ANAT_UPPER_LIMB", "ANAT_DELTOID", "ANAT_BICEPS", "ANAT_LOWER_LIMB", "ANAT_QUADRICEPS"],
  ],
] as const;

const structureMap = new Map([...heartStructures, ...expandedStructures].map((item) => [item.id, item]));

export const physiologyAnimations: PhysiologyAnimation[] = animationSeeds.map(
  ([id, systemId, en, ar, structureIds]) => ({
    id,
    systemId,
    name: text(en, ar),
    structureIds: [...structureIds],
    duration: 8,
    steps: structureIds.map((structureId, index) => ({
      id: `${id}_${index + 1}`,
      structureId,
      name: structureMap.get(structureId)?.name ?? text(structureId, structureId),
      description: text(
        `Step ${index + 1} of the ${en.toLowerCase()} pathway.`,
        `الخطوة ${index + 1} من مسار ${ar}.`,
      ),
      order: index + 1,
    })),
  }),
);

export const crossSystemRelationships: StructureRelationship[] = [
  {
    sourceStructureId: "ANAT_LUNG_RIGHT",
    targetStructureId: "ANAT_HEART_PULMONARY_TRUNK",
    type: "connected_to",
  },
  { sourceStructureId: "ANAT_LUNG_LEFT", targetStructureId: "ANAT_HEART_LA", type: "drains_into" },
  { sourceStructureId: "ANAT_KIDNEY_RIGHT", targetStructureId: "ANAT_HEART_AORTA", type: "supplies" },
  { sourceStructureId: "ANAT_CEREBRUM", targetStructureId: "ANAT_HEART_AORTA", type: "connected_to" },
  { sourceStructureId: "ANAT_DIAPHRAGM", targetStructureId: "ANAT_LIVER", type: "adjacent_to" },
  { sourceStructureId: "ANAT_SPINAL_CORD", targetStructureId: "ANAT_BICEPS", type: "controls" },
];

export const allHumanStructures = [fullBodyStructure, ...heartStructures, ...expandedStructures];
