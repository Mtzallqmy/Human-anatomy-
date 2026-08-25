import type { Disease, LocalizedText } from "@/src/types/medical";

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

type DiseaseSeed = {
  id: string;
  en: string;
  ar: string;
  structureId: string;
  summary: LocalizedText;
  etiology: LocalizedText;
  pathogenesis: LocalizedText;
  morphology: LocalizedText;
  functionalEffects: LocalizedText;
};

const seeds: DiseaseSeed[] = [
  {
    id: "DIS_SKELETAL_OSTEOPOROSIS",
    en: "Osteoporosis",
    ar: "هشاشة العظام",
    structureId: "ANAT_TRABECULAR_BONE",
    summary: text("Reduced bone strength from loss of bone mass and microarchitectural integrity.", "انخفاض قوة العظم نتيجة نقص الكتلة العظمية واضطراب البنية المجهرية."),
    etiology: text("Ageing, estrogen deficiency, glucocorticoids, low calcium/vitamin D and secondary metabolic causes.", "التقدم في العمر ونقص الإستروجين والستيرويدات ونقص الكالسيوم/فيتامين د والأسباب الاستقلابية الثانوية."),
    pathogenesis: text("Bone resorption exceeds formation, progressively thinning cortical and trabecular structures.", "يتجاوز ارتشاف العظم عملية البناء فتترقق البنى القشرية والترابيقية تدريجيًا."),
    morphology: text("Trabecular thinning, perforation and increased cortical porosity.", "ترقق الترابيق وانقطاعها وزيادة مسامية العظم القشري."),
    functionalEffects: text("Fragility fractures, vertebral compression and loss of load-bearing reserve.", "كسور الهشاشة وانضغاط الفقرات ونقص احتياطي تحمل الأحمال."),
  },
  {
    id: "DIS_SKELETAL_OSTEOMYELITIS",
    en: "Osteomyelitis",
    ar: "التهاب العظم والنقي",
    structureId: "ANAT_BONE_MARROW",
    summary: text("Infection and inflammation involving bone and marrow.", "عدوى والتهاب يصيبان العظم والنخاع."),
    etiology: text("Most often bacterial spread through blood, contiguous tissue or direct inoculation.", "غالبًا انتشار جرثومي عبر الدم أو الأنسجة المجاورة أو التلقيح المباشر."),
    pathogenesis: text("Inflammation raises intraosseous pressure, compromises perfusion and can produce necrotic bone.", "يرفع الالتهاب الضغط داخل العظم ويضعف التروية وقد يؤدي إلى نخر عظمي."),
    morphology: text("Marrow inflammation with cortical destruction; chronic disease may form sequestra and involucrum.", "التهاب نخاع مع تخرب قشري وقد تتشكل قطع عظمية متموتة وغلاف عظمي في المرض المزمن."),
    functionalEffects: text("Pain, impaired structural integrity and systemic infection risk.", "ألم وضعف السلامة البنيوية وخطر العدوى الجهازية."),
  },
  {
    id: "DIS_MUSCULAR_DYSTROPHY",
    en: "Muscular dystrophy",
    ar: "الحثل العضلي",
    structureId: "ANAT_MUSCLE_FIBER",
    summary: text("Inherited disorders causing progressive skeletal-muscle fiber degeneration and weakness.", "اضطرابات وراثية تسبب تنكسًا تدريجيًا لألياف العضلات الهيكلية وضعفًا عضليًا."),
    etiology: text("Pathogenic variants affecting structural or membrane-associated muscle proteins.", "طفرات ممرضة تؤثر في بروتينات بنيوية أو مرتبطة بغشاء العضلة."),
    pathogenesis: text("Membrane instability and repeated injury drive fiber necrosis, regeneration failure and fibrofatty replacement.", "عدم استقرار الغشاء والأذية المتكررة يؤديان إلى نخر الألياف وفشل التجدد والاستبدال الليفي الدهني."),
    morphology: text("Fiber-size variation, necrosis, regeneration and progressive fibrosis/fat infiltration.", "تفاوت حجم الألياف ونخرها وتجددها مع تليف وارتشاح دهني تدريجي."),
    functionalEffects: text("Progressive weakness, reduced mobility and—depending on subtype—respiratory or cardiac involvement.", "ضعف تدريجي ونقص الحركة وقد تصاب العضلات التنفسية أو القلب بحسب النوع."),
  },
  {
    id: "DIS_INFLAMMATORY_MYOPATHY",
    en: "Inflammatory myopathy",
    ar: "الاعتلال العضلي الالتهابي",
    structureId: "ANAT_SKELETAL_MUSCLE",
    summary: text("Immune-mediated muscle inflammation causing predominantly proximal weakness.", "التهاب عضلي مناعي يسبب ضعفًا يغلب في العضلات القريبة."),
    etiology: text("Autoimmune mechanisms with variable genetic and environmental associations.", "آليات مناعية ذاتية مع ارتباطات وراثية وبيئية متفاوتة."),
    pathogenesis: text("Immune-cell and antibody-mediated injury disrupts fibers and muscle energy/function.", "تؤذي الخلايا المناعية والأجسام المضادة الألياف وتخل بوظيفة العضلة واستقلابها."),
    morphology: text("Inflammatory infiltrates with fiber necrosis and regeneration in characteristic patterns.", "ارتشاحات التهابية مع نخر وتجدد للألياف بأنماط مميزة."),
    functionalEffects: text("Weakness, exercise limitation, dysphagia in some phenotypes and elevated muscle enzymes.", "ضعف وعدم تحمل الجهد وقد يحدث عسر بلع وارتفاع إنزيمات العضلات في بعض الأنماط."),
  },
  {
    id: "DIS_HYPOTHYROIDISM",
    en: "Hypothyroidism",
    ar: "قصور الغدة الدرقية",
    structureId: "ANAT_THYROID",
    summary: text("Insufficient thyroid-hormone action slows metabolic and organ-system activity.", "نقص تأثير هرمونات الدرق يبطئ الاستقلاب ونشاط أجهزة الجسم."),
    etiology: text("Autoimmune thyroiditis, iodine imbalance, treatment effects, medications or pituitary/hypothalamic disease.", "التهاب الدرق المناعي واضطراب اليود وتأثيرات العلاج أو الأدوية أو أمراض النخامى والوطاء."),
    pathogenesis: text("Reduced T4/T3 signaling lowers metabolic gene expression and alters cardiovascular, neurologic and gastrointestinal function.", "يخفض نقص إشارات T4/T3 التعبير الجيني الاستقلابي ويغير وظائف القلب والجهاز العصبي والهضمي."),
    morphology: text("Morphology varies by cause, from lymphocytic thyroiditis and atrophy to goitrous change.", "تختلف البنية حسب السبب من التهاب لمفاوي وضمور إلى تضخم درقي."),
    functionalEffects: text("Fatigue, cold intolerance, bradycardia, constipation and cognitive slowing; severe disease can decompensate.", "تعب وعدم تحمل البرد وبطء القلب والإمساك وبطء الإدراك وقد يتفاقم القصور الشديد."),
  },
  {
    id: "DIS_HYPERTHYROIDISM",
    en: "Hyperthyroidism",
    ar: "فرط نشاط الغدة الدرقية",
    structureId: "ANAT_THYROID",
    summary: text("Excess thyroid-hormone production increases metabolic and adrenergic activity.", "زيادة إنتاج هرمونات الدرق ترفع النشاط الاستقلابي والأدرينالي."),
    etiology: text("Graves disease, toxic nodules, thyroiditis and exogenous hormone are common mechanisms.", "داء غريفز والعقد السامة والتهاب الدرق والهرمون الخارجي من الآليات الشائعة."),
    pathogenesis: text("Excess T3/T4 amplifies metabolic turnover and tissue sensitivity to catecholamines.", "زيادة T3/T4 ترفع الدوران الاستقلابي وحساسية الأنسجة للكاتيكولامينات."),
    morphology: text("Diffuse hyperplasia in Graves disease or nodular/follicular changes in autonomous disease.", "فرط تنسج منتشر في غريفز أو تغيرات عقدية وجريبية في النشاط الذاتي."),
    functionalEffects: text("Tachycardia, heat intolerance, tremor, weight loss and arrhythmia risk.", "تسرع القلب وعدم تحمل الحرارة والرعاش ونقص الوزن وخطر اضطرابات النظم."),
  },
  {
    id: "DIS_DIABETES_MELLITUS",
    en: "Diabetes mellitus",
    ar: "داء السكري",
    structureId: "ANAT_PANCREATIC_ISLETS",
    summary: text("Chronic hyperglycemia caused by inadequate insulin secretion, action or both.", "فرط سكر دم مزمن بسبب قصور إفراز الإنسولين أو عمله أو كليهما."),
    etiology: text("Autoimmune beta-cell loss in type 1; insulin resistance with beta-cell dysfunction in type 2; additional secondary forms exist.", "فقد مناعي لخلايا بيتا في النوع الأول ومقاومة إنسولين مع خلل خلايا بيتا في النوع الثاني مع أشكال ثانوية أخرى."),
    pathogenesis: text("Deficient insulin signaling alters glucose, lipid and protein metabolism and promotes vascular injury over time.", "نقص إشارات الإنسولين يغير استقلاب الغلوكوز والدهون والبروتين ويعزز الأذية الوعائية بمرور الوقت."),
    morphology: text("Islet changes depend on type and duration; chronic complications affect small and large vessels and multiple organs.", "تختلف تغيرات الجزر بحسب النوع والمدة وتؤثر المضاعفات المزمنة في الأوعية الصغيرة والكبيرة وأعضاء متعددة."),
    functionalEffects: text("Hyperglycemia, osmotic symptoms and long-term renal, retinal, neural and cardiovascular complications.", "فرط السكر وأعراض أسموزية ومضاعفات كلوية وشبكية وعصبية وقلبية وعائية طويلة الأمد."),
  },
  {
    id: "DIS_LYMPHEDEMA",
    en: "Lymphedema",
    ar: "الوذمة اللمفية",
    structureId: "ANAT_LYMPH_VESSELS",
    summary: text("Protein-rich interstitial fluid accumulates when lymphatic transport is impaired.", "يتراكم سائل خلالي غني بالبروتين عندما يضعف النقل اللمفاوي."),
    etiology: text("Primary developmental abnormalities or secondary obstruction after surgery, radiation, infection, trauma or malignancy.", "تشوهات نمائية أولية أو انسداد ثانوي بعد الجراحة أو الأشعة أو العدوى أو الرض أو الأورام."),
    pathogenesis: text("Reduced lymph clearance produces edema, chronic inflammation, adipose deposition and fibrosis.", "نقص تصريف اللمف يسبب وذمة والتهابًا مزمنًا وترسبًا دهنيًا وتليفًا."),
    morphology: text("Persistent tissue swelling with dermal and subcutaneous thickening in chronic disease.", "تورم نسيجي مستمر مع تثخن الجلد وتحت الجلد في الحالات المزمنة."),
    functionalEffects: text("Limb heaviness, reduced mobility, skin change and increased cellulitis risk.", "ثقل الطرف ونقص الحركة وتغير الجلد وازدياد خطر التهاب النسيج الخلوي."),
  },
  {
    id: "DIS_LYMPHOMA",
    en: "Lymphoma",
    ar: "اللمفوما",
    structureId: "ANAT_LYMPH_NODES",
    summary: text("Clonal lymphoid malignancies that may involve nodes, spleen, marrow or extranodal tissues.", "أورام لمفاوية خبيثة نسيلية قد تصيب العقد والطحال والنخاع أو الأنسجة خارج العقد."),
    etiology: text("Diverse genetic lesions and immune/environmental factors depending on lymphoma subtype.", "آفات وراثية متنوعة وعوامل مناعية وبيئية تختلف بحسب نوع اللمفوما."),
    pathogenesis: text("Abnormal lymphocyte clones escape normal growth and death controls and remodel immune tissue.", "تفلت نسائل لمفاوية شاذة من ضوابط النمو والموت الطبيعية وتعيد تشكيل النسيج المناعي."),
    morphology: text("Nodal architecture is partially or completely replaced by atypical lymphoid populations.", "تُستبدل بنية العقدة جزئيًا أو كليًا بتجمعات لمفاوية شاذة."),
    functionalEffects: text("Lymphadenopathy, constitutional symptoms, cytopenias or organ dysfunction depending on extent.", "تضخم عقد وأعراض عامة ونقص خلايا الدم أو خلل أعضاء بحسب الانتشار."),
  },
  {
    id: "DIS_ENDOMETRIOSIS",
    en: "Endometriosis",
    ar: "الانتباذ البطاني الرحمي",
    structureId: "ANAT_UTERUS",
    summary: text("Endometrium-like glands and stroma occur outside the uterine cavity and respond to hormonal cycles.", "وجود غدد وسدى شبيهين ببطانة الرحم خارج جوف الرحم ويتأثران بالدورات الهرمونية."),
    etiology: text("Multifactorial mechanisms include retrograde menstruation, implantation, immune factors and genetic susceptibility.", "آليات متعددة تشمل الحيض الراجع والانغراس والعوامل المناعية والاستعداد الوراثي."),
    pathogenesis: text("Cyclic inflammation and bleeding promote fibrosis, adhesions and altered pelvic anatomy.", "الالتهاب والنزف الدوريان يعززان التليف والالتصاقات وتغير تشريح الحوض."),
    morphology: text("Ectopic endometrial-type glands/stroma with hemorrhage, hemosiderin and fibrosis.", "غدد وسدى بطانة رحم هاجرة مع نزف وهيموسيديرين وتليف."),
    functionalEffects: text("Pelvic pain, dysmenorrhea, dyspareunia and reduced fertility in some patients.", "ألم حوضي وعسر طمث وألم بالجماع وانخفاض الخصوبة لدى بعض الحالات."),
  },
  {
    id: "DIS_POLYCYSTIC_OVARY",
    en: "Polycystic ovary syndrome",
    ar: "متلازمة تكيس المبايض",
    structureId: "ANAT_OVARIES",
    summary: text("A common endocrine-reproductive syndrome with ovulatory dysfunction and androgen excess.", "متلازمة صماوية تناسلية شائعة تترافق بخلل الإباضة وزيادة الأندروجينات."),
    etiology: text("Complex genetic and metabolic susceptibility with frequent insulin resistance.", "استعداد وراثي واستقلابي معقد وغالبًا مقاومة للإنسولين."),
    pathogenesis: text("Altered gonadotropin signaling, ovarian androgen production and insulin action disrupt follicular maturation.", "تغير إشارات موجهات الغدد وإنتاج الأندروجينات المبيضية وعمل الإنسولين يخل بنضج الجريبات."),
    morphology: text("Multiple arrested follicles and increased ovarian stromal volume may be present.", "قد توجد جريبات متعددة متوقفة مع زيادة حجم السدى المبيضي."),
    functionalEffects: text("Irregular cycles, infertility, hyperandrogenic features and increased metabolic risk.", "دورات غير منتظمة وعقم ومظاهر فرط أندروجين وزيادة المخاطر الاستقلابية."),
  },
  {
    id: "DIS_BENIGN_PROSTATIC_HYPERPLASIA",
    en: "Benign prostatic hyperplasia",
    ar: "فرط تنسج البروستاتا الحميد",
    structureId: "ANAT_PROSTATE",
    summary: text("Non-malignant stromal and glandular proliferation can narrow the prostatic urethra.", "تكاثر حميد للسدى والغدد قد يضيّق الإحليل البروستاتي."),
    etiology: text("Age-related androgen signaling, especially dihydrotestosterone, contributes to nodular hyperplasia.", "تسهم إشارات الأندروجين المرتبطة بالعمر وخاصة ثنائي هيدروتستوستيرون في فرط التنسج العقدي."),
    pathogenesis: text("Transition-zone nodules increase outlet resistance and trigger compensatory bladder changes.", "تزيد عقد المنطقة الانتقالية مقاومة مخرج البول وتحفز تغيرات تعويضية في المثانة."),
    morphology: text("Nodular glandular and fibromuscular hyperplasia centered around the urethra.", "فرط تنسج عقدي غدي وليفي عضلي يتمركز حول الإحليل."),
    functionalEffects: text("Hesitancy, weak stream, incomplete emptying and urinary retention in advanced obstruction.", "تردد وضعف جريان وعدم إفراغ كامل وقد يحدث احتباس بولي في الانسداد المتقدم."),
  },
  {
    id: "DIS_PSORIASIS",
    en: "Psoriasis",
    ar: "الصدفية",
    structureId: "ANAT_EPIDERMIS",
    summary: text("Immune-mediated inflammatory skin disease characterized by accelerated epidermal turnover.", "مرض جلدي التهابي مناعي يتميز بتسارع دوران خلايا البشرة."),
    etiology: text("Genetic susceptibility interacts with immune dysregulation and environmental triggers.", "يتفاعل الاستعداد الوراثي مع خلل المناعة ومحفزات بيئية."),
    pathogenesis: text("T-cell and cytokine networks drive keratinocyte proliferation and sustained cutaneous inflammation.", "شبكات الخلايا التائية والسيتوكينات تحفز تكاثر الخلايا الكيراتينية والتهاب الجلد المستمر."),
    morphology: text("Well-demarcated plaques with epidermal hyperplasia, parakeratosis and superficial inflammation.", "لويحات محددة جيدًا مع فرط تنسج البشرة والتقرن غير الكامل والتهاب سطحي."),
    functionalEffects: text("Scaling plaques, itch or pain and possible systemic/arthritic associations.", "لويحات متقشرة وحكة أو ألم مع احتمال ارتباطات جهازية أو مفصلية."),
  },
  {
    id: "DIS_MELANOMA",
    en: "Melanoma",
    ar: "الميلانوما",
    structureId: "ANAT_EPIDERMIS",
    summary: text("Malignant neoplasm of melanocytes with metastatic potential.", "ورم خبيث من الخلايا الميلانينية ذو قابلية للانتشار."),
    etiology: text("Ultraviolet exposure and acquired genetic alterations interact with inherited susceptibility.", "يتفاعل التعرض للأشعة فوق البنفسجية والطفرات المكتسبة مع الاستعداد الوراثي."),
    pathogenesis: text("Oncogenic signaling permits atypical melanocytes to proliferate, invade the dermis and potentially disseminate.", "تسمح الإشارات الورمية للخلايا الميلانينية الشاذة بالتكاثر وغزو الأدمة وإمكان الانتشار."),
    morphology: text("Asymmetric atypical melanocytic proliferation with progressive radial and/or vertical growth.", "تكاثر ميلانيني شاذ غير متناظر مع نمو شعاعي و/أو عمودي تدريجي."),
    functionalEffects: text("Local tissue invasion and metastatic disease risk increase with adverse pathologic features.", "يزداد خطر الغزو الموضعي والانتشار مع السمات المرضية غير المواتية."),
  },
];

