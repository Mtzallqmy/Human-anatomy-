import type { AnatomicalStructure, BodySystem, LocalizedText, PhysiologyAnimation } from "@/src/types/medical";

const text = (en: string, ar: string): LocalizedText => ({ en, ar });
const references = ["REF_FIPAT_TA2", "REF_GRAYS_ANATOMY", "REF_GUYTON_HALL"];

const structure = (
  id: string,
  systemId: string,
  en: string,
  ar: string,
  anatomy: string,
  anatomyAr: string,
  physiology: string,
  physiologyAr: string,
  location: string,
  locationAr: string,
  parentId?: string,
  childrenIds: string[] = [],
): AnatomicalStructure => ({
  id,
  systemId,
  name: text(en, ar),
  description: text(anatomy, anatomyAr),
  anatomy: text(anatomy, anatomyAr),
  physiology: text(physiology, physiologyAr),
  location: text(location, locationAr),
  parentId,
  childrenIds,
  relatedStructureIds: [],
  relatedDiseaseIds: [],
  meshIds: [`Mesh_${id}`],
  referenceIds: references,
});

export const sexSpecificSystems: BodySystem[] = [
  {
    id: "SYS_MALE_BODY",
    slug: "male-body",
    name: text("Male full body", "جسم الرجل الكامل"),
    description: text(
      "A complete male-body atlas showing the spatial position of every major organ system and the male reproductive anatomy in context.",
      "أطلس كامل لجسم الرجل يوضح الموقع المكاني لكل جهاز رئيسي مع التشريح التناسلي الذكري ضمن سياق الجسم الكامل.",
    ),
    icon: "scan",
    available: true,
    organIds: ["ANAT_MALE_BODY"],
    accentColor: "#6f9fc1",
    rootStructureIds: ["ANAT_MALE_BODY"],
    status: "published",
  },
  {
    id: "SYS_FEMALE_BODY",
    slug: "female-body",
    name: text("Female full body", "جسم المرأة الكامل"),
    description: text(
      "A complete female-body atlas showing every major organ system with female pelvic and reproductive anatomy in whole-body context.",
      "أطلس كامل لجسم المرأة يوضح جميع أجهزة الجسم مع تشريح الحوض والجهاز التناسلي الأنثوي ضمن سياق الجسم الكامل.",
    ),
    icon: "scan",
    available: true,
    organIds: ["ANAT_FEMALE_BODY"],
    accentColor: "#bd83a6",
    rootStructureIds: ["ANAT_FEMALE_BODY"],
    status: "published",
  },
  {
    id: "SYS_MALE_REPRODUCTIVE",
    slug: "male-reproductive",
    name: text("Male reproductive", "الجهاز التناسلي الذكري"),
    description: text(
      "Testes, epididymides, ductus deferentes, seminal vesicles, prostate, urethra and penis with spermatogenesis, hormone control and ejaculation physiology.",
      "الخصيتان والبربخان والأسهران والحويصلات المنوية والبروستاتا والإحليل والقضيب مع تكوين النطاف والتحكم الهرموني وفسيولوجيا القذف.",
    ),
    icon: "circle",
    available: true,
    organIds: ["ANAT_MALE_TESTES", "ANAT_MALE_PROSTATE", "ANAT_MALE_PENIS"],
    accentColor: "#7398bc",
    rootStructureIds: ["ANAT_MALE_REPRODUCTIVE"],
    status: "published",
  },
  {
    id: "SYS_FEMALE_REPRODUCTIVE",
    slug: "female-reproductive",
    name: text("Female reproductive", "الجهاز التناسلي الأنثوي"),
    description: text(
      "Ovaries, uterine tubes, uterus, cervix, vagina and external genitalia with ovulation, menstrual cycling, fertilization and pregnancy physiology.",
      "المبيضان والأنبوبان الرحميان والرحم وعنق الرحم والمهبل والأعضاء التناسلية الخارجية مع الإباضة والدورة الشهرية والإخصاب وفسيولوجيا الحمل.",
    ),
    icon: "circle",
    available: true,
    organIds: ["ANAT_FEMALE_OVARIES", "ANAT_FEMALE_UTERUS", "ANAT_FEMALE_VAGINA"],
    accentColor: "#c486a9",
    rootStructureIds: ["ANAT_FEMALE_REPRODUCTIVE"],
    status: "published",
  },
];

