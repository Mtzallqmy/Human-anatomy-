import type { LocalizedText, PhysiologyAnimation } from "@/src/types/medical";

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

type Sex = "MALE" | "FEMALE";

const process = (
  sex: Sex,
  key: string,
  nameEn: string,
  nameAr: string,
  steps: Array<[string, string, string]>,
): PhysiologyAnimation => {
  const systemId = sex === "MALE" ? "SYS_MALE_BODY" : "SYS_FEMALE_BODY";
  return {
    id: `PHYS_${sex}_BODY_${key}`,
    systemId,
    name: text(nameEn, nameAr),
    structureIds: steps.map(([layer]) => `ANAT_${sex}_BODY_${layer}`),
    duration: Math.max(16, steps.length * 4),
    steps: steps.map(([layer, en, ar], index) => ({
      id: `PHYS_${sex}_BODY_${key}_STEP_${index + 1}`,
      structureId: `ANAT_${sex}_BODY_${layer}`,
      name: text(en, ar),
      description: text(en, ar),
      order: index,
    })),
  };
};

const sharedProcesses = (sex: Sex): PhysiologyAnimation[] => [
  process(sex, "OXYGEN_DELIVERY", "Oxygen delivery and carbon-dioxide removal", "إيصال الأكسجين والتخلص من ثاني أكسيد الكربون", [
    ["RESPIRATORY", "Ventilation brings air to alveoli and exchanges oxygen and carbon dioxide with pulmonary blood.", "تجلب التهوية الهواء إلى الحويصلات ويتم تبادل الأكسجين وثاني أكسيد الكربون مع الدم الرئوي."],
    ["CARDIOVASCULAR", "The heart pumps oxygenated blood through systemic arteries to tissue capillaries.", "يضخ القلب الدم المؤكسج عبر الشرايين الجهازية إلى الشعيرات النسيجية."],
    ["MUSCULAR", "Working tissues consume oxygen for mitochondrial ATP production and release carbon dioxide.", "تستهلك الأنسجة العاملة الأكسجين لإنتاج ATP في الميتوكندريا وتطلق ثاني أكسيد الكربون."],
    ["CARDIOVASCULAR", "Venous blood returns carbon dioxide to the right heart and then to the lungs.", "يعيد الدم الوريدي ثاني أكسيد الكربون إلى القلب الأيمن ثم إلى الرئتين."],
  ]),
  process(sex, "NUTRITION", "Digestion, absorption and nutrient distribution", "الهضم والامتصاص وتوزيع المغذيات", [
    ["DIGESTIVE", "Food is mechanically and chemically processed into absorbable nutrients.", "يُعالج الطعام ميكانيكيًا وكيميائيًا إلى مغذيات قابلة للامتصاص."],
    ["DIGESTIVE", "The small intestine transfers glucose, amino acids, lipids, vitamins and minerals into blood or lymph.", "تنقل الأمعاء الدقيقة الغلوكوز والأحماض الأمينية والدهون والفيتامينات والمعادن إلى الدم أو اللمف."],
    ["CARDIOVASCULAR", "Portal and systemic circulation distribute absorbed nutrients to liver and peripheral tissues.", "يوزع الدوران البابي والجهازي المغذيات الممتصة إلى الكبد والأنسجة المحيطية."],
    ["ENDOCRINE", "Insulin, glucagon and other hormones coordinate storage, use and mobilization of metabolic fuels.", "ينسق الإنسولين والغلوكاغون وهرمونات أخرى تخزين الوقود الأيضي واستخدامه وتحريره."],
  ]),
  process(sex, "FLUID_BALANCE", "Kidney filtration, fluid and electrolyte balance", "ترشيح الكلى وتوازن السوائل والشوارد", [
    ["CARDIOVASCULAR", "Renal blood flow delivers plasma to glomerular capillaries.", "يوصل الجريان الدموي الكلوي البلازما إلى الشعيرات الكبيبية."],
    ["URINARY", "Glomeruli filter plasma while tubules selectively reabsorb water and solutes and secrete wastes.", "ترشح الكبيبات البلازما بينما تعيد النبيبات امتصاص الماء والمواد المذابة انتقائيًا وتفرز الفضلات."],
    ["ENDOCRINE", "ADH, aldosterone, natriuretic peptides and the renin-angiotensin system regulate volume and osmolality.", "تنظم الهرمونات المضادة للإدرار والألدوستيرون والببتيدات المدرّة للصوديوم ونظام الرينين-أنجيوتنسين الحجم والأسمولية."],
    ["URINARY", "Final urine removes nitrogenous waste and excess water, acid and electrolytes.", "يطرح البول النهائي الفضلات النيتروجينية والماء الزائد والأحماض والشوارد."],
  ]),
  process(sex, "NEURAL_CONTROL", "Neural sensing, integration and motor control", "الإحساس العصبي والتكامل والتحكم الحركي", [
    ["NERVOUS", "Sensory receptors encode changes inside and outside the body and send signals to the central nervous system.", "تحول المستقبلات الحسية التغيرات داخل الجسم وخارجه إلى إشارات ترسل إلى الجهاز العصبي المركزي."],
    ["NERVOUS", "Brain and spinal networks integrate sensory information with memory, autonomic state and goals.", "تدمج شبكات الدماغ والحبل الشوكي المعلومات الحسية مع الذاكرة والحالة الذاتية والأهداف."],
    ["MUSCULAR", "Somatic motor pathways recruit skeletal muscle to generate coordinated movement and posture.", "تجند المسارات الحركية الجسدية العضلات الهيكلية لتوليد الحركة المنسقة والقوام."],
    ["CARDIOVASCULAR", "Autonomic output continuously adjusts heart rate, vascular tone and visceral activity.", "يضبط الخرج الذاتي باستمرار معدل القلب وتوتر الأوعية ونشاط الأحشاء."],
  ]),
  process(sex, "ENDOCRINE_CONTROL", "Hormonal control and feedback", "التحكم الهرموني والتغذية الراجعة", [
    ["ENDOCRINE", "Hypothalamic and pituitary signals coordinate endocrine axes according to neural and metabolic inputs.", "تنسق إشارات الوطاء والنخامى المحاور الصماء وفق المدخلات العصبية والاستقلابية."],
    ["ENDOCRINE", "Peripheral glands release hormones into the circulation to act on distant target tissues.", "تطلق الغدد المحيطية الهرمونات في الدوران لتؤثر في أنسجة هدف بعيدة."],
    ["CARDIOVASCULAR", "Blood distributes hormones throughout the body while binding proteins and clearance shape their effective concentration.", "يوزع الدم الهرمونات في أنحاء الجسم بينما تحدد بروتينات الارتباط والتصفية تركيزها الفعال."],
    ["NERVOUS", "Negative and positive feedback loops adjust secretion to preserve homeostasis or complete timed physiological events.", "تعدل دوائر التغذية الراجعة السلبية والإيجابية الإفراز لحفظ الاتزان الداخلي أو إكمال أحداث فسيولوجية موقوتة."],
  ]),
  process(sex, "IMMUNITY", "Immune surveillance and lymph return", "المراقبة المناعية وعودة اللمف", [
    ["LYMPHATIC", "Interstitial fluid enters lymphatic capillaries together with antigens and immune cells.", "يدخل السائل الخلالي الشعيرات اللمفاوية مع المستضدات والخلايا المناعية."],
    ["LYMPHATIC", "Lymph nodes filter lymph and organize interactions between antigen-presenting cells and lymphocytes.", "ترشح العقد اللمفاوية اللمف وتنظم التفاعل بين الخلايا العارضة للمستضد واللمفاويات."],
    ["CARDIOVASCULAR", "Lymph returns to the venous circulation and immune cells recirculate between blood and tissues.", "يعود اللمف إلى الدوران الوريدي وتتنقل الخلايا المناعية باستمرار بين الدم والأنسجة."],
    ["INTEGUMENTARY", "Skin and mucosal barriers provide the first physical and immunological defense against pathogens.", "يوفر الجلد والحواجز المخاطية خط الدفاع الفيزيائي والمناعي الأول ضد العوامل الممرضة."],
  ]),
  process(sex, "MOVEMENT", "Movement, posture and skeletal support", "الحركة والقوام والدعم الهيكلي", [
    ["NERVOUS", "Motor planning and spinal circuits generate patterned neural commands.", "تولد دوائر التخطيط الحركي والحبل الشوكي أوامر عصبية منسقة."],
    ["MUSCULAR", "Motor units activate sarcomeres to convert ATP into force.", "تنشط الوحدات الحركية الساركوميرات لتحويل ATP إلى قوة."],
    ["SKELETAL", "Bones and joints act as levers and load-bearing structures that direct muscle force into movement.", "تعمل العظام والمفاصل كروافع وهياكل حاملة للأحمال توجه قوة العضلات إلى حركة."],
    ["CARDIOVASCULAR", "Exercise increases cardiac output and redistributes blood flow toward active muscles and skin.", "تزيد التمارين النتاج القلبي وتعيد توزيع الجريان نحو العضلات النشطة والجلد."],
  ]),
  process(sex, "THERMOREGULATION", "Temperature regulation", "تنظيم درجة الحرارة", [
    ["NERVOUS", "Hypothalamic circuits compare core and skin temperature signals with a regulated set range.", "تقارن دوائر الوطاء إشارات حرارة المركز والجلد بالمجال الحراري المنظم."],
    ["INTEGUMENTARY", "Skin blood flow and sweating alter heat transfer to the environment.", "يغير جريان الدم الجلدي والتعرق انتقال الحرارة إلى البيئة."],
    ["MUSCULAR", "Shivering and muscle metabolism can increase heat production when the body is cold.", "يمكن للارتعاش واستقلاب العضلات زيادة إنتاج الحرارة عند البرودة."],
    ["CARDIOVASCULAR", "Circulation redistributes heat between core tissues and the body surface.", "يعيد الدوران توزيع الحرارة بين الأنسجة المركزية وسطح الجسم."],
  ]),
];

export const wholeBodyPhysiologyAnimations: PhysiologyAnimation[] = [
  ...sharedProcesses("MALE"),
  ...sharedProcesses("FEMALE"),
];
