import type { Disease, DiseaseStage, LocalizedText } from "@/src/types/medical";

function createStages(
  early: LocalizedText,
  moderate: LocalizedText,
  advanced: LocalizedText,
  color: string,
): DiseaseStage[] {
  return [
    {
      id: "healthy",
      order: 0,
      name: { en: "Healthy", ar: "سليم" },
      description: { en: "Preserved normal structure and function.", ar: "بنية ووظيفة طبيعيتان محفوظتان." },
    },
    {
      id: "early",
      order: 1,
      name: { en: "Early", ar: "مبكر" },
      description: early,
      visualState: { materialPreset: "early-disease", color },
    },
    {
      id: "moderate",
      order: 2,
      name: { en: "Moderate", ar: "متوسط" },
      description: moderate,
      visualState: { materialPreset: "moderate-disease", color },
    },
    {
      id: "advanced",
      order: 3,
      name: { en: "Advanced", ar: "متقدم" },
      description: advanced,
      visualState: { materialPreset: "advanced-disease", morphTarget: "diseaseSeverity", color },
    },
  ];
}

export const heartDiseases: Disease[] = [
  {
    id: "DIS_ATHEROSCLEROSIS",
    name: { en: "Atherosclerosis", ar: "تصلب الشرايين" },
    summary: {
      en: "A chronic arterial wall process in which lipid-rich inflammatory plaques narrow the vessel lumen.",
      ar: "عملية مزمنة في جدار الشرايين تتشكل فيها لويحات التهابية غنية بالشحوم فتضيق لمعة الوعاء.",
    },
    etiology: {
      en: "Associated with dyslipidemia, elevated blood pressure, smoking, diabetes, and age.",
      ar: "يرتبط باضطراب شحوم الدم وارتفاع الضغط والتدخين والسكري والتقدم في العمر.",
    },
    pathogenesis: {
      en: "Endothelial dysfunction permits lipid entry, inflammatory cell recruitment, and fibrous plaque formation.",
      ar: "يسمح خلل البطانة بدخول الشحوم واستقدام الخلايا الالتهابية وتشكّل اللويحة الليفية.",
    },
    morphology: {
      en: "Raised intimal plaques may contain a lipid core, fibrous cap, calcification, and superimposed thrombus.",
      ar: "قد تحتوي اللويحات المرتفعة في الطبقة الباطنة على لب شحمي وغطاء ليفي وتكلس وخثرة إضافية.",
    },
    functionalEffects: {
      en: "Progressive luminal narrowing can reduce coronary perfusion and increase the risk of acute thrombosis.",
      ar: "قد ينقص التضيق التدريجي للمعة تروية الشرايين التاجية ويرفع خطر الخثار الحاد.",
    },
    affectedStructureIds: ["ANAT_HEART_CORONARY", "ANAT_HEART_AORTA"],
    stages: createStages(
      {
        en: "Small lipid deposits develop in the arterial intima.",
        ar: "تظهر ترسبات شحمية صغيرة في بطانة الشريان.",
      },
      {
        en: "A growing plaque narrows the lumen and impairs flow reserve.",
        ar: "تضيق اللويحة المتنامية اللمعة وتضعف احتياطي التدفق.",
      },
      {
        en: "A complex plaque may critically obstruct flow or rupture.",
        ar: "قد تعيق اللويحة المعقدة التدفق بشدة أو تتعرض للتمزق.",
      },
      "#dfa66a",
    ),
    referenceIds: ["REF_ROBBINS_COTRAN", "REF_GRAYS_ANATOMY"],
  },
  {
    id: "DIS_MYOCARDIAL_INFARCTION",
    name: { en: "Myocardial infarction", ar: "احتشاء عضلة القلب" },
    summary: {
      en: "Ischemic death of myocardial tissue following a critical reduction in coronary blood supply.",
      ar: "موت إقفاري لنسيج عضلة القلب يحدث بعد انخفاض حرج في إمداد الدم التاجي.",
    },
    etiology: {
      en: "Most commonly follows acute coronary thrombosis over a disrupted atherosclerotic plaque.",
      ar: "ينجم غالبًا عن خثار تاجي حاد فوق لويحة تصلب شرياني متأذية.",
    },
    pathogenesis: {
      en: "Sustained ischemia disrupts cellular metabolism, causes irreversible myocyte injury, and initiates inflammation.",
      ar: "يعطل الإقفار المستمر الاستقلاب الخلوي ويسبب أذية غير عكوسة للخلايا العضلية ثم يبدأ الالتهاب.",
    },
    morphology: {
      en: "The involved territory evolves from acute coagulative necrosis to granulation tissue and a mature scar.",
      ar: "تتطور المنطقة المصابة من نخر تخثري حاد إلى نسيج حبيبي ثم ندبة ناضجة.",
    },
    functionalEffects: {
      en: "Regional contractile failure can reduce cardiac output and predispose to arrhythmia.",
      ar: "قد ينقص فشل الانقباض الموضعي النتاج القلبي ويهيئ لاضطرابات النظم.",
    },
    affectedStructureIds: ["ANAT_HEART_LV", "ANAT_HEART_RV", "ANAT_HEART_CORONARY"],
    stages: createStages(
      { en: "Perfusion falls and reversible ischemia begins.", ar: "تنخفض التروية ويبدأ إقفار قابل للعكس." },
      {
        en: "Myocardial injury spreads within the affected vascular territory.",
        ar: "تمتد أذية العضلة القلبية ضمن منطقة الوعاء المصاب.",
      },
      {
        en: "Irreversible necrosis and impaired regional contraction become established.",
        ar: "يترسخ النخر غير العكوس وضعف الانقباض الموضعي.",
      },
      "#a988c1",
    ),
    referenceIds: ["REF_ROBBINS_COTRAN", "REF_GUYTON_HALL"],
  },
  {
    id: "DIS_AORTIC_STENOSIS",
    name: { en: "Aortic stenosis", ar: "تضيق الصمام الأبهري" },
    summary: {
      en: "Narrowing of the aortic valve opening that impedes left ventricular outflow.",
      ar: "تضيق في فتحة الصمام الأبهري يعيق خروج الدم من البطين الأيسر.",
    },
    etiology: {
      en: "Often associated with progressive valvular calcification or congenital bicuspid valve anatomy.",
      ar: "يرتبط غالبًا بالتكلس الصمامي التدريجي أو بوجود صمام أبهري خلقي ثنائي الشرفات.",
    },
    pathogenesis: {
      en: "Leaflet fibrosis and calcification restrict cusp excursion, increasing the systolic pressure gradient.",
      ar: "يحد تليف الشرفات وتكلسها من حركتها ويرفع فرق الضغط الانقباضي عبر الصمام.",
    },
    morphology: {
      en: "Thickened, calcified cusps surround a progressively reduced valvular orifice.",
      ar: "تحيط شرفات سميكة ومتكلسة بفتحة صمامية تتناقص تدريجيًا.",
    },
    functionalEffects: {
      en: "Pressure overload can provoke left ventricular hypertrophy and reduced exercise tolerance.",
      ar: "قد يسبب الحمل الضغطي تضخم البطين الأيسر وتراجع تحمل الجهد.",
    },
    affectedStructureIds: ["ANAT_HEART_AORTIC_VALVE", "ANAT_HEART_LV", "ANAT_HEART_AORTA"],
    stages: createStages(
      {
        en: "Mild cusp thickening appears without substantial obstruction.",
        ar: "تظهر سماكة خفيفة في الشرفات من دون انسداد مهم.",
      },
      {
        en: "Reduced leaflet mobility creates a measurable outflow gradient.",
        ar: "تؤدي محدودية حركة الشرفات إلى ظهور فرق ضغط واضح في مجرى الخروج.",
      },
      {
        en: "Severe narrowing produces major left ventricular pressure overload.",
        ar: "يسبب التضيق الشديد حملاً ضغطيًا كبيرًا على البطين الأيسر.",
      },
      "#d9bc79",
    ),
    referenceIds: ["REF_ROBBINS_COTRAN", "REF_GUYTON_HALL"],
  },
  {
    id: "DIS_CARDIAC_HYPERTROPHY",
    name: { en: "Cardiac hypertrophy", ar: "تضخم عضلة القلب" },
    summary: {
      en: "Adaptive or pathological enlargement of cardiomyocytes resulting in increased myocardial mass.",
      ar: "تضخم تكيفي أو مرضي في الخلايا العضلية القلبية يؤدي إلى زيادة كتلة العضلة القلبية.",
    },
    etiology: {
      en: "Can arise from chronic pressure overload, valvular disease, inherited conditions, or sustained training.",
      ar: "قد ينشأ عن الحمل الضغطي المزمن أو أمراض الصمامات أو الحالات الوراثية أو التدريب المستمر.",
    },
    pathogenesis: {
      en: "Mechanical and neurohormonal signals stimulate myocyte growth and remodeling of the extracellular matrix.",
      ar: "تحرض الإشارات الميكانيكية والعصبية الهرمونية نمو الخلايا العضلية وإعادة تشكيل المصفوفة خارج الخلوية.",
    },
    morphology: {
      en: "Ventricular walls thicken, and the chamber geometry can remodel according to the dominant load.",
      ar: "تزداد سماكة جدران البطين وقد يعاد تشكيل هندسة الحجرة بحسب نوع الحمل المسيطر.",
    },
    functionalEffects: {
      en: "Increased stiffness may impair diastolic filling and raise myocardial oxygen demand.",
      ar: "قد تضعف زيادة الصلابة الامتلاء الانبساطي وترفع حاجة العضلة القلبية إلى الأكسجين.",
    },
    affectedStructureIds: ["ANAT_HEART_LV", "ANAT_HEART_SEPTUM"],
    stages: createStages(
      {
        en: "Subtle myocyte enlargement begins as an adaptive response.",
        ar: "يبدأ تضخم بسيط في الخلايا العضلية بوصفه استجابة تكيفية.",
      },
      {
        en: "Ventricular wall thickening becomes visible and compliance decreases.",
        ar: "تصبح سماكة جدار البطين واضحة وتتراجع المطاوعة.",
      },
      {
        en: "Marked remodeling may compromise filling and increase electrical instability.",
        ar: "قد يضعف تبدل البنية الشديد الامتلاء ويرفع احتمال عدم الاستقرار الكهربائي.",
      },
      "#dd8471",
    ),
    referenceIds: ["REF_ROBBINS_COTRAN", "REF_GUYTON_HALL"],
  },
];
