import type { AnatomicalStructure, LocalizedText } from "@/src/types/medical";

const systemId = "SYS_CARDIOVASCULAR";
const references = ["REF_FIPAT_TA2", "REF_GRAYS_ANATOMY", "REF_GUYTON_HALL"];

interface StructureSeed {
  id: string;
  en: string;
  ar: string;
  latin: string;
  anatomy: LocalizedText;
  physiology: LocalizedText;
  location: LocalizedText;
  anchor: [number, number, number];
  mesh: string;
  diseases?: string[];
  related?: string[];
  number?: number;
}

const seeds: StructureSeed[] = [
  {
    id: "ANAT_HEART_RA",
    en: "Right atrium",
    ar: "الأذين الأيمن",
    latin: "Atrium dextrum",
    anatomy: {
      en: "A thin-walled chamber that receives systemic venous return from the venae cavae and coronary sinus.",
      ar: "حجرة رقيقة الجدار تستقبل العود الوريدي الجهازي من الوريدين الأجوفين والجيب التاجي.",
    },
    physiology: {
      en: "Collects deoxygenated blood and transfers it across the tricuspid valve into the right ventricle.",
      ar: "تجمع الدم غير المؤكسج وتنقله عبر الصمام ثلاثي الشرفات إلى البطين الأيمن.",
    },
    location: { en: "Right superior cardiac border", ar: "الحافة القلبية العلوية اليمنى" },
    anchor: [1.12, 0.84, 0.2],
    mesh: "Heart_RightAtrium",
    related: ["ANAT_HEART_SVC", "ANAT_HEART_IVC", "ANAT_HEART_TRICUSPID"],
    number: 3,
  },
  {
    id: "ANAT_HEART_LA",
    en: "Left atrium",
    ar: "الأذين الأيسر",
    latin: "Atrium sinistrum",
    anatomy: {
      en: "A posterior chamber that receives oxygenated blood through the pulmonary veins.",
      ar: "حجرة خلفية تستقبل الدم المؤكسج عبر الأوردة الرئوية.",
    },
    physiology: {
      en: "Acts as a reservoir and conduit before filling the left ventricle through the mitral valve.",
      ar: "تعمل خزانًا وممرًا للدم قبل ملء البطين الأيسر عبر الصمام التاجي.",
    },
    location: { en: "Posterior aspect of the cardiac base", ar: "السطح الخلفي لقاعدة القلب" },
    anchor: [-0.62, 0.94, 0.05],
    mesh: "Heart_LeftAtrium",
    related: ["ANAT_HEART_MITRAL", "ANAT_HEART_LV"],
  },
  {
    id: "ANAT_HEART_RV",
    en: "Right ventricle",
    ar: "البطين الأيمن",
    latin: "Ventriculus dexter",
    anatomy: {
      en: "A crescent-shaped ventricular chamber forming much of the anterior cardiac surface.",
      ar: "حجرة بطينية هلالية الشكل تشكل معظم السطح الأمامي للقلب.",
    },
    physiology: {
      en: "Generates the pressure required to deliver blood to the low-resistance pulmonary circulation.",
      ar: "تولد الضغط اللازم لإيصال الدم إلى الدوران الرئوي منخفض المقاومة.",
    },
    location: { en: "Anterior and inferior cardiac surface", ar: "السطح القلبي الأمامي والسفلي" },
    anchor: [0.72, -0.52, 0.6],
    mesh: "Heart_RightVentricle",
    diseases: ["DIS_MYOCARDIAL_INFARCTION"],
    related: ["ANAT_HEART_TRICUSPID", "ANAT_HEART_PULMONARY_VALVE"],
  },
  {
    id: "ANAT_HEART_LV",
    en: "Left ventricle",
    ar: "البطين الأيسر",
    latin: "Ventriculus sinister",
    anatomy: {
      en: "The thick-walled chamber forming the cardiac apex and much of the left diaphragmatic surface.",
      ar: "حجرة سميكة الجدار تشكل قمة القلب وجزءًا كبيرًا من سطحه الحجابي الأيسر.",
    },
    physiology: {
      en: "Ejects oxygenated blood through the aortic valve to sustain systemic arterial circulation.",
      ar: "تقذف الدم المؤكسج عبر الصمام الأبهري للمحافظة على الدوران الشرياني الجهازي.",
    },
    location: { en: "Left inferolateral heart and apex", ar: "الجانب السفلي الوحشي الأيسر للقلب وقمته" },
    anchor: [-0.56, -0.72, 0.64],
    mesh: "Heart_LeftVentricle",
    diseases: ["DIS_MYOCARDIAL_INFARCTION", "DIS_CARDIAC_HYPERTROPHY", "DIS_AORTIC_STENOSIS"],
    related: ["ANAT_HEART_MITRAL", "ANAT_HEART_AORTIC_VALVE", "ANAT_HEART_SEPTUM"],
    number: 4,
  },
  {
    id: "ANAT_HEART_SEPTUM",
    en: "Interventricular septum",
    ar: "الحاجز بين البطينين",
    latin: "Septum interventriculare",
    anatomy: {
      en: "A predominantly muscular partition separating the right and left ventricles, with a small membranous component.",
      ar: "حاجز عضلي في معظمه يفصل بين البطينين الأيمن والأيسر ويحتوي جزءًا غشائيًا صغيرًا.",
    },
    physiology: {
      en: "Maintains separation of pulmonary and systemic flow and contributes to coordinated ventricular contraction.",
      ar: "يحافظ على فصل الدورانين الرئوي والجهازي ويساهم في انقباض البطينين بصورة متناسقة.",
    },
    location: {
      en: "Between the right and left ventricular cavities",
      ar: "بين جوفي البطينين الأيمن والأيسر",
    },
    anchor: [0.02, -0.24, 0.79],
    mesh: "Heart_InterventricularSeptum",
    diseases: ["DIS_CARDIAC_HYPERTROPHY"],
    related: ["ANAT_HEART_LV", "ANAT_HEART_RV"],
  },
  {
    id: "ANAT_HEART_AORTA",
    en: "Aorta",
    ar: "الشريان الأبهر",
    latin: "Aorta",
    anatomy: {
      en: "The largest systemic artery, beginning at the aortic root and continuing as the ascending aorta and arch.",
      ar: "أكبر شريان جهازي، يبدأ من جذر الأبهر ويتابع بصفته الأبهر الصاعد ثم القوس الأبهري.",
    },
    physiology: {
      en: "Conducts oxygenated blood from the left ventricle and buffers pulsatile ejection through elastic recoil.",
      ar: "ينقل الدم المؤكسج من البطين الأيسر ويخفف نبضات القذف بفضل الارتداد المرن.",
    },
    location: {
      en: "Superior mediastinum, arising from the left ventricle",
      ar: "المنصف العلوي، وينشأ من البطين الأيسر",
    },
    anchor: [-0.38, 1.96, 0.08],
    mesh: "Heart_Aorta",
    diseases: ["DIS_ATHEROSCLEROSIS", "DIS_AORTIC_STENOSIS"],
    related: ["ANAT_HEART_AORTIC_VALVE", "ANAT_HEART_LV"],
    number: 1,
  },
  {
    id: "ANAT_HEART_PULMONARY_TRUNK",
    en: "Pulmonary trunk",
    ar: "الجذع الرئوي",
    latin: "Truncus pulmonalis",
    anatomy: {
      en: "A great vessel arising from the right ventricle and dividing into the right and left pulmonary arteries.",
      ar: "وعاء كبير ينشأ من البطين الأيمن وينقسم إلى الشريانين الرئويين الأيمن والأيسر.",
    },
    physiology: {
      en: "Delivers deoxygenated blood to the pulmonary arterial circulation for gas exchange.",
      ar: "يوصل الدم غير المؤكسج إلى الدوران الشرياني الرئوي لإتمام تبادل الغازات.",
    },
    location: { en: "Anterior and left of the ascending aorta", ar: "أمام الأبهر الصاعد وإلى يساره" },
    anchor: [0.36, 1.54, 0.58],
    mesh: "Heart_PulmonaryTrunk",
    related: ["ANAT_HEART_RV", "ANAT_HEART_PULMONARY_VALVE"],
    number: 2,
  },
  {
    id: "ANAT_HEART_SVC",
    en: "Superior vena cava",
    ar: "الوريد الأجوف العلوي",
    latin: "Vena cava superior",
    anatomy: {
      en: "A large valveless vein returning blood from the head, neck, upper limbs, and upper thorax.",
      ar: "وريد كبير بلا صمامات يعيد الدم من الرأس والعنق والطرفين العلويين والجزء العلوي من الصدر.",
    },
    physiology: {
      en: "Channels systemic venous return from the upper body into the right atrium.",
      ar: "ينقل العود الوريدي الجهازي من الجزء العلوي للجسم إلى الأذين الأيمن.",
    },
    location: { en: "Right superior mediastinum", ar: "الجهة اليمنى من المنصف العلوي" },
    anchor: [1.08, 1.91, -0.05],
    mesh: "Heart_SuperiorVenaCava",
    related: ["ANAT_HEART_RA"],
  },
  {
    id: "ANAT_HEART_IVC",
    en: "Inferior vena cava",
    ar: "الوريد الأجوف السفلي",
    latin: "Vena cava inferior",
    anatomy: {
      en: "The main venous channel returning blood from the lower body and abdomen to the heart.",
      ar: "القناة الوريدية الرئيسية التي تعيد الدم من الجزء السفلي للجسم والبطن إلى القلب.",
    },
    physiology: {
      en: "Maintains systemic venous return from structures below the diaphragm.",
      ar: "تحافظ على العود الوريدي الجهازي من التراكيب الواقعة أسفل الحجاب الحاجز.",
    },
    location: { en: "Inferior aspect of the right atrium", ar: "السطح السفلي للأذين الأيمن" },
    anchor: [1.11, -1.05, -0.24],
    mesh: "Heart_InferiorVenaCava",
    related: ["ANAT_HEART_RA"],
  },
  {
    id: "ANAT_HEART_TRICUSPID",
    en: "Tricuspid valve",
    ar: "الصمام ثلاثي الشرفات",
    latin: "Valva atrioventricularis dextra",
    anatomy: {
      en: "The right atrioventricular valve formed by three leaflets supported by chordae tendineae.",
      ar: "الصمام الأذيني البطيني الأيمن ويتكون من ثلاث شرفات تدعمها الحبال الوترية.",
    },
    physiology: {
      en: "Permits right ventricular filling and prevents regurgitation into the right atrium during systole.",
      ar: "يسمح بملء البطين الأيمن ويمنع رجوع الدم إلى الأذين الأيمن أثناء الانقباض.",
    },
    location: { en: "Between the right atrium and right ventricle", ar: "بين الأذين الأيمن والبطين الأيمن" },
    anchor: [0.8, 0.24, 0.71],
    mesh: "Heart_TricuspidValve",
    related: ["ANAT_HEART_RA", "ANAT_HEART_RV"],
  },
  {
    id: "ANAT_HEART_MITRAL",
    en: "Mitral valve",
    ar: "الصمام التاجي",
    latin: "Valva atrioventricularis sinistra",
    anatomy: {
      en: "The left atrioventricular valve with anterior and posterior leaflets tethered to papillary muscles.",
      ar: "الصمام الأذيني البطيني الأيسر ذو شرفتين أمامية وخلفية ترتبطان بالعضلات الحليمية.",
    },
    physiology: {
      en: "Directs left ventricular filling and prevents retrograde flow into the left atrium during systole.",
      ar: "ينظم ملء البطين الأيسر ويمنع ارتجاع الدم إلى الأذين الأيسر أثناء الانقباض.",
    },
    location: { en: "Between the left atrium and left ventricle", ar: "بين الأذين الأيسر والبطين الأيسر" },
    anchor: [-0.55, 0.33, 0.75],
    mesh: "Heart_MitralValve",
    related: ["ANAT_HEART_LA", "ANAT_HEART_LV"],
  },
  {
    id: "ANAT_HEART_PULMONARY_VALVE",
    en: "Pulmonary valve",
    ar: "الصمام الرئوي",
    latin: "Valva trunci pulmonalis",
    anatomy: {
      en: "A semilunar valve with three cusps at the origin of the pulmonary trunk.",
      ar: "صمام هلالي له ثلاث شرفات عند منشأ الجذع الرئوي.",
    },
    physiology: {
      en: "Opens during right ventricular systole and prevents reverse pulmonary arterial flow during diastole.",
      ar: "يفتح أثناء انقباض البطين الأيمن ويمنع رجوع الدم من الشريان الرئوي أثناء الانبساط.",
    },
    location: { en: "Right ventricular outflow tract", ar: "مجرى خروج البطين الأيمن" },
    anchor: [0.37, 0.95, 0.72],
    mesh: "Heart_PulmonaryValve",
    related: ["ANAT_HEART_RV", "ANAT_HEART_PULMONARY_TRUNK"],
  },
  {
    id: "ANAT_HEART_AORTIC_VALVE",
    en: "Aortic valve",
    ar: "الصمام الأبهري",
    latin: "Valva aortae",
    anatomy: {
      en: "A semilunar valve with three cusps located between the left ventricular outflow tract and aortic root.",
      ar: "صمام هلالي ذو ثلاث شرفات يقع بين مجرى خروج البطين الأيسر وجذر الأبهر.",
    },
    physiology: {
      en: "Enables forward systemic ejection while preventing aortic regurgitation in diastole.",
      ar: "يسمح بقذف الدم نحو الدوران الجهازي ويمنع القلس الأبهري أثناء الانبساط.",
    },
    location: { en: "Aortic root, superior to the left ventricle", ar: "جذر الأبهر فوق البطين الأيسر" },
    anchor: [-0.33, 0.99, 0.49],
    mesh: "Heart_AorticValve",
    diseases: ["DIS_AORTIC_STENOSIS"],
    related: ["ANAT_HEART_LV", "ANAT_HEART_AORTA"],
  },
  {
    id: "ANAT_HEART_CORONARY",
    en: "Coronary arteries",
    ar: "الشرايين التاجية",
    latin: "Arteriae coronariae",
    anatomy: {
      en: "Epicardial arterial branches arising from the aortic root and supplying the myocardium.",
      ar: "فروع شريانية فوق تامورية تنشأ من جذر الأبهر وتغذي عضلة القلب.",
    },
    physiology: {
      en: "Provide myocardial oxygen and nutrients, with most left coronary perfusion occurring during diastole.",
      ar: "تزود عضلة القلب بالأكسجين والمغذيات، وتحدث أغلب تروية التاجي الأيسر أثناء الانبساط.",
    },
    location: {
      en: "Epicardial surface and atrioventricular grooves",
      ar: "السطح فوق التاموري والأخاديد الأذينية البطينية",
    },
    anchor: [-0.14, -0.02, 1.18],
    mesh: "Heart_CoronaryArteries",
    diseases: ["DIS_ATHEROSCLEROSIS", "DIS_MYOCARDIAL_INFARCTION"],
    related: ["ANAT_HEART_AORTA", "ANAT_HEART_LV"],
  },
];

