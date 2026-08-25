import type { SystemLearningProfile } from "@/src/data/anatomy/comprehensiveSystems";
import type { LocalizedText } from "@/src/types/medical";

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

export const sexSpecificLearningProfiles: SystemLearningProfile[] = [
  {
    systemId: "SYS_MALE_REPRODUCTIVE",
    overview: text(
      "The male reproductive system combines endocrine gonadal function with continuous sperm production, maturation, transport, accessory-gland secretion, erection and ejaculation.",
      "يجمع الجهاز التناسلي الذكري بين الوظيفة الصماء للغدد التناسلية والإنتاج المستمر للنطاف ونضجها ونقلها وإفرازات الغدد الملحقة والانتصاب والقذف.",
    ),
    anatomyFocus: [
      text("Testicular lobules, seminiferous tubules and rete testis", "فصيصات الخصية والأنيبيبات المنوية وشبكة الخصية"),
      text("Epididymis, ductus deferens and ejaculatory ducts", "البربخ والأسهر والقنوات القاذفة"),
      text("Seminal vesicles, prostate and bulbourethral glands", "الحويصلات المنوية والبروستاتا والغدد البصلية الإحليلية"),
      text("Penile erectile tissues, urethra and neurovascular supply", "الأنسجة الانتصابية للقضيب والإحليل والتروية والتعصيب"),
    ],
    physiologyFocus: [
      text("Spermatogenesis and Sertoli-cell support", "تكوين النطاف ودعم خلايا سيرتولي"),
      text("Hypothalamic-pituitary-gonadal hormonal control", "التحكم الهرموني عبر محور الوطاء والنخامى والخصية"),
      text("Sperm maturation, emission and ejaculation", "نضج النطاف والانبعاث والقذف"),
      text("Erection and autonomic vascular control", "الانتصاب والتحكم الوعائي الذاتي"),
    ],
    mechanisms: [
      { title: text("Spermatogenesis", "تكوين النطاف"), description: text("Spermatogonia divide and differentiate through meiotic stages into spermatids, which remodel into spermatozoa within Sertoli-cell-supported seminiferous epithelium.", "تنقسم الخلايا المنوية الأم وتتمايز عبر مراحل الانقسام المنصف إلى طلائع نطفية تتحول إلى نطاف ضمن ظهارة منوية تدعمها خلايا سيرتولي.") },
      { title: text("Testosterone production", "إنتاج التستوستيرون"), description: text("LH stimulates Leydig-cell steroidogenesis; testosterone acts locally and systemically and participates in negative feedback.", "يحفز LH تصنيع الستيرويدات في خلايا لايديغ ويعمل التستوستيرون موضعيًا وجهازيًا ويسهم في التغذية الراجعة السلبية.") },
      { title: text("Erection and ejaculation", "الانتصاب والقذف"), description: text("Parasympathetic nitric-oxide signaling increases cavernosal blood filling; sympathetic and somatic motor pathways coordinate emission and rhythmic expulsion.", "تزيد إشارات أكسيد النتريك نظيرة الودية امتلاء الأجسام الكهفية بالدم بينما تنسق المسارات الودية والحركية الجسدية الانبعاث والطرد الإيقاعي.") },
    ],
    regulation: [
      text("Pulsatile GnRH regulates pituitary LH and FSH release.", "تنظم نبضات GnRH إفراز LH وFSH من النخامى."),
      text("Inhibin B and testosterone provide feedback regulation of spermatogenic and endocrine activity.", "يوفر الإنهيبين B والتستوستيرون تغذية راجعة لتنظيم النشاط التناسلي والصماوي."),
    ],
    keyValues: [
      { label: text("Spermatogenic cycle", "دورة تكوين النطاف"), value: "≈ 64–74 days", note: text("Followed by additional epididymal maturation and transport time.", "يتبعها وقت إضافي للنضج والنقل في البربخ.") },
      { label: text("Testicular temperature", "حرارة الخصية"), value: "≈ 2–4°C below core", note: text("Scrotal thermoregulation supports normal spermatogenesis.", "يدعم تنظيم حرارة الصفن تكوين النطاف الطبيعي.") },
    ],
    clinicalLinks: [
      text("Obstruction, varicocele, endocrine disorders and primary testicular dysfunction can impair fertility through different mechanisms.", "يمكن للانسداد ودوالي الخصية والاضطرابات الصماء والخلل الأولي في الخصية إضعاف الخصوبة بآليات مختلفة."),
      text("Benign prostatic enlargement can affect urinary flow because the prostate surrounds the proximal urethra.", "قد يؤثر تضخم البروستاتا الحميد في جريان البول لأن البروستاتا تحيط بالإحليل القريب."),
    ],
  },
  {
    systemId: "SYS_FEMALE_REPRODUCTIVE",
    overview: text(
      "The female reproductive system coordinates follicular development, ovulation, cyclic endometrial preparation, fertilization, implantation, pregnancy and birth through tightly coupled endocrine and anatomical processes.",
      "ينسق الجهاز التناسلي الأنثوي تطور الجريبات والإباضة والتحضير الدوري لبطانة الرحم والإخصاب والانغراس والحمل والولادة عبر عمليات تشريحية وهرمونية مترابطة بدقة.",
    ),
    anatomyFocus: [
      text("Ovarian cortex, follicles and supporting stroma", "قشرة المبيض والجريبات والسدى الداعم"),
      text("Fimbriae, ampulla and isthmus of the uterine tubes", "أهداب وأمبولة وبرَزخ الأنبوبين الرحميين"),
      text("Endometrium, myometrium, cervix and uterine supports", "بطانة الرحم وعضل الرحم وعنق الرحم ودعاماته"),
      text("Vagina, vulva, pelvic floor and regional neurovascular relationships", "المهبل والفرج وقاع الحوض والعلاقات العصبية الوعائية الموضعية"),
    ],
    physiologyFocus: [
      text("Follicular recruitment and ovulation", "تجنيد الجريبات والإباضة"),
      text("Menstrual-cycle endocrine feedback", "التغذية الراجعة الهرمونية للدورة الشهرية"),
      text("Tubal transport and fertilization", "النقل الأنبوبي والإخصاب"),
      text("Implantation, placentation and uterine adaptation", "الانغراس وتكوين المشيمة وتكيف الرحم"),
    ],
    mechanisms: [
      { title: text("Follicular phase", "الطور الجريبي"), description: text("FSH supports follicular growth while granulosa-cell estradiol rises; selection of a dominant follicle progressively suppresses FSH.", "يدعم FSH نمو الجريبات بينما يرتفع الإستراديول من الخلايا الحبيبية ويؤدي اختيار الجريب المسيطر تدريجيًا إلى خفض FSH.") },
      { title: text("Ovulation", "الإباضة"), description: text("Sustained high estradiol reverses feedback to produce the mid-cycle LH surge, triggering follicular rupture and oocyte release.", "يحول الارتفاع المستمر للإستراديول التغذية الراجعة إلى إيجابية فينتج اندفاع LH في منتصف الدورة ويؤدي إلى تمزق الجريب وإطلاق البويضة.") },
      { title: text("Luteal and endometrial phase", "الطور الأصفري وبطانة الرحم"), description: text("Progesterone from the corpus luteum transforms proliferative endometrium into a secretory implantation-ready tissue; hormone withdrawal causes menstruation if pregnancy does not occur.", "يحول البروجستيرون من الجسم الأصفر بطانة الرحم التكاثرية إلى نسيج إفرازي مهيأ للانغراس ويؤدي انخفاض الهرمونات إلى الطمث إذا لم يحدث حمل.") },
    ],
    regulation: [
      text("GnRH pulse patterns regulate LH and FSH secretion across the ovarian cycle.", "تنظم أنماط نبض GnRH إفراز LH وFSH عبر الدورة المبيضية."),
      text("Estradiol, progesterone and inhibins produce phase-dependent negative and positive feedback.", "ينتج الإستراديول والبروجستيرون والإنهيبينات تغذية راجعة سلبية وإيجابية بحسب طور الدورة."),
    ],
    keyValues: [
      { label: text("Typical cycle reference", "المرجع المعتاد لمدة الدورة"), value: "≈ 21–35 days", note: text("Normal adult cycles vary; 28 days is a teaching model, not a universal value.", "تختلف دورات البالغات طبيعيًا؛ و28 يومًا نموذج تعليمي وليست قيمة ثابتة للجميع.") },
      { label: text("Fertilization site", "الموقع الأكثر شيوعًا للإخصاب"), value: "Uterine tube ampulla", note: text("The embryo then travels toward the uterine cavity before implantation.", "ثم ينتقل الجنين نحو جوف الرحم قبل الانغراس.") },
    ],
    clinicalLinks: [
      text("Ovulatory dysfunction, tubal disease, endometriosis and uterine abnormalities can affect fertility at different steps.", "يمكن لاضطراب الإباضة ومرض الأنابيب والانتباذ البطاني الرحمي وتشوهات الرحم التأثير في الخصوبة بمراحل مختلفة."),
      text("Pelvic anatomy explains why uterine, bladder and rectal symptoms can overlap in several gynecologic conditions.", "تفسر تشريح الحوض تداخل أعراض الرحم والمثانة والمستقيم في عدد من الحالات النسائية."),
    ],
  },
  {
    systemId: "SYS_MALE_BODY",
    overview: text(
      "A whole-body male atlas for studying where organ systems lie, how they overlap in three dimensions and how circulation, respiration, neural control, endocrine signaling, metabolism, filtration, immunity, movement and male reproductive physiology operate together.",
      "أطلس كامل لجسم الرجل لدراسة مواقع الأجهزة وتراكبها ثلاثي الأبعاد وكيف يعمل الدوران والتنفس والتحكم العصبي والإشارات الهرمونية والاستقلاب والترشيح والمناعة والحركة والفسيولوجيا التناسلية الذكرية معًا.",
    ),
    anatomyFocus: [
      text("Head-to-foot regional orientation and body cavities", "الاتجاه التشريحي من الرأس إلى القدمين وتجاويف الجسم"),
      text("Spatial overlap of skeleton, muscles, vessels, nerves and viscera", "التراكب المكاني للهيكل والعضلات والأوعية والأعصاب والأحشاء"),
      text("Pelvic and perineal relationship of male reproductive organs", "العلاقات الحوضية والعجانية للأعضاء التناسلية الذكرية"),
    ],
    physiologyFocus: [
      text("Oxygen delivery and carbon-dioxide removal", "إيصال الأكسجين والتخلص من ثاني أكسيد الكربون"),
      text("Digestion, absorption and fuel distribution", "الهضم والامتصاص وتوزيع الوقود"),
      text("Renal-fluid, neural, endocrine, immune and thermal homeostasis", "الاتزان الكلوي والعصبي والصماوي والمناعي والحراري"),
      text("Movement, exercise integration and male reproductive endocrine function", "تكامل الحركة والتمارين والوظيفة الصماء التناسلية الذكرية"),
    ],
    mechanisms: [
      { title: text("Integrated transport", "النقل المتكامل"), description: text("The cardiovascular system links lungs, gut, kidneys, endocrine organs, muscles and brain by transporting gases, nutrients, hormones, heat and metabolic products.", "يربط الجهاز الدوري الرئتين والأمعاء والكليتين والغدد والعضلات والدماغ عبر نقل الغازات والمغذيات والهرمونات والحرارة ونواتج الاستقلاب.") },
      { title: text("Homeostatic control", "التحكم في الاتزان الداخلي"), description: text("Neural reflexes and endocrine feedback continuously compare sensed variables with regulated ranges and alter organ output.", "تقارن المنعكسات العصبية والتغذية الراجعة الهرمونية باستمرار المتغيرات المحسوسة بالمجالات المنظمة وتعدل خرج الأعضاء.") },
    ],
    regulation: [
      text("Autonomic, endocrine and renal mechanisms operate on different time scales but converge on the same internal environment.", "تعمل الآليات الذاتية والصماء والكلوية على مقاييس زمنية مختلفة لكنها تتلاقى للحفاظ على البيئة الداخلية نفسها."),
      text("Exercise, meals, sleep, temperature and reproductive state shift organ demands while homeostasis preserves critical variables.", "تغير التمارين والوجبات والنوم والحرارة والحالة التناسلية متطلبات الأعضاء بينما يحافظ الاتزان الداخلي على المتغيرات الحرجة."),
    ],
    keyValues: [
      { label: text("Resting cardiac output", "النتاج القلبي في الراحة"), value: "≈ 5 L/min", note: text("Scales with body size and metabolic demand.", "يتغير مع حجم الجسم والطلب الاستقلابي.") },
      { label: text("Core temperature range", "مجال حرارة الجسم المركزية"), value: "≈ 36.5–37.5°C", note: text("Varies with measurement site, circadian rhythm and activity.", "يتغير بحسب موقع القياس والإيقاع اليومي والنشاط.") },
    ],
    clinicalLinks: [
      text("Whole-body views clarify multisystem effects of shock, endocrine disease, renal failure and systemic inflammation.", "توضح عروض الجسم الكامل التأثيرات متعددة الأجهزة للصدمة وأمراض الغدد والفشل الكلوي والالتهاب الجهازي."),
    ],
  },
  {
    systemId: "SYS_FEMALE_BODY",
    overview: text(
      "A whole-body female atlas for studying organ-system location and integrated physiology while preserving female pelvic, reproductive and endocrine relationships within the complete body.",
      "أطلس كامل لجسم المرأة لدراسة مواقع الأجهزة والفسيولوجيا المتكاملة مع الحفاظ على العلاقات الحوضية والتناسلية والصماء الأنثوية ضمن الجسم الكامل.",
    ),
    anatomyFocus: [
      text("Head-to-foot regional orientation and major body cavities", "الاتجاه التشريحي من الرأس إلى القدمين وتجاويف الجسم الرئيسية"),
      text("Three-dimensional relationships of vessels, nerves, skeleton, muscles and viscera", "العلاقات ثلاثية الأبعاد بين الأوعية والأعصاب والهيكل والعضلات والأحشاء"),
      text("Female pelvic anatomy, uterus, adnexa, vagina and pelvic floor in whole-body context", "تشريح الحوض الأنثوي والرحم والملحقات والمهبل وقاع الحوض ضمن سياق الجسم الكامل"),
    ],
    physiologyFocus: [
      text("Integrated circulation, respiration, digestion and renal balance", "تكامل الدوران والتنفس والهضم والتوازن الكلوي"),
      text("Neural, endocrine, immune and thermoregulatory control", "التحكم العصبي والصماوي والمناعي والحراري"),
      text("Movement, metabolism and reproductive-cycle integration", "تكامل الحركة والاستقلاب والدورة التناسلية"),
      text("Systemic effects of ovarian hormones across bone, brain, cardiovascular tissue and uterus", "التأثيرات الجهازية لهرمونات المبيض على العظم والدماغ والأنسجة القلبية الوعائية والرحم"),
    ],
    mechanisms: [
      { title: text("Integrated transport", "النقل المتكامل"), description: text("Cardiovascular flow connects lungs, gut, kidneys, endocrine organs, muscles, brain and reproductive tissues through shared transport of gases, substrates and signals.", "يربط الجريان القلبي الوعائي الرئتين والأمعاء والكليتين والغدد والعضلات والدماغ والأنسجة التناسلية عبر نقل مشترك للغازات والركائز والإشارات.") },
      { title: text("Endocrine integration", "التكامل الصماوي"), description: text("Ovarian hormones interact with hypothalamic-pituitary signaling and have effects beyond reproduction, including bone remodeling and vascular biology.", "تتفاعل هرمونات المبيض مع إشارات الوطاء والنخامى ولها تأثيرات تتجاوز التكاثر وتشمل إعادة تشكيل العظم وبيولوجيا الأوعية."),
    ],
    regulation: [
      text("Autonomic reflexes and endocrine feedback coordinate immediate and long-term changes in organ function.", "تنسق المنعكسات الذاتية والتغذية الراجعة الهرمونية التغيرات الفورية وطويلة المدى في وظيفة الأعضاء."),
      text("The reproductive cycle introduces predictable endocrine variation while core homeostatic systems remain continuously active.", "تضيف الدورة التناسلية تغيرات هرمونية متوقعة بينما تبقى أنظمة الاتزان الداخلي الأساسية نشطة باستمرار."),
    ],
    keyValues: [
      { label: text("Resting cardiac output", "النتاج القلبي في الراحة"), value: "≈ 5 L/min", note: text("Varies with body size and physiologic state.", "يتغير بحسب حجم الجسم والحالة الفسيولوجية.") },
      { label: text("Core temperature range", "مجال حرارة الجسم المركزية"), value: "≈ 36.5–37.5°C", note: text("Small cycle-related shifts can occur in basal temperature after ovulation.", "قد تحدث تغيرات بسيطة مرتبطة بالدورة في الحرارة القاعدية بعد الإباضة.") },
    ],
    clinicalLinks: [
      text("Whole-body context helps explain multisystem effects of pregnancy, endocrine disorders, anemia, inflammation and cardiovascular disease.", "يساعد سياق الجسم الكامل على تفسير التأثيرات متعددة الأجهزة للحمل والاضطرابات الصماء وفقر الدم والالتهاب وأمراض القلب والأوعية."),
    ],
  },
];

export function getSexSpecificLearningProfile(systemId: string) {
  return sexSpecificLearningProfiles.find((item) => item.systemId === systemId);
}