const bodyLayerNames: Array<[string, string, string]> = [
  ["CARDIOVASCULAR", "Cardiovascular system", "الجهاز الدوري"],
  ["RESPIRATORY", "Respiratory system", "الجهاز التنفسي"],
  ["DIGESTIVE", "Digestive system", "الجهاز الهضمي"],
  ["URINARY", "Urinary system", "الجهاز البولي"],
  ["NERVOUS", "Nervous system", "الجهاز العصبي"],
  ["SKELETAL", "Skeletal system", "الجهاز الهيكلي"],
  ["MUSCULAR", "Muscular system", "الجهاز العضلي"],
  ["ENDOCRINE", "Endocrine system", "جهاز الغدد الصماء"],
  ["LYMPHATIC", "Lymphatic & immune system", "الجهاز اللمفاوي والمناعي"],
  ["INTEGUMENTARY", "Integumentary system", "الجهاز اللحافي"],
];

const makeBodyStructures = (sex: "MALE" | "FEMALE"): AnatomicalStructure[] => {
  const systemId = sex === "MALE" ? "SYS_MALE_BODY" : "SYS_FEMALE_BODY";
  const rootId = sex === "MALE" ? "ANAT_MALE_BODY" : "ANAT_FEMALE_BODY";
  const reproductiveId = sex === "MALE" ? "ANAT_MALE_REPRODUCTIVE_POSITION" : "ANAT_FEMALE_REPRODUCTIVE_POSITION";
  const children = [
    ...bodyLayerNames.map(([key]) => `ANAT_${sex}_BODY_${key}`),
    reproductiveId,
  ];
  const root = structure(
    rootId,
    systemId,
    sex === "MALE" ? "Male body" : "Female body",
    sex === "MALE" ? "جسم الرجل" : "جسم المرأة",
    "The body is presented as superimposed anatomical systems so their three-dimensional relationships can be studied without losing whole-body orientation.",
    "يُعرض الجسم كأجهزة تشريحية متراكبة لدراسة علاقاتها ثلاثية الأبعاد مع الحفاظ على اتجاه الجسم الكامل.",
    "All systems work simultaneously through circulation, ventilation, neural control, endocrine signaling, digestion, filtration, immunity, movement and reproduction.",
    "تعمل جميع الأجهزة في الوقت نفسه عبر الدوران والتهوية والتحكم العصبي والإشارات الهرمونية والهضم والترشيح والمناعة والحركة والتكاثر.",
    "Whole body from head to feet.",
    "الجسم كاملًا من الرأس إلى القدمين.",
    undefined,
    children,
  );
  const layers = bodyLayerNames.map(([key, en, ar]) =>
    structure(
      `ANAT_${sex}_BODY_${key}`,
      systemId,
      en,
      ar,
      `${en} shown in its true regional relationship to the skeleton, viscera, vessels and body wall.`,
      `${ar} موضح في علاقته الموضعية مع الهيكل والأحشاء والأوعية وجدار الجسم.`,
      `This layer participates continuously in integrated whole-body homeostasis.`,
      "تشارك هذه الطبقة باستمرار في حفظ الاتزان الداخلي المتكامل للجسم.",
      "Distributed through its normal anatomical regions.",
      "موزع في مناطقه التشريحية الطبيعية.",
      rootId,
    ),
  );
  const reproductive = structure(
    reproductiveId,
    systemId,
    sex === "MALE" ? "Male reproductive position" : "Female reproductive position",
    sex === "MALE" ? "موضع الجهاز التناسلي الذكري" : "موضع الجهاز التناسلي الأنثوي",
    sex === "MALE"
      ? "The male reproductive organs occupy the pelvis, perineum and scrotum, with ducts traversing the inguinal region."
      : "The female reproductive organs occupy the true pelvis between the urinary bladder and rectum, with ovaries lateral to the uterus.",
    sex === "MALE"
      ? "تشغل الأعضاء التناسلية الذكرية الحوض والعجان وكيس الصفن مع مرور القنوات عبر المنطقة الأربية."
      : "تشغل الأعضاء التناسلية الأنثوية الحوض الحقيقي بين المثانة والمستقيم مع وجود المبيضين وحشيًا للرحم.",
    sex === "MALE" ? "Supports sperm production, transport, seminal fluid formation and androgen secretion." : "Supports oocyte maturation, cyclic endometrial preparation, fertilization, implantation and pregnancy.",
    sex === "MALE" ? "يدعم إنتاج النطاف ونقلها وتكوين السائل المنوي وإفراز الأندروجينات." : "يدعم نضج البويضات والتحضير الدوري لبطانة الرحم والإخصاب والانغراس والحمل.",
    "Pelvis and perineum.",
    "الحوض والعجان.",
    rootId,
  );
  return [root, ...layers, reproductive];
};