const stageNames = [
  text("Early change", "تغير مبكر"),
  text("Established disease", "مرض متثبت"),
  text("Advanced disease", "مرض متقدم"),
];

export const comprehensiveDiseases: Disease[] = seeds.map((seed) => ({
  id: seed.id,
  name: text(seed.en, seed.ar),
  summary: seed.summary,
  etiology: seed.etiology,
  pathogenesis: seed.pathogenesis,
  morphology: seed.morphology,
  functionalEffects: seed.functionalEffects,
  affectedStructureIds: [seed.structureId],
  stages: stageNames.map((name, index) => ({
    id: `${seed.id}_STAGE_${index + 1}`,
    order: index + 1,
    name,
    description: text(
      index === 0
        ? "Conceptual early structural or functional change."
        : index === 1
          ? "Established disease with recognizable structural-functional effects."
          : "Advanced illustrative state emphasizing clinically important consequences.",
      index === 0
        ? "تغير بنيوي أو وظيفي مبكر بصورة مفاهيمية."
        : index === 1
          ? "مرض متثبت مع آثار بنيوية ووظيفية قابلة للتعرف."
          : "حالة توضيحية متقدمة تبرز النتائج المهمة سريريًا.",
    ),
    visualState: {
      color: index === 0 ? "#d9a46d" : index === 1 ? "#cf766c" : "#9e4e59",
      scaleMultiplier: index * 0.025,
    },
  })),
  referenceIds: ["REF_ROBBINS_COTRAN", "REF_GUYTON_HALL", "REF_GRAYS_ANATOMY"],
  visualizationType: "material",
  visualizationAccuracy: "illustrative",
}));