const childStructures: AnatomicalStructure[] = seeds.map((seed) => ({
  id: seed.id,
  name: { en: seed.en, ar: seed.ar },
  latinName: seed.latin,
  description: seed.anatomy,
  anatomy: seed.anatomy,
  physiology: seed.physiology,
  location: seed.location,
  systemId,
  parentId: "ANAT_HEART",
  childrenIds: [],
  relatedStructureIds: seed.related ?? [],
  relatedDiseaseIds: seed.diseases ?? [],
  meshIds: [seed.mesh],
  referenceIds: references,
  labelAnchor: seed.anchor,
  studyNumber: seed.number,
}));

export const heartStructures: AnatomicalStructure[] = [
  {
    id: "ANAT_HEART",
    name: { en: "Heart", ar: "القلب" },
    latinName: "Cor",
    description: {
      en: "A four-chambered muscular pump that coordinates pulmonary and systemic circulation.",
      ar: "مضخة عضلية ذات أربع حجرات تنسق بين الدورانين الرئوي والجهازي.",
    },
    anatomy: {
      en: "The heart occupies the middle mediastinum. Its right and left atria receive venous return, while the ventricles eject blood into the pulmonary trunk and aorta.",
      ar: "يشغل القلب المنصف الأوسط. يستقبل الأذينان الأيمن والأيسر العود الوريدي، بينما يقذف البطينان الدم إلى الجذع الرئوي والأبهر.",
    },
    physiology: {
      en: "Rhythmic electrical activation coordinates atrial and ventricular contraction, generating forward flow through the pulmonary and systemic circuits.",
      ar: "ينسق التنبيه الكهربائي المنتظم انقباض الأذينين والبطينين مولدًا تدفق الدم باتجاه أمامي في الدورانين الرئوي والجهازي.",
    },
    location: { en: "Middle mediastinum, between the lungs", ar: "المنصف الأوسط بين الرئتين" },
    bloodSupply: { en: "Right and left coronary arteries", ar: "الشريانان التاجيان الأيمن والأيسر" },
    innervation: {
      en: "Sympathetic cardiac nerves and parasympathetic vagal fibers",
      ar: "الأعصاب القلبية الودية وألياف العصب المبهم نظيرة الودية",
    },
    systemId,
    childrenIds: childStructures.map((structure) => structure.id),
    relatedStructureIds: [],
    relatedDiseaseIds: [
      "DIS_ATHEROSCLEROSIS",
      "DIS_MYOCARDIAL_INFARCTION",
      "DIS_AORTIC_STENOSIS",
      "DIS_CARDIAC_HYPERTROPHY",
    ],
    meshIds: ["Heart_Myocardium"],
    referenceIds: references,
    labelAnchor: [0, 0, 0],
  },
  ...childStructures,
];