const maleRoot = "ANAT_MALE_REPRODUCTIVE";
const femaleRoot = "ANAT_FEMALE_REPRODUCTIVE";

const maleStructures: AnatomicalStructure[] = [
  structure(maleRoot, "SYS_MALE_REPRODUCTIVE", "Male reproductive system", "الجهاز التناسلي الذكري", "A connected system of gonads, ducts, accessory glands and external genital structures.", "منظومة مترابطة من الغدد التناسلية والقنوات والغدد الملحقة والأعضاء التناسلية الخارجية.", "Produces testosterone and sperm, matures and transports sperm, adds glandular secretions and enables deposition of semen.", "ينتج التستوستيرون والنطاف وينضج النطاف وينقلها ويضيف إفرازات الغدد ويتيح إيصال السائل المنوي.", "Pelvis, perineum and scrotum.", "الحوض والعجان وكيس الصفن.", undefined, ["ANAT_MALE_TESTES", "ANAT_MALE_EPIDIDYMIS", "ANAT_MALE_VAS_DEFERENS", "ANAT_MALE_SEMINAL_VESICLES", "ANAT_MALE_PROSTATE", "ANAT_MALE_URETHRA", "ANAT_MALE_PENIS"]),
  structure("ANAT_MALE_TESTES", "SYS_MALE_REPRODUCTIVE", "Testes", "الخصيتان", "Paired gonads composed of seminiferous tubules and interstitial endocrine tissue.", "غدتان تناسليتان تتكونان من أنيبيبات منوية ونسيج صماوي بيني.", "Seminiferous epithelium produces sperm while Leydig cells produce testosterone under LH stimulation.", "تنتج الظهارة المنوية النطاف بينما تنتج خلايا لايديغ التستوستيرون بتحفيز LH.", "Scrotum, inferior to the penis.", "كيس الصفن أسفل القضيب.", maleRoot),
  structure("ANAT_MALE_EPIDIDYMIS", "SYS_MALE_REPRODUCTIVE", "Epididymis", "البربخ", "A highly coiled duct along the posterior testis.", "قناة شديدة الالتفاف على الوجه الخلفي للخصية.", "Sperm acquire progressive motility and fertilizing competence during epididymal transit and storage.", "تكتسب النطاف الحركة التقدمية والقدرة على الإخصاب أثناء مرورها وتخزينها في البربخ.", "Posterolateral surface of each testis.", "السطح الخلفي الوحشي لكل خصية.", maleRoot),
  structure("ANAT_MALE_VAS_DEFERENS", "SYS_MALE_REPRODUCTIVE", "Ductus deferens", "الأسهر", "A thick muscular tube continuing from the epididymis through the spermatic cord into the pelvis.", "أنبوب عضلي سميك يستمر من البربخ عبر الحبل المنوي إلى الحوض.", "Peristaltic smooth-muscle contractions rapidly propel sperm during emission.", "تدفع تقلصات العضلات الملساء التمعجية النطاف سريعًا خلال مرحلة الانبعاث.", "Scrotum, inguinal canal and pelvis.", "كيس الصفن والقناة الأربية والحوض.", maleRoot),
  structure("ANAT_MALE_SEMINAL_VESICLES", "SYS_MALE_REPRODUCTIVE", "Seminal vesicles", "الحويصلات المنوية", "Paired elongated glands posterior to the urinary bladder.", "غدتان ممدودتان خلف المثانة البولية.", "Contribute fructose-rich alkaline fluid and much of semen volume.", "تسهم بسائل قلوي غني بالفركتوز ويشكل جزءًا كبيرًا من حجم السائل المنوي.", "Posterior to bladder, superior to prostate.", "خلف المثانة وفوق البروستاتا.", maleRoot),
  structure("ANAT_MALE_PROSTATE", "SYS_MALE_REPRODUCTIVE", "Prostate", "البروستاتا", "A fibromuscular gland surrounding the proximal urethra below the bladder.", "غدة ليفية عضلية تحيط بالإحليل القريب أسفل المثانة.", "Adds prostatic secretions to semen and contracts during ejaculation.", "تضيف إفرازات البروستاتا إلى السائل المنوي وتنقبض أثناء القذف.", "Immediately inferior to urinary bladder.", "أسفل المثانة مباشرة.", maleRoot),
  structure("ANAT_MALE_URETHRA", "SYS_MALE_REPRODUCTIVE", "Male urethra", "الإحليل الذكري", "A continuous channel through prostate, pelvic floor and penis.", "قناة متصلة تمر عبر البروستاتا وقاع الحوض والقضيب.", "Conducts urine and, at different times, semen to the exterior.", "ينقل البول والسائل المنوي إلى الخارج في أوقات مختلفة.", "From bladder neck to external urethral meatus.", "من عنق المثانة إلى الفوهة الخارجية للإحليل.", maleRoot),
  structure("ANAT_MALE_PENIS", "SYS_MALE_REPRODUCTIVE", "Penis", "القضيب", "External erectile organ formed by paired corpora cavernosa and corpus spongiosum around the urethra.", "عضو انتصابي خارجي يتكون من جسمين كهفيين وجسم إسفنجي يحيط بالإحليل.", "Parasympathetic vasodilation produces erection; sympathetic and somatic pathways coordinate emission and ejaculation.", "يحدث الانتصاب بتوسع وعائي نظير ودي بينما تنسق المسارات الودية والجسدية الانبعاث والقذف.", "Anterior perineum.", "العجان الأمامي.", maleRoot),
];

