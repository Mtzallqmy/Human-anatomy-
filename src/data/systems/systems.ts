import type { BodySystem } from "@/src/types/medical";

const shared = {
  organIds: [] as string[],
  available: false,
  accentColor: "#718394",
};

export const bodySystems: BodySystem[] = [
  {
    ...shared,
    id: "SYS_CARDIOVASCULAR",
    slug: "cardiovascular",
    name: { en: "Cardiovascular", ar: "الجهاز الدوري" },
    description: {
      en: "The heart, blood vessels, and circulation.",
      ar: "القلب والأوعية الدموية والدورة الدموية.",
    },
    icon: "heart",
    available: true,
    organIds: ["ANAT_HEART"],
    accentColor: "#d36d68",
  },
  {
    ...shared,
    id: "SYS_SKELETAL",
    slug: "skeletal",
    name: { en: "Skeletal", ar: "الجهاز الهيكلي" },
    description: {
      en: "Bones, joints, and supporting structures.",
      ar: "العظام والمفاصل والتراكيب الداعمة.",
    },
    icon: "bone",
  },
  {
    ...shared,
    id: "SYS_MUSCULAR",
    slug: "muscular",
    name: { en: "Muscular", ar: "الجهاز العضلي" },
    description: { en: "Skeletal, smooth, and cardiac muscle.", ar: "العضلات الهيكلية والملساء والقلبية." },
    icon: "activity",
  },
  {
    ...shared,
    id: "SYS_NERVOUS",
    slug: "nervous",
    name: { en: "Nervous", ar: "الجهاز العصبي" },
    description: {
      en: "Brain, spinal cord, and peripheral nerves.",
      ar: "الدماغ والحبل الشوكي والأعصاب المحيطية.",
    },
    icon: "brain",
  },
  {
    ...shared,
    id: "SYS_RESPIRATORY",
    slug: "respiratory",
    name: { en: "Respiratory", ar: "الجهاز التنفسي" },
    description: { en: "Airways, lungs, and gas exchange.", ar: "الطرق الهوائية والرئتان وتبادل الغازات." },
    icon: "wind",
  },
  {
    ...shared,
    id: "SYS_DIGESTIVE",
    slug: "digestive",
    name: { en: "Digestive", ar: "الجهاز الهضمي" },
    description: { en: "Digestive tract and accessory organs.", ar: "القناة الهضمية والأعضاء الملحقة." },
    icon: "circle-dot",
  },
  {
    ...shared,
    id: "SYS_URINARY",
    slug: "urinary",
    name: { en: "Urinary", ar: "الجهاز البولي" },
    description: { en: "Kidneys, ureters, and urinary bladder.", ar: "الكليتان والحالبان والمثانة البولية." },
    icon: "droplets",
  },
  {
    ...shared,
    id: "SYS_ENDOCRINE",
    slug: "endocrine",
    name: { en: "Endocrine", ar: "جهاز الغدد الصماء" },
    description: { en: "Hormone-producing glands and tissues.", ar: "الغدد والأنسجة المنتجة للهرمونات." },
    icon: "sparkles",
  },
  {
    ...shared,
    id: "SYS_LYMPHATIC",
    slug: "lymphatic",
    name: { en: "Lymphatic", ar: "الجهاز اللمفاوي" },
    description: { en: "Lymphatic vessels, nodes, and immunity.", ar: "الأوعية والعقد اللمفاوية والمناعة." },
    icon: "git-branch",
  },
  {
    ...shared,
    id: "SYS_REPRODUCTIVE",
    slug: "reproductive",
    name: { en: "Reproductive", ar: "الجهاز التناسلي" },
    description: { en: "Reproductive organs and development.", ar: "الأعضاء التناسلية وعلم التطور." },
    icon: "circle",
  },
];