const femaleStructures: AnatomicalStructure[] = [
  structure(femaleRoot, "SYS_FEMALE_REPRODUCTIVE", "Female reproductive system", "الجهاز التناسلي الأنثوي", "A connected pelvic system of ovaries, uterine tubes, uterus, cervix, vagina and external genital structures.", "منظومة حوضية مترابطة من المبيضين والأنبوبين الرحميين والرحم وعنق الرحم والمهبل والأعضاء الخارجية.", "Coordinates oocyte maturation, ovulation, cyclic uterine preparation, fertilization, implantation, pregnancy and birth.", "ينسق نضج البويضات والإباضة والتحضير الدوري للرحم والإخصاب والانغراس والحمل والولادة.", "True pelvis and perineum.", "الحوض الحقيقي والعجان.", undefined, ["ANAT_FEMALE_OVARIES", "ANAT_FEMALE_UTERINE_TUBES", "ANAT_FEMALE_UTERUS", "ANAT_FEMALE_CERVIX", "ANAT_FEMALE_VAGINA", "ANAT_FEMALE_VULVA"]),
  structure("ANAT_FEMALE_OVARIES", "SYS_FEMALE_REPRODUCTIVE", "Ovaries", "المبيضان", "Paired gonads containing follicles at different stages of maturation.", "غدتان تناسليتان تحتويان جريبات في مراحل مختلفة من النضج.", "Follicles mature under FSH; the LH surge triggers ovulation; granulosa and luteal cells produce estrogen and progesterone.", "تنضج الجريبات تحت تأثير FSH وتطلق موجة LH الإباضة وتنتج الخلايا الحبيبية والأصفرية الإستروجين والبروجستيرون.", "Lateral pelvis near the uterine tubes.", "جانبا الحوض قرب الأنبوبين الرحميين.", femaleRoot),
  structure("ANAT_FEMALE_UTERINE_TUBES", "SYS_FEMALE_REPRODUCTIVE", "Uterine tubes", "الأنبوبان الرحميان", "Paired tubes with fimbriae, ampulla, isthmus and intramural portions.", "أنبوبان لهما أهداب وقمع وأمبولة وبرَزخ وجزء جداري.", "Ciliary action and smooth-muscle contractions transport the oocyte; fertilization most often occurs in the ampulla.", "تنقل حركة الأهداب وتقلص العضلات الملساء البويضة ويحدث الإخصاب غالبًا في الأمبولة.", "Superior-lateral uterus extending toward each ovary.", "يمتدان من أعلى جانبي الرحم نحو كل مبيض.", femaleRoot),
  structure("ANAT_FEMALE_UTERUS", "SYS_FEMALE_REPRODUCTIVE", "Uterus", "الرحم", "A thick-walled muscular organ with endometrium, myometrium and perimetrium.", "عضو عضلي سميك الجدار يتكون من بطانة الرحم وعضل الرحم والمصورة.", "The endometrium cycles under ovarian hormones, supports implantation and placenta formation; myometrium contracts in labor.", "تتغير بطانة الرحم دوريًا تحت تأثير هرمونات المبيض وتدعم الانغراس وتكوين المشيمة بينما ينقبض عضل الرحم في الولادة.", "Midline pelvis between bladder and rectum.", "منتصف الحوض بين المثانة والمستقيم.", femaleRoot),
  structure("ANAT_FEMALE_CERVIX", "SYS_FEMALE_REPRODUCTIVE", "Cervix", "عنق الرحم", "The lower cylindrical part of the uterus projecting into the upper vagina.", "الجزء السفلي الأسطواني من الرحم ويبرز في أعلى المهبل.", "Cervical mucus changes through the cycle, facilitating or restricting sperm passage; the cervix remodels and dilates during labor.", "يتغير مخاط عنق الرحم خلال الدورة فيسهل أو يحد مرور النطاف ويعاد تشكيل العنق ويتسع أثناء الولادة.", "Between uterine body and vagina.", "بين جسم الرحم والمهبل.", femaleRoot),
  structure("ANAT_FEMALE_VAGINA", "SYS_FEMALE_REPRODUCTIVE", "Vagina", "المهبل", "A distensible fibromuscular canal from cervix to vestibule.", "قناة ليفية عضلية قابلة للتمدد تمتد من عنق الرحم إلى الدهليز.", "Receives semen, provides an outlet for menstrual flow and forms the lower birth canal.", "يستقبل السائل المنوي ويوفر مخرجًا لدم الطمث ويشكل الجزء السفلي من قناة الولادة.", "Between bladder/urethra anteriorly and rectum posteriorly.", "بين المثانة والإحليل أمامًا والمستقيم خلفًا.", femaleRoot),
  structure("ANAT_FEMALE_VULVA", "SYS_FEMALE_REPRODUCTIVE", "External genitalia", "الأعضاء التناسلية الخارجية", "Includes mons pubis, labia, clitoris, vestibule and associated glands.", "تشمل جبل العانة والشفرين والبظر والدهليز والغدد المرتبطة.", "Protects the vestibular openings and contains erectile sensory tissue involved in sexual response.", "تحمي فتحات الدهليز وتحتوي نسيجًا انتصابيًا حسيًا يشارك في الاستجابة الجنسية.", "External perineum.", "العجان الخارجي.", femaleRoot),
];

export const sexSpecificStructures: AnatomicalStructure[] = [
  ...makeBodyStructures("MALE"),
  ...makeBodyStructures("FEMALE"),
  ...maleStructures,
  ...femaleStructures,
];

const animation = (
  id: string,
  systemId: string,
  en: string,
  ar: string,
  structures: string[],
  steps: Array<[string, string, string]>,
): PhysiologyAnimation => ({
  id,
  systemId,
  name: text(en, ar),
  structureIds: structures,
  duration: Math.max(12, steps.length * 4),
  steps: steps.map(([structureId, stepEn, stepAr], index) => ({
    id: `${id}_STEP_${index + 1}`,
    structureId,
    name: text(stepEn, stepAr),
    description: text(stepEn, stepAr),
    order: index,
  })),
});

export const sexSpecificPhysiologyAnimations: PhysiologyAnimation[] = [
  animation("PHYS_MALE_SPERMATOGENESIS", "SYS_MALE_REPRODUCTIVE", "Sperm production and transport", "إنتاج النطاف ونقلها", ["ANAT_MALE_TESTES", "ANAT_MALE_EPIDIDYMIS", "ANAT_MALE_VAS_DEFERENS", "ANAT_MALE_PROSTATE", "ANAT_MALE_URETHRA"], [
    ["ANAT_MALE_TESTES", "Spermatogenesis proceeds in seminiferous tubules under FSH and intratesticular testosterone.", "يحدث تكوين النطاف في الأنيبيبات المنوية تحت تأثير FSH والتستوستيرون داخل الخصية."],
    ["ANAT_MALE_EPIDIDYMIS", "Sperm mature and are stored in the epididymis.", "تنضج النطاف وتُخزن في البربخ."],
    ["ANAT_MALE_VAS_DEFERENS", "Emission moves sperm through the ductus deferens toward the ejaculatory ducts.", "ينقل الانبعاث النطاف عبر الأسهر نحو القنوات القاذفة."],
    ["ANAT_MALE_PROSTATE", "Accessory glands add secretions that form semen.", "تضيف الغدد الملحقة إفرازاتها لتكوين السائل المنوي."],
    ["ANAT_MALE_URETHRA", "Coordinated muscular contractions expel semen through the urethra.", "تدفع تقلصات عضلية منسقة السائل المنوي عبر الإحليل."],
  ]),
  animation("PHYS_MALE_HPG_AXIS", "SYS_MALE_REPRODUCTIVE", "Male hypothalamic-pituitary-gonadal axis", "محور الوطاء والنخامى والخصية", ["ANAT_MALE_TESTES"], [
    ["ANAT_MALE_TESTES", "Pulsatile GnRH drives LH and FSH secretion; LH stimulates testosterone and FSH supports Sertoli-cell spermatogenesis.", "تحفز نبضات GnRH إفراز LH وFSH؛ يحفز LH التستوستيرون ويدعم FSH خلايا سيرتولي وتكوين النطاف."],
    ["ANAT_MALE_TESTES", "Testosterone and inhibin provide negative feedback to the hypothalamus and pituitary.", "يوفر التستوستيرون والإنهيبين تغذية راجعة سلبية للوطاء والنخامى."],
  ]),
  animation("PHYS_FEMALE_OVARIAN_CYCLE", "SYS_FEMALE_REPRODUCTIVE", "Ovarian and menstrual cycle", "الدورة المبيضية والشهرية", ["ANAT_FEMALE_OVARIES", "ANAT_FEMALE_UTERUS", "ANAT_FEMALE_CERVIX"], [
    ["ANAT_FEMALE_OVARIES", "FSH recruits follicles and rising estradiol supports dominant-follicle maturation.", "يجند FSH الجريبات ويدعم ارتفاع الإستراديول نضج الجريب المسيطر."],
    ["ANAT_FEMALE_OVARIES", "Sustained high estradiol produces the LH surge and ovulation.", "يؤدي استمرار ارتفاع الإستراديول إلى موجة LH وحدوث الإباضة."],
    ["ANAT_FEMALE_UTERUS", "Progesterone from the corpus luteum converts the endometrium to a secretory, implantation-ready state.", "يحول البروجستيرون من الجسم الأصفر بطانة الرحم إلى حالة إفرازية مهيأة للانغراس."],
    ["ANAT_FEMALE_UTERUS", "If implantation does not occur, luteal hormone withdrawal triggers menstruation.", "إذا لم يحدث الانغراس يؤدي انخفاض هرمونات الجسم الأصفر إلى حدوث الطمث."],
  ]),
  animation("PHYS_FEMALE_FERTILIZATION", "SYS_FEMALE_REPRODUCTIVE", "Ovulation to implantation", "من الإباضة إلى الانغراس", ["ANAT_FEMALE_OVARIES", "ANAT_FEMALE_UTERINE_TUBES", "ANAT_FEMALE_UTERUS"], [
    ["ANAT_FEMALE_OVARIES", "Ovulation releases the secondary oocyte from the dominant follicle.", "تطلق الإباضة البويضة الثانوية من الجريب المسيطر."],
    ["ANAT_FEMALE_UTERINE_TUBES", "Fimbriae capture the oocyte and fertilization usually occurs in the ampulla.", "تلتقط الأهداب البويضة ويحدث الإخصاب عادة في أمبولة الأنبوب."],
    ["ANAT_FEMALE_UTERINE_TUBES", "The early embryo undergoes cleavage while moving toward the uterine cavity.", "يخضع الجنين المبكر للانقسامات أثناء انتقاله نحو جوف الرحم."],
    ["ANAT_FEMALE_UTERUS", "The blastocyst attaches to and invades a receptive endometrium during implantation.", "تلتصق الكيسة الأريمية ببطانة رحم متقبلة وتغزوها أثناء الانغراس."],
  ]),
  animation("PHYS_MALE_WHOLE_BODY", "SYS_MALE_BODY", "Integrated male-body homeostasis", "التكامل الوظيفي في جسم الرجل", ["ANAT_MALE_BODY"], [
    ["ANAT_MALE_BODY", "The nervous and endocrine systems coordinate organ activity while circulation distributes oxygen, nutrients, hormones and heat.", "ينسق الجهازان العصبي والصماوي نشاط الأعضاء بينما يوزع الدوران الأكسجين والمغذيات والهرمونات والحرارة."],
    ["ANAT_MALE_BODY", "Respiration, digestion, renal filtration, immunity and movement continuously exchange matter and energy with the circulation.", "تتبادل عملية التنفس والهضم والترشيح الكلوي والمناعة والحركة المادة والطاقة باستمرار مع الدوران."],
  ]),
  animation("PHYS_FEMALE_WHOLE_BODY", "SYS_FEMALE_BODY", "Integrated female-body homeostasis", "التكامل الوظيفي في جسم المرأة", ["ANAT_FEMALE_BODY"], [
    ["ANAT_FEMALE_BODY", "The nervous, endocrine and cardiovascular systems coordinate whole-body function across all organs.", "تنسق الأجهزة العصبية والصماوية والدورية وظيفة الجسم كاملة عبر جميع الأعضاء."],
    ["ANAT_FEMALE_BODY", "Ovarian hormones interact with bone, brain, cardiovascular tissue, breast and uterus as part of whole-body physiology.", "تتفاعل هرمونات المبيض مع العظم والدماغ والأنسجة القلبية الوعائية والثدي والرحم ضمن فسيولوجيا الجسم الكاملة."],
  ]),
];
