import type {
  AnatomicalStructure,
  LocalizedText,
  PhysiologyAnimation,
} from "@/src/types/medical";

const references = ["REF_FIPAT_TA2", "REF_GRAYS_ANATOMY", "REF_GUYTON_HALL"];

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

type StructureSeed = {
  id: string;
  en: string;
  ar: string;
  latin?: string;
  parentId?: string;
  anatomy: LocalizedText;
  physiology: LocalizedText;
  location: LocalizedText;
  bloodSupply?: LocalizedText;
  innervation?: LocalizedText;
};

function buildStructures(systemId: string, rootId: string, seeds: StructureSeed[]): AnatomicalStructure[] {
  return seeds.map((seed, index) => {
    const isRoot = seed.id === rootId;
    const parentId = isRoot ? undefined : (seed.parentId ?? rootId);
    const childrenIds = seeds.filter((candidate) => (candidate.parentId ?? rootId) === seed.id && candidate.id !== rootId).map((candidate) => candidate.id);
    const column = (index % 3) - 1;
    const row = Math.floor(index / 3);
    return {
      id: seed.id,
      name: text(seed.en, seed.ar),
      latinName: seed.latin,
      description: text(
        `${seed.en} is taught here through regional anatomy, structural relationships, functional integration, and clinically relevant landmarks.`,
        `يُشرح ${seed.ar} هنا من خلال التشريح الموضعي والعلاقات البنيوية والتكامل الوظيفي والمعالم ذات الأهمية السريرية.`,
      ),
      anatomy: seed.anatomy,
      physiology: seed.physiology,
      location: seed.location,
      bloodSupply: seed.bloodSupply,
      innervation: seed.innervation,
      systemId,
      parentId,
      childrenIds,
      relatedStructureIds: [],
      relatedDiseaseIds: [],
      meshIds: isRoot ? [] : [`Mesh_${seed.id}`],
      referenceIds: references,
      labelAnchor: [column * 0.92, 2.1 - row * 0.62, column === 0 ? 0.38 : 0.08],
      studyNumber: isRoot ? undefined : index,
    };
  });
}

const skeletalSeeds: StructureSeed[] = [
  {
    id: "ANAT_SKELETAL",
    en: "Skeletal system",
    ar: "الجهاز الهيكلي",
    latin: "Systema skeletale",
    anatomy: text("The adult skeleton is organized into axial and appendicular divisions connected by synovial, cartilaginous, and fibrous joints.", "يتنظم الهيكل العظمي عند البالغ إلى قسم محوري وقسم طرفي تربط بينهما مفاصل زلالية وغضروفية وليفية."),
    physiology: text("Bone supports posture, protects organs, acts as a mineral reservoir, provides levers for movement, and houses hematopoietic marrow.", "يدعم العظم القوام ويحمي الأعضاء ويعمل كمخزن للمعادن ويوفر روافع للحركة ويحتوي نخاع تكوين الدم."),
    location: text("Throughout the body.", "في جميع أنحاء الجسم."),
  },
  {
    id: "ANAT_AXIAL_SKELETON",
    en: "Axial skeleton",
    ar: "الهيكل المحوري",
    latin: "Skeleton axiale",
    anatomy: text("Includes the skull, vertebral column, ribs, and sternum, forming the central mechanical axis of the body.", "يشمل الجمجمة والعمود الفقري والأضلاع والقص ويشكل المحور الميكانيكي المركزي للجسم."),
    physiology: text("Stabilizes the head and trunk, protects the brain, spinal cord and thoracic organs, and transmits loads between body regions.", "يثبت الرأس والجذع ويحمي الدماغ والحبل الشوكي وأعضاء الصدر وينقل الأحمال بين مناطق الجسم."),
    location: text("Head, neck and trunk.", "الرأس والعنق والجذع."),
  },
  {
    id: "ANAT_APPENDICULAR_SKELETON",
    en: "Appendicular skeleton",
    ar: "الهيكل الطرفي",
    latin: "Skeleton appendiculare",
    anatomy: text("Comprises the pectoral and pelvic girdles plus the bones of the upper and lower limbs.", "يتكون من الحزامين الكتفي والحوضي وعظام الطرفين العلوي والسفلي."),
    physiology: text("Provides mobile lever systems for manipulation, locomotion, balance, and transfer of forces to the axial skeleton.", "يوفر منظومات روافع متحركة للمناورة والحركة والتوازن ونقل القوى إلى الهيكل المحوري."),
    location: text("Shoulder girdle, pelvis and limbs.", "حزام الكتف والحوض والأطراف."),
  },
  {
    id: "ANAT_COMPACT_BONE",
    en: "Compact bone",
    ar: "العظم القشري",
    latin: "Substantia compacta",
    anatomy: text("Dense lamellar bone arranged around osteons and vascular canals, especially prominent in long-bone cortices.", "عظم صفائحي كثيف منظم حول الأوستيونات والقنوات الوعائية ويبرز خصوصًا في قشرة العظام الطويلة."),
    physiology: text("Resists bending and torsion while continuously remodeling in response to mechanical loading and calcium-phosphate homeostasis.", "يقاوم الانثناء والالتواء ويخضع لإعادة تشكيل مستمرة استجابة للحمل الميكانيكي واتزان الكالسيوم والفوسفات."),
    location: text("Outer cortex of most bones.", "القشرة الخارجية لمعظم العظام."),
  },
  {
    id: "ANAT_TRABECULAR_BONE",
    en: "Trabecular bone",
    ar: "العظم الإسفنجي",
    latin: "Substantia spongiosa",
    anatomy: text("A lattice of trabeculae oriented along lines of stress with marrow-filled spaces between them.", "شبكة من الترابيق تتجه وفق خطوط الإجهاد وتفصل بينها فراغات مملوءة بالنخاع."),
    physiology: text("Provides high strength-to-weight efficiency, distributes compressive forces, and participates rapidly in mineral exchange and remodeling.", "يوفر كفاءة عالية للقوة مقابل الوزن ويوزع قوى الضغط ويسهم بسرعة في تبادل المعادن وإعادة البناء."),
    location: text("Vertebrae, pelvis, ribs and epiphyses of long bones.", "الفقرات والحوض والأضلاع ونهايات العظام الطويلة."),
  },
  {
    id: "ANAT_SYNOVIAL_JOINT",
    en: "Synovial joint",
    ar: "المفصل الزلالي",
    latin: "Articulatio synovialis",
    anatomy: text("Articular cartilage covers opposing surfaces inside a fibrous capsule lined by synovium; ligaments guide and limit motion.", "يغطي الغضروف المفصلي السطوح المتقابلة داخل محفظة ليفية مبطنة بالغشاء الزلالي وتوجه الأربطة الحركة وتحدها."),
    physiology: text("Low-friction articulation converts muscle force into controlled movement while synovial fluid nourishes avascular cartilage.", "يحول المفصل منخفض الاحتكاك قوة العضلات إلى حركة مضبوطة بينما يغذي السائل الزلالي الغضروف غير الوعائي."),
    location: text("Major mobile joints including shoulder, elbow, hip and knee.", "المفاصل المتحركة الرئيسية مثل الكتف والمرفق والورك والركبة."),
  },
  {
    id: "ANAT_BONE_MARROW",
    en: "Bone marrow",
    ar: "نخاع العظم",
    latin: "Medulla ossium",
    anatomy: text("Specialized tissue within medullary cavities and trabecular spaces containing hematopoietic cells, stromal cells and vascular sinusoids.", "نسيج متخصص داخل تجاويف النخاع وفراغات العظم الإسفنجي ويضم خلايا مكونة للدم وخلايا سدوية وجيوبًا وعائية."),
    physiology: text("Produces erythrocytes, leukocytes and platelets and provides a niche for immune-cell maturation.", "ينتج كريات الدم الحمراء والبيضاء والصفائح ويوفر بيئة لنضج الخلايا المناعية."),
    location: text("Predominantly axial skeleton and proximal humerus/femur in adults.", "يتركز عند البالغين في الهيكل المحوري والنهايات القريبة للعضد والفخذ."),
  },
];

const muscularSeeds: StructureSeed[] = [
  {
    id: "ANAT_MUSCULAR",
    en: "Muscular system",
    ar: "الجهاز العضلي",
    latin: "Systema musculare",
    anatomy: text("Skeletal muscles are organized into fascicles and fibers attached to bones by tendons and aponeuroses, while smooth and cardiac muscle serve visceral systems.", "تنتظم العضلات الهيكلية في حزم وألياف ترتبط بالعظام بالأوتار والصفاقات بينما تخدم العضلات الملساء والقلبية الأجهزة الحشوية."),
    physiology: text("Muscle converts chemical energy into force, movement, postural control, heat production, and mechanical work.", "تحول العضلات الطاقة الكيميائية إلى قوة وحركة وضبط للقوام وإنتاج للحرارة وعمل ميكانيكي."),
    location: text("Throughout the body.", "في جميع أنحاء الجسم."),
  },
  {
    id: "ANAT_SKELETAL_MUSCLE",
    en: "Skeletal muscle",
    ar: "العضلة الهيكلية",
    latin: "Musculus skeletalis",
    anatomy: text("Multinucleated striated fibers are bundled within endomysium, perimysium and epimysium and connected to tendons.", "تتجمع ألياف مخططة متعددة النوى داخل الأغلفة الضامة الداخلية والحزمية والخارجية وتتصل بالأوتار."),
    physiology: text("Somatic motor neurons trigger excitation-contraction coupling, allowing voluntary force generation and reflex responses.", "تحفز العصبونات الحركية الجسدية اقتران التنبيه بالانقباض بما يسمح بتوليد القوة الإرادية والاستجابات الانعكاسية."),
    location: text("Attached to the skeleton and facial soft tissues.", "مرتبطة بالهيكل العظمي والأنسجة الرخوة للوجه."),
    innervation: text("Somatic motor neurons at neuromuscular junctions.", "عصبونات حركية جسدية عند الوصلات العصبية العضلية."),
  },
  {
    id: "ANAT_MUSCLE_FIBER",
    en: "Muscle fiber",
    ar: "الليف العضلي",
    latin: "Fibra muscularis",
    anatomy: text("A long excitable cell containing myofibrils, sarcoplasmic reticulum, transverse tubules and abundant mitochondria.", "خلية طويلة قابلة للاستثارة تحتوي لييفات عضلية وشبكة ساركوبلازمية وأنابيب مستعرضة وميتوكندريا وفيرة."),
    physiology: text("Action potentials release calcium from the sarcoplasmic reticulum; calcium permits actin-myosin cross-bridge cycling and ATP-dependent shortening.", "تطلق جهود الفعل الكالسيوم من الشبكة الساركوبلازمية فيسمح الكالسيوم بدورة الجسور بين الأكتين والميوسين والتقصير المعتمد على ATP."),
    location: text("Within skeletal muscle fascicles.", "داخل حزم العضلات الهيكلية."),
  },
  {
    id: "ANAT_SARCOMERE",
    en: "Sarcomere",
    ar: "الساركومير",
    latin: "Sarcomerum",
    anatomy: text("The contractile unit between adjacent Z discs containing thick myosin and thin actin filaments with titin-based elastic support.", "الوحدة الانقباضية بين قرصي Z وتضم خيوط الميوسين السميكة والأكتين الرقيقة ودعمًا مرنًا يعتمد على التيتين."),
    physiology: text("Force depends on cross-bridge number and filament overlap; sarcomeres shorten without shortening the individual contractile filaments.", "تعتمد القوة على عدد الجسور وتراكب الخيوط ويقصر الساركومير من دون أن تقصر الخيوط الانقباضية نفسها."),
    location: text("Repeated along every myofibril.", "متكرر على طول كل لييفة عضلية."),
  },
  {
    id: "ANAT_MOTOR_UNIT",
    en: "Motor unit",
    ar: "الوحدة الحركية",
    anatomy: text("A lower motor neuron and all skeletal muscle fibers innervated by its axon branches.", "عصبون حركي سفلي وجميع ألياف العضلة الهيكلية التي تعصبها تفرعات محوره."),
    physiology: text("Force is graded by motor-unit recruitment and firing frequency; small units support precision while larger units support power.", "تتدرج القوة بتجنيد الوحدات الحركية وتواتر إطلاقها؛ تدعم الوحدات الصغيرة الدقة والكبيرة القوة."),
    location: text("Distributed through each skeletal muscle.", "موزعة في كل عضلة هيكلية."),
    innervation: text("Alpha motor neurons from brainstem or spinal cord.", "العصبونات الحركية ألفا من جذع الدماغ أو الحبل الشوكي."),
  },
  {
    id: "ANAT_TENDON",
    en: "Tendon",
    ar: "الوتر",
    latin: "Tendo",
    anatomy: text("Dense regular collagen bundles aligned with the direction of tensile force connect muscle to bone.", "حزم كولاجين كثيفة منتظمة تتجه مع مسار قوة الشد وتربط العضلة بالعظم."),
    physiology: text("Transfers muscle force, stores and returns elastic energy, and contributes to proprioceptive feedback through tendon organs.", "ينقل قوة العضلة ويخزن الطاقة المرنة ويعيدها ويسهم في الحس العميق عبر أعضاء الأوتار."),
    location: text("At muscle attachments and myotendinous junctions.", "عند ارتكازات العضلات والوصلات العضلية الوترية."),
  },
  {
    id: "ANAT_NEUROMUSCULAR_JUNCTION",
    en: "Neuromuscular junction",
    ar: "الوصلة العصبية العضلية",
    latin: "Junctio neuromuscularis",
    anatomy: text("A specialized synapse between a motor-axon terminal and the motor end plate of a skeletal muscle fiber.", "مشبك متخصص بين نهاية محور عصبي حركي واللوحة النهائية الحركية لليف عضلي هيكلي."),
    physiology: text("Acetylcholine activates nicotinic receptors, generating an end-plate potential that initiates a muscle action potential.", "ينشط الأستيل كولين المستقبلات النيكوتينية مولدًا جهد اللوحة النهائية الذي يبدأ جهد الفعل العضلي."),
    location: text("On skeletal muscle fibers, usually near the fiber midpoint.", "على ألياف العضلات الهيكلية وغالبًا قرب منتصف الليف."),
    innervation: text("Somatic motor axons.", "محاور عصبية حركية جسدية."),
  },
];

const endocrineSeeds: StructureSeed[] = [
  {
    id: "ANAT_ENDOCRINE",
    en: "Endocrine system",
    ar: "جهاز الغدد الصماء",
    latin: "Systema endocrinum",
    anatomy: text("Endocrine glands and dispersed endocrine cells release hormones directly into the circulation and communicate through feedback-controlled axes.", "تفرز الغدد الصماء والخلايا الصماء المنتشرة الهرمونات مباشرة إلى الدوران وتتواصل عبر محاور تضبطها حلقات تغذية راجعة."),
    physiology: text("Hormones coordinate metabolism, growth, reproduction, stress responses, fluid balance, calcium homeostasis and circadian timing.", "تنسق الهرمونات الاستقلاب والنمو والتكاثر والاستجابة للضغط وتوازن السوائل والكالسيوم والإيقاع اليومي."),
    location: text("Distributed from the brain to the pelvis.", "موزع من الدماغ إلى الحوض."),
  },
  {
    id: "ANAT_HYPOTHALAMUS",
    en: "Hypothalamus",
    ar: "تحت المهاد",
    latin: "Hypothalamus",
    anatomy: text("A diencephalic region containing nuclei that link neural signals to pituitary endocrine output.", "منطقة في الدماغ البيني تضم نوى تربط الإشارات العصبية بالمخرجات الهرمونية للنخامى."),
    physiology: text("Releasing and inhibiting hormones regulate the anterior pituitary; hypothalamic neurons synthesize vasopressin and oxytocin for posterior-pituitary release.", "تنظم هرمونات الإطلاق والتثبيط الفص الأمامي للنخامى وتصنع عصبونات تحت المهاد الفازوبريسين والأوكسيتوسين لإطلاقهما من الفص الخلفي."),
    location: text("Inferior to the thalamus, forming the floor of the third ventricle.", "أسفل المهاد ويشكل أرضية البطين الثالث."),
  },
  {
    id: "ANAT_PITUITARY",
    en: "Pituitary gland",
    ar: "الغدة النخامية",
    latin: "Hypophysis",
    anatomy: text("A small gland in the sella turcica with anterior adenohypophysis and posterior neurohypophysis connected to the hypothalamus.", "غدة صغيرة في السرج التركي تضم النخامى الغدية أماميًا والعصبية خلفيًا وتتصل بتحت المهاد."),
    physiology: text("Controls thyroid, adrenal and gonadal axes, growth and lactation while releasing vasopressin and oxytocin from posterior terminals.", "تضبط محاور الدرق والكظر والغدد التناسلية والنمو والإرضاع وتطلق الفازوبريسين والأوكسيتوسين من النهايات الخلفية."),
    location: text("Sella turcica of the sphenoid bone.", "السرج التركي في العظم الوتدي."),
    bloodSupply: text("Superior and inferior hypophyseal arteries with a hypothalamo-hypophyseal portal system.", "الشرايين النخامية العلوية والسفلية مع الجهاز البابي الوطائي النخامي."),
  },
  {
    id: "ANAT_THYROID",
    en: "Thyroid gland",
    ar: "الغدة الدرقية",
    latin: "Glandula thyroidea",
    anatomy: text("Two highly vascular lobes joined by an isthmus; follicles store thyroglobulin and parafollicular cells produce calcitonin.", "فصان غنيان بالتروية يصل بينهما برزخ؛ تخزن الجريبات الثيروغلوبولين وتنتج الخلايا المجاورة للجريبات الكالسيتونين."),
    physiology: text("T3 and T4 increase basal metabolic activity and support growth and neurodevelopment under TSH feedback control.", "يزيد T3 وT4 النشاط الاستقلابي الأساسي ويدعمان النمو والتطور العصبي تحت ضبط التغذية الراجعة لـTSH."),
    location: text("Anterior neck, anterolateral to the upper trachea.", "مقدمة العنق أمام وجانب الجزء العلوي من الرغامى."),
    bloodSupply: text("Superior and inferior thyroid arteries.", "الشرايين الدرقية العلوية والسفلية."),
  },
  {
    id: "ANAT_PARATHYROIDS",
    en: "Parathyroid glands",
    ar: "الغدد جارات الدرق",
    latin: "Glandulae parathyroideae",
    anatomy: text("Usually four small glands closely related to the posterior thyroid capsule.", "غالبًا أربع غدد صغيرة ترتبط تشريحيًا بالسطح الخلفي لمحفظة الدرق."),
    physiology: text("Parathyroid hormone raises extracellular calcium through coordinated actions on bone, kidney and vitamin-D activation.", "يرفع هرمون جار الدرق الكالسيوم خارج الخلايا عبر تأثيرات منسقة في العظم والكلية وتنشيط فيتامين D."),
    location: text("Posterior surface of the thyroid gland.", "السطح الخلفي للغدة الدرقية."),
  },
  {
    id: "ANAT_ADRENALS",
    en: "Adrenal glands",
    ar: "الغدتان الكظريتان",
    latin: "Glandulae suprarenales",
    anatomy: text("Each gland has a steroid-producing cortex and catecholamine-producing medulla with distinct vascular and neural regulation.", "لكل غدة قشرة منتجة للستيرويدات ولب منتج للكاتيكولامينات مع تنظيم وعائي وعصبي متميز."),
    physiology: text("Cortisol, aldosterone and adrenal androgens regulate stress, metabolism and salt balance; epinephrine supports rapid sympathetic responses.", "ينظم الكورتيزول والألدوستيرون والأندروجينات الكظرية الضغط والاستقلاب وتوازن الملح بينما يدعم الأدرينالين الاستجابة الودية السريعة."),
    location: text("Superior poles of the kidneys in the retroperitoneum.", "فوق القطبين العلويين للكليتين خلف الصفاق."),
  },
  {
    id: "ANAT_PANCREATIC_ISLETS",
    en: "Pancreatic islets",
    ar: "جزر البنكرياس",
    latin: "Insulae pancreaticae",
    anatomy: text("Small endocrine cell clusters dispersed through the pancreas containing beta, alpha, delta and PP cells.", "تجمعات صغيرة من الخلايا الصماء منتشرة في البنكرياس وتضم خلايا بيتا وألفا ودلتا وPP."),
    physiology: text("Insulin and glucagon provide reciprocal control of glucose storage, utilization and mobilization; somatostatin modulates neighboring endocrine secretion.", "يوفر الإنسولين والغلوكاغون ضبطًا متعاكسًا لتخزين الغلوكوز واستخدامه وتحريره بينما يعدل السوماتوستاتين الإفراز الصماوي المجاور."),
    location: text("Throughout the pancreas, relatively enriched toward the tail.", "في أنحاء البنكرياس مع كثافة نسبية أكبر باتجاه الذيل."),
  },
];

const lymphaticSeeds: StructureSeed[] = [
  {
    id: "ANAT_LYMPHATIC",
    en: "Lymphatic and immune system",
    ar: "الجهاز اللمفاوي والمناعي",
    latin: "Systema lymphaticum",
    anatomy: text("A one-way network of lymphatic capillaries, collecting vessels, nodes and lymphoid organs that returns interstitial fluid to venous blood.", "شبكة أحادية الاتجاه من الشعيرات والأوعية اللمفاوية والعقد والأعضاء اللمفاوية تعيد السائل الخلالي إلى الدم الوريدي."),
    physiology: text("Maintains fluid balance, transports dietary lipids and enables antigen surveillance, lymphocyte activation and adaptive immune responses.", "يحافظ على توازن السوائل وينقل الدهون الغذائية ويمكّن مراقبة المستضدات وتنشيط الخلايا اللمفاوية والاستجابات المناعية التكيفية."),
    location: text("Distributed throughout most tissues and body regions.", "موزع في معظم الأنسجة ومناطق الجسم."),
  },
  {
    id: "ANAT_LYMPH_CAPILLARIES",
    en: "Lymphatic capillaries",
    ar: "الشعيرات اللمفاوية",
    anatomy: text("Blind-ended thin-walled endothelial channels with overlapping cell junctions that admit interstitial fluid and macromolecules.", "قنوات بطانية رقيقة الجدار مغلقة النهاية ذات وصلات خلوية متراكبة تسمح بدخول السائل الخلالي والجزيئات الكبيرة."),
    physiology: text("Collect excess filtered fluid and proteins that cannot return directly through blood capillaries.", "تجمع السائل والبروتينات الزائدة المرشحة التي لا تستطيع العودة مباشرة عبر الشعيرات الدموية."),
    location: text("Most vascularized tissues; specialized lacteals are present in intestinal villi.", "معظم الأنسجة الوعائية وتوجد أوعية لبنية متخصصة في الزغابات المعوية."),
  },
  {
    id: "ANAT_LYMPH_VESSELS",
    en: "Collecting lymphatic vessels",
    ar: "الأوعية اللمفاوية الجامعة",
    anatomy: text("Thin-walled vessels with frequent valves and smooth muscle segments route lymph through regional nodes toward central ducts.", "أوعية رقيقة الجدار كثيرة الصمامات وذات مقاطع عضلية ملساء تمرر اللمف عبر العقد الإقليمية نحو القنوات المركزية."),
    physiology: text("Intrinsic contraction, skeletal-muscle pumping, respiration and arterial pulsation propel lymph against low pressure gradients.", "تدفع الانقباضات الذاتية ومضخة العضلات الهيكلية والتنفس ونبض الشرايين اللمف عبر فروق ضغط منخفضة."),
    location: text("Along neurovascular bundles and superficial/deep tissue planes.", "على طول الحزم العصبية الوعائية والمستويات النسيجية السطحية والعميقة."),
  },
  {
    id: "ANAT_LYMPH_NODES",
    en: "Lymph nodes",
    ar: "العقد اللمفاوية",
    latin: "Nodi lymphatici",
    anatomy: text("Encapsulated lymphoid organs with cortex, paracortex and medulla arranged around afferent and efferent lymphatic channels.", "أعضاء لمفاوية محاطة بمحفظة تضم قشرة ومنطقة جانب قشرية ولبًا مرتبة حول أوعية لمفاوية واردة وصادرة."),
    physiology: text("Filter lymph, concentrate antigen presentation and organize B-cell and T-cell activation and clonal expansion.", "ترشح اللمف وتركز عرض المستضد وتنظم تنشيط الخلايا البائية والتائية وتكاثرها النسلي."),
    location: text("Concentrated in cervical, axillary, mediastinal, mesenteric and inguinal chains.", "تتركز في سلاسل عنقية وإبطية ومنصفية ومساريقية وأربية."),
  },
  {
    id: "ANAT_SPLEEN",
    en: "Spleen",
    ar: "الطحال",
    latin: "Splen",
    anatomy: text("A highly vascular organ with white pulp surrounding central arterioles and red pulp composed of cords and venous sinusoids.", "عضو غني بالتروية يحوي لبًا أبيض حول الشريينات المركزية ولبًا أحمر من حبال وجيوب وريدية."),
    physiology: text("Filters circulating blood, removes aged erythrocytes, stores platelets and mounts immune responses to blood-borne antigens.", "يرشح الدم الجاري ويزيل الكريات الحمراء الهرمة ويخزن الصفائح ويطلق استجابات مناعية لمستضدات الدم."),
    location: text("Left upper quadrant beneath ribs 9-11.", "الربع العلوي الأيسر تحت الأضلاع 9-11."),
    bloodSupply: text("Splenic artery from the celiac trunk.", "الشريان الطحالي من الجذع الزلاقي."),
  },
  {
    id: "ANAT_THYMUS",
    en: "Thymus",
    ar: "الغدة الزعترية",
    latin: "Thymus",
    anatomy: text("A lobulated primary lymphoid organ with cortical and medullary zones that involutes progressively after puberty.", "عضو لمفاوي أولي مفصص ذو منطقتين قشرية ولبية يضمر تدريجيًا بعد البلوغ."),
    physiology: text("Supports T-lymphocyte maturation, positive and negative selection, and establishment of central immune tolerance.", "يدعم نضج الخلايا التائية والانتقاء الإيجابي والسلبي وتكوين التحمل المناعي المركزي."),
    location: text("Anterior superior mediastinum, especially prominent in children.", "المنصف الأمامي العلوي ويكون أوضح عند الأطفال."),
  },
  {
    id: "ANAT_TONSILS",
    en: "Tonsillar ring",
    ar: "حلقة اللوزات",
    anatomy: text("Mucosa-associated lymphoid tissue surrounds the pharyngeal entrance through palatine, pharyngeal and lingual tonsils.", "نسيج لمفاوي مرتبط بالمخاطية يحيط بمدخل البلعوم عبر اللوزتين الحنكيتين والبلعومية واللسانية."),
    physiology: text("Samples inhaled and ingested antigens and helps initiate local mucosal immune responses.", "يأخذ عينات من المستضدات المستنشقة والمبتلعة ويساعد في بدء الاستجابات المناعية المخاطية الموضعية."),
    location: text("Oropharynx and nasopharynx.", "البلعوم الفموي والأنفي."),
  },
];

const reproductiveSeeds: StructureSeed[] = [
  {
    id: "ANAT_REPRODUCTIVE",
    en: "Reproductive system",
    ar: "الجهاز التناسلي",
    latin: "Systema genitale",
    anatomy: text("Reproductive organs include gonads, ducts, accessory glands and external genital structures; anatomy differs by sex while sharing endocrine and developmental principles.", "تشمل الأعضاء التناسلية الغدد التناسلية والقنوات والغدد الملحقة والتراكيب التناسلية الخارجية وتختلف تشريحيًا بحسب الجنس مع اشتراكها في مبادئ صماء ونمائية."),
    physiology: text("The hypothalamic-pituitary-gonadal axis controls gamete production, sex-steroid secretion, reproductive cycles, sexual function and fertility.", "يضبط محور الوطاء والنخامى والغدد التناسلية إنتاج الأمشاج والستيرويدات الجنسية والدورات التناسلية والوظيفة الجنسية والخصوبة."),
    location: text("Pelvis, perineum and external genital region.", "الحوض والعجان والمنطقة التناسلية الخارجية."),
  },
  {
    id: "ANAT_OVARIES",
    en: "Ovaries",
    ar: "المبيضان",
    latin: "Ovaria",
    anatomy: text("Paired gonads containing follicles at different developmental stages within a vascular ovarian stroma.", "غدتان تناسليتان تحتويان جريبات بمراحل نمو مختلفة ضمن سدى مبيضي غني بالتروية."),
    physiology: text("Follicles support oocyte maturation and secrete estradiol; after ovulation the corpus luteum produces progesterone to support the endometrium.", "تدعم الجريبات نضج البويضة وتفرز الإستراديول وبعد الإباضة ينتج الجسم الأصفر البروجسترون لدعم بطانة الرحم."),
    location: text("Lateral pelvic cavity adjacent to the uterus.", "جانبا جوف الحوض بجوار الرحم."),
    bloodSupply: text("Ovarian arteries with uterine-artery anastomoses.", "الشرايين المبيضية مع مفاغرات مع الشريان الرحمي."),
  },
  {
    id: "ANAT_UTERUS",
    en: "Uterus",
    ar: "الرحم",
    latin: "Uterus",
    anatomy: text("A hollow muscular organ composed of fundus, body and cervix with endometrial, myometrial and serosal layers.", "عضو عضلي أجوف يتكون من قاع وجسم وعنق وله طبقات بطانة وعضل ومصلية."),
    physiology: text("The endometrium cycles under ovarian steroids; the myometrium expands during pregnancy and generates coordinated contractions during labor.", "تمر بطانة الرحم بدورات تحت تأثير الستيرويدات المبيضية ويتمدد العضل الرحمي في الحمل ويولد تقلصات منسقة أثناء المخاض."),
    location: text("Midline pelvis between urinary bladder and rectum.", "منتصف الحوض بين المثانة والمستقيم."),
    bloodSupply: text("Uterine arteries with ovarian and vaginal contributions.", "الشرايين الرحمية مع مساهمات مبيضية ومهبلية."),
  },
  {
    id: "ANAT_UTERINE_TUBES",
    en: "Uterine tubes",
    ar: "قناتا الرحم",
    latin: "Tubae uterinae",
    anatomy: text("Ciliated muscular tubes extending from the uterine cornua toward the ovaries through intramural, isthmic, ampullary and infundibular segments.", "قناتان عضليتان مهدبتان تمتدان من قرني الرحم نحو المبيضين عبر أجزاء جدارية وبرخية وأمبولية وقمعية."),
    physiology: text("Ciliary beating and smooth-muscle contractions transport gametes and the early embryo; fertilization most often occurs in the ampulla.", "تنقل حركة الأهداب وتقلصات العضلات الملساء الأمشاج والجنين المبكر ويحدث الإخصاب غالبًا في الأمبولة."),
    location: text("Superior border of the broad ligament.", "الحافة العلوية للرباط العريض."),
  },
  {
    id: "ANAT_TESTES",
    en: "Testes",
    ar: "الخصيتان",
    latin: "Testes",
    anatomy: text("Paired gonads containing seminiferous tubules, Sertoli cells and interstitial Leydig cells within a fibrous tunica albuginea.", "غدتان تناسليتان تضمان الأنابيب المنوية وخلايا سيرتولي وخلايا ليديغ الخلالية داخل غلالة بيضاء ليفية."),
    physiology: text("FSH and intratesticular testosterone support spermatogenesis; LH stimulates Leydig-cell testosterone production.", "يدعم FSH والتستوستيرون داخل الخصية تكوين النطاف بينما يحفز LH خلايا ليديغ على إنتاج التستوستيرون."),
    location: text("Scrotum, outside the abdominopelvic cavity.", "كيس الصفن خارج جوف البطن والحوض."),
    bloodSupply: text("Testicular arteries from the abdominal aorta.", "الشرايين الخصوية من الأبهر البطني."),
  },
  {
    id: "ANAT_EPIDIDYMIS",
    en: "Epididymis",
    ar: "البربخ",
    latin: "Epididymis",
    anatomy: text("A highly coiled duct along the posterior testis divided into head, body and tail.", "قناة شديدة الالتفاف على السطح الخلفي للخصية وتنقسم إلى رأس وجسم وذيل."),
    physiology: text("Sperm undergo functional maturation, membrane remodeling, concentration and storage during epididymal transit.", "تخضع النطاف للنضج الوظيفي وإعادة تشكيل الغشاء والتركيز والتخزين أثناء مرورها في البربخ."),
    location: text("Posterolateral surface of each testis.", "السطح الخلفي الوحشي لكل خصية."),
  },
  {
    id: "ANAT_PROSTATE",
    en: "Prostate gland",
    ar: "غدة البروستاتا",
    latin: "Prostata",
    anatomy: text("A fibromuscular gland surrounding the proximal urethra below the bladder, organized into clinically important zones.", "غدة ليفية عضلية تحيط بالإحليل القريب أسفل المثانة وتنظم إلى مناطق ذات أهمية سريرية."),
    physiology: text("Produces enzyme- and citrate-rich secretions that contribute to seminal fluid and liquefaction after ejaculation.", "تنتج إفرازات غنية بالإنزيمات والسترات تسهم في السائل المنوي وفي تميعه بعد القذف."),
    location: text("Inferior to the urinary bladder, anterior to the rectum.", "أسفل المثانة وأمام المستقيم."),
  },
];

const integumentarySeeds: StructureSeed[] = [
  {
    id: "ANAT_INTEGUMENTARY",
    en: "Integumentary system",
    ar: "الجهاز اللحافي",
    latin: "Systema integumentale",
    anatomy: text("Skin and its appendages form a continuous external organ with epidermal, dermal and subcutaneous compartments.", "يشكل الجلد وملحقاته عضوًا خارجيًا مستمرًا بطبقات بشروية وأدمية وتحت جلدية."),
    physiology: text("Provides barrier defense, thermoregulation, sensation, immune surveillance, vitamin-D synthesis and control of transepidermal water loss.", "يوفر حاجزًا دفاعيًا وتنظيمًا للحرارة والإحساس والمراقبة المناعية وتصنيع فيتامين D وضبط فقد الماء عبر البشرة."),
    location: text("Covers the entire external body surface.", "يغطي كامل السطح الخارجي للجسم."),
  },
  {
    id: "ANAT_EPIDERMIS",
    en: "Epidermis",
    ar: "البشرة",
    latin: "Epidermis",
    anatomy: text("Avascular keratinized stratified squamous epithelium organized into basal, spinous, granular and cornified layers; thick skin also has a lucid layer.", "ظهارة حرشفية مطبقة متقرنة لا وعائية تنظم إلى طبقات قاعدية وشوكية وحبيبية ومتقرنة ويضاف في الجلد السميك طبقة صافية."),
    physiology: text("Keratinocyte differentiation and lipid sealing create the permeability barrier while melanocytes, Langerhans cells and Merkel cells add pigment, immune and sensory functions.", "ينشئ تمايز الخلايا الكيراتينية وإغلاق الدهون حاجز النفاذية بينما تضيف الخلايا الميلانينية ولانغرهانس وميركل وظائف صباغية ومناعية وحسية."),
    location: text("Outermost layer of skin.", "الطبقة الأبعد من الجلد."),
  },
  {
    id: "ANAT_DERMIS",
    en: "Dermis",
    ar: "الأدمة",
    latin: "Dermis",
    anatomy: text("Vascular connective tissue with papillary and reticular layers containing collagen, elastin, nerves, vessels and skin appendages.", "نسيج ضام وعائي ذو طبقتين حليمية وشبكية يحتوي الكولاجين والإيلاستين والأعصاب والأوعية وملحقات الجلد."),
    physiology: text("Provides tensile strength and elasticity, nourishes the epidermis, supports sensation and participates in heat exchange through regulated blood flow.", "يوفر قوة الشد والمرونة ويغذي البشرة ويدعم الإحساس ويسهم في تبادل الحرارة عبر ضبط جريان الدم."),
    location: text("Immediately deep to the epidermis.", "مباشرة تحت البشرة."),
    bloodSupply: text("Superficial and deep cutaneous vascular plexuses.", "ضفيرتان وعائيتان جلديتان سطحية وعميقة."),
  },
  {
    id: "ANAT_HYPODERMIS",
    en: "Hypodermis",
    ar: "النسيج تحت الجلد",
    anatomy: text("Loose connective tissue and adipose lobules anchor skin to deeper fascia while allowing mobility over underlying structures.", "نسيج ضام رخو وفصيصات دهنية تثبت الجلد باللفافة العميقة مع السماح بحركته فوق التراكيب العميقة."),
    physiology: text("Stores energy, cushions mechanical forces, insulates against heat loss and provides a conduit for larger cutaneous vessels and nerves.", "يخزن الطاقة ويمتص القوى الميكانيكية ويعزل ضد فقد الحرارة ويوفر ممرًا للأوعية والأعصاب الجلدية الأكبر."),
    location: text("Between dermis and deep fascia.", "بين الأدمة واللفافة العميقة."),
  },
  {
    id: "ANAT_HAIR_FOLLICLE",
    en: "Hair follicle",
    ar: "جريب الشعر",
    latin: "Folliculus pili",
    anatomy: text("An epidermal invagination surrounding the hair root with a proliferative bulb, dermal papilla and associated arrector pili muscle.", "انغلاف بشروي يحيط بجذر الشعرة ويضم بصيلة تكاثرية وحليمة أدمية وعضلة ناصبة للشعرة."),
    physiology: text("Cycles through anagen, catagen and telogen phases and contributes to protection, tactile sensation and thermoregulatory signaling.", "يمر بدورات النمو والانتقال والراحة ويسهم في الحماية والإحساس اللمسي والإشارات المنظمة للحرارة."),
    location: text("Most skin except palms, soles and selected mucocutaneous regions.", "معظم الجلد باستثناء الراحتين والأخمصين وبعض المناطق المخاطية الجلدية."),
  },
  {
    id: "ANAT_SWEAT_GLAND",
    en: "Eccrine sweat gland",
    ar: "الغدة العرقية المفرزة",
    latin: "Glandula sudorifera eccrina",
    anatomy: text("A coiled tubular gland in the deep dermis or hypodermis with a duct opening directly onto the skin surface.", "غدة أنبوبية ملتفة في الأدمة العميقة أو تحت الجلد ولها قناة تفتح مباشرة على سطح الجلد."),
    physiology: text("Sympathetic cholinergic stimulation drives watery sweat secretion; evaporation is a major mechanism of heat dissipation during thermal stress.", "يحفز التنبيه الودي الكوليني إفراز عرق مائي ويعد تبخره آلية رئيسية لتبديد الحرارة أثناء الإجهاد الحراري."),
    location: text("Widely distributed, especially palms, soles and forehead.", "منتشرة على نطاق واسع وبكثرة في الراحتين والأخمصين والجبهة."),
    innervation: text("Sympathetic cholinergic fibers.", "ألياف ودية كولينية."),
  },
  {
    id: "ANAT_SEBACEOUS_GLAND",
    en: "Sebaceous gland",
    ar: "الغدة الدهنية",
    latin: "Glandula sebacea",
    anatomy: text("A holocrine gland usually emptying into a hair follicle and composed of lipid-filled sebocytes.", "غدة هولوكرينية تصب غالبًا في جريب الشعر وتتكون من خلايا دهنية مملوءة بالليبيدات."),
    physiology: text("Sebum lubricates skin and hair and contributes to the surface lipid film and antimicrobial environment.", "يزلق الزهم الجلد والشعر ويسهم في الطبقة الدهنية السطحية والبيئة المضادة للميكروبات."),
    location: text("Hair-bearing skin, especially face and upper trunk.", "الجلد الحامل للشعر وخصوصًا الوجه وأعلى الجذع."),
  },
];

export const supplementalStructures: AnatomicalStructure[] = [
  ...buildStructures("SYS_SKELETAL", "ANAT_SKELETAL", skeletalSeeds),
  ...buildStructures("SYS_MUSCULAR", "ANAT_MUSCULAR", muscularSeeds),
  ...buildStructures("SYS_ENDOCRINE", "ANAT_ENDOCRINE", endocrineSeeds),
  ...buildStructures("SYS_LYMPHATIC", "ANAT_LYMPHATIC", lymphaticSeeds),
  ...buildStructures("SYS_REPRODUCTIVE", "ANAT_REPRODUCTIVE", reproductiveSeeds),
  ...buildStructures("SYS_INTEGUMENTARY", "ANAT_INTEGUMENTARY", integumentarySeeds),
];

export interface SystemLearningProfile {
  systemId: string;
  overview: LocalizedText;
  anatomyFocus: LocalizedText[];
  physiologyFocus: LocalizedText[];
  mechanisms: Array<{ title: LocalizedText; description: LocalizedText }>;
  regulation: LocalizedText[];
  keyValues: Array<{ label: LocalizedText; value: string; note: LocalizedText }>;
  clinicalLinks: LocalizedText[];
}

const profile = (
  systemId: string,
  overview: LocalizedText,
  anatomyFocus: LocalizedText[],
  physiologyFocus: LocalizedText[],
  mechanisms: SystemLearningProfile["mechanisms"],
  regulation: LocalizedText[],
  keyValues: SystemLearningProfile["keyValues"],
  clinicalLinks: LocalizedText[],
): SystemLearningProfile => ({ systemId, overview, anatomyFocus, physiologyFocus, mechanisms, regulation, keyValues, clinicalLinks });

export const systemLearningProfiles: SystemLearningProfile[] = [
  profile(
    "SYS_CARDIOVASCULAR",
    text("A pressure-flow transport system linking the heart, pulmonary circulation, systemic circulation and microcirculation.", "منظومة نقل تعتمد الضغط والجريان وتربط القلب بالدورتين الرئوية والجهازية والدوران الدقيق."),
    [text("Four chambers, valves and great vessels", "الحجرات الأربع والصمامات والأوعية الكبرى"), text("Coronary circulation and conduction anatomy", "الدوران التاجي وتشريح جهاز التوصيل"), text("Arterial, venous and capillary organization", "تنظيم الشرايين والأوردة والشعيرات")],
    [text("Cardiac cycle and pressure-volume relationships", "الدورة القلبية وعلاقات الضغط والحجم"), text("Electrical excitation and conduction", "الاستثارة الكهربائية والتوصيل"), text("Control of cardiac output and vascular resistance", "ضبط النتاج القلبي والمقاومة الوعائية")],
    [
      { title: text("Cardiac output", "النتاج القلبي"), description: text("Heart rate multiplied by stroke volume; altered by preload, afterload, contractility and autonomic tone.", "يساوي معدل القلب مضروبًا في حجم الضربة ويتغير بالحمل المسبق واللاحق والانقباضية والنغمة الذاتية.") },
      { title: text("Microcirculation", "الدوران الدقيق"), description: text("Hydrostatic and oncotic forces govern fluid exchange while local metabolites regulate arteriolar tone.", "تحكم القوى الهيدروستاتية والأونكوتية تبادل السوائل بينما تضبط المستقلبات الموضعية نغمة الشريينات.") },
    ],
    [text("Baroreceptor reflexes rapidly buffer arterial pressure.", "تعمل منعكسات مستقبلات الضغط على تخفيف تغيرات الضغط الشرياني سريعًا."), text("Renin-angiotensin-aldosterone and renal sodium balance regulate long-term pressure and volume.", "ينظم نظام الرينين-أنجيوتنسين-ألدوستيرون وتوازن الصوديوم الكلوي الضغط والحجم على المدى الطويل.")],
    [
      { label: text("Resting cardiac output", "النتاج القلبي في الراحة"), value: "≈ 5 L/min", note: text("Varies with body size and metabolic demand.", "يختلف حسب حجم الجسم والطلب الاستقلابي.") },
      { label: text("Normal resting heart rate", "معدل القلب الطبيعي في الراحة"), value: "60–100/min", note: text("Adults; context and fitness matter.", "للبالغين مع أهمية السياق واللياقة.") },
    ],
    [text("Heart failure links impaired pump function to neurohormonal compensation and congestion.", "يربط قصور القلب ضعف الضخ بالتعويض العصبي الهرموني والاحتقان."), text("Shock can result from inadequate flow despite different underlying mechanisms.", "قد تنتج الصدمة من جريان غير كاف رغم اختلاف الآليات الأساسية.")],
  ),
  profile(
    "SYS_RESPIRATORY",
    text("A ventilation, diffusion and perfusion system that maintains oxygen uptake, carbon-dioxide elimination and acid-base support.", "منظومة للتهوية والانتشار والإرواء تحافظ على امتصاص الأكسجين وطرح ثاني أكسيد الكربون ودعم التوازن الحمضي القاعدي."),
    [text("Conducting airways and bronchial tree", "الطرق الهوائية الموصلة والشجرة القصبية"), text("Alveolar-capillary membrane", "الغشاء السنخي الشعيري"), text("Pleura, respiratory muscles and pulmonary circulation", "الجنبة وعضلات التنفس والدوران الرئوي")],
    [text("Ventilation mechanics and compliance", "ميكانيكا التهوية والمطاوعة"), text("Gas diffusion and hemoglobin transport", "انتشار الغازات ونقلها بالهيموغلوبين"), text("Ventilation-perfusion matching", "مطابقة التهوية بالإرواء")],
    [{ title: text("Alveolar ventilation", "التهوية السنخية"), description: text("Effective ventilation depends on tidal volume minus dead-space volume, multiplied by respiratory frequency.", "تعتمد التهوية الفعالة على الحجم الجاري مطروحًا منه الحيز الميت ثم مضروبًا في معدل التنفس.") }, { title: text("Oxygen transport", "نقل الأكسجين"), description: text("Most oxygen is carried bound to hemoglobin; saturation changes nonlinearly with oxygen tension.", "ينقل معظم الأكسجين مرتبطًا بالهيموغلوبين وتتغير الإشباعية بشكل غير خطي مع ضغط الأكسجين.") }],
    [text("Medullary respiratory networks generate rhythm and respond to chemoreceptor input.", "تولد شبكات التنفس البصلية الإيقاع وتستجيب لمدخلات المستقبلات الكيميائية."), text("Local hypoxic vasoconstriction helps redirect pulmonary blood flow toward better-ventilated regions.", "يساعد التضيق الوعائي الرئوي الناتج عن نقص الأكسجة على تحويل الدم إلى المناطق الأفضل تهوية.")],
    [{ label: text("Typical adult tidal volume", "الحجم الجاري المعتاد للبالغ"), value: "≈ 500 mL", note: text("At quiet rest; varies by body size.", "في الراحة الهادئة ويختلف حسب حجم الجسم.") }, { label: text("Arterial oxygen saturation", "إشباع الأكسجين الشرياني"), value: "≈ 95–100%", note: text("At sea level in healthy adults.", "عند مستوى البحر لدى البالغين الأصحاء.") }],
    [text("Asthma primarily increases airway resistance through bronchoconstriction and inflammation.", "يزيد الربو أساسًا مقاومة الطرق الهوائية عبر التضيق والالتهاب."), text("Emphysema reduces elastic recoil and effective gas-exchange surface area.", "يقلل النفاخ الارتداد المرن ومساحة التبادل الغازي الفعالة.")],
  ),
  profile(
    "SYS_DIGESTIVE",
    text("A coordinated motility, secretion, digestion, absorption and hepatic-processing system supplied by a specialized splanchnic circulation.", "منظومة منسقة للحركة والإفراز والهضم والامتصاص والمعالجة الكبدية وتغذيها دورة حشوية متخصصة."),
    [text("Wall layers and enteric plexuses", "طبقات الجدار والضفائر المعوية"), text("Stomach, small intestine and colon", "المعدة والأمعاء الدقيقة والقولون"), text("Liver, biliary tree and pancreas", "الكبد والشجرة الصفراوية والبنكرياس")],
    [text("Peristalsis and segmentation", "الحركة الدودية والتجزؤ"), text("Enzymatic digestion and epithelial transport", "الهضم الإنزيمي والنقل الظهاري"), text("Portal circulation and hepatic metabolism", "الدوران البابي والاستقلاب الكبدي")],
    [{ title: text("Enteric control", "التحكم المعوي"), description: text("Myenteric and submucosal circuits coordinate motility, secretion and local blood flow while autonomic input modifies the pattern.", "تنسق الدارات العضلية المعوية وتحت المخاطية الحركة والإفراز والجريان الموضعي بينما تعدلها المدخلات الذاتية.") }, { title: text("Nutrient absorption", "امتصاص المغذيات"), description: text("Carbohydrates and amino acids enter portal blood; most dietary lipids enter lymph as chylomicrons.", "تدخل الكربوهيدرات والأحماض الأمينية الدم البابي بينما تدخل معظم الدهون الغذائية اللمف على هيئة كيلوميكرونات.") }],
    [text("Gastrin, secretin, CCK, incretins and neural reflexes coordinate meal responses.", "ينسق الغاسترين والسيكريتين وCCK والإنكريتين والمنعكسات العصبية الاستجابة للوجبة."), text("The liver buffers nutrient delivery between meals through storage, synthesis and release.", "يوازن الكبد توصيل المغذيات بين الوجبات عبر التخزين والتصنيع والتحرير.")],
    [{ label: text("Small-intestinal length", "طول الأمعاء الدقيقة"), value: "≈ 5–7 m", note: text("Highly variable and measured differently in vivo and postmortem.", "متغير جدًا ويختلف القياس حيًا وبعد الوفاة.") }, { label: text("Portal contribution to liver flow", "مساهمة الوريد البابي في جريان الكبد"), value: "≈ 75%", note: text("Most flow, though hepatic arterial blood supplies more oxygen per volume.", "معظم الجريان مع أن الدم الشرياني الكبدي أغنى بالأكسجين لكل حجم.") }],
    [text("Cirrhosis couples architectural distortion to portal hypertension and impaired synthetic function.", "يربط التشمع اضطراب البنية بفرط ضغط الباب وضعف الوظيفة التصنيعية."), text("Malabsorption may result from mucosal, pancreatic, biliary or motility disorders.", "قد ينتج سوء الامتصاص عن اضطرابات مخاطية أو بنكرياسية أو صفراوية أو حركية.")],
  ),
  profile(
    "SYS_URINARY",
    text("A filtration and transport system that stabilizes extracellular volume, electrolytes, osmolality, acid-base balance and waste excretion.", "منظومة ترشيح ونقل تثبت حجم السائل خارج الخلايا والشوارد والأسمولية والتوازن الحمضي القاعدي وطرح الفضلات."),
    [text("Nephron, glomerulus and renal microcirculation", "النفرون والكبيبة والدوران الكلوي الدقيق"), text("Tubular segments and collecting system", "مقاطع النبيبات والجهاز الجامع"), text("Ureters, bladder and urethra", "الحالبان والمثانة والإحليل")],
    [text("Glomerular filtration", "الترشيح الكبيبي"), text("Tubular reabsorption and secretion", "إعادة الامتصاص والإفراز الأنبوبي"), text("Concentration, dilution and acid excretion", "التركيز والتخفيف وطرح الحمض")],
    [{ title: text("Filtration", "الترشيح"), description: text("Glomerular hydrostatic pressure drives ultrafiltration across a size- and charge-selective barrier.", "يدفع الضغط الهيدروستاتيكي الكبيبي الترشيح الفائق عبر حاجز انتقائي للحجم والشحنة.") }, { title: text("Countercurrent system", "نظام التيار المعاكس"), description: text("Loop-of-Henle transport and medullary blood flow build and preserve the osmotic gradient used by vasopressin-responsive collecting ducts.", "يبني نقل عروة هنلي والجريان الدموي اللبي تدرجًا أسموزيًا وتحافظ عليه القنوات الجامعة المستجيبة للفازوبريسين.") }],
    [text("Renin, aldosterone, vasopressin and natriuretic peptides coordinate volume and sodium balance.", "ينسق الرينين والألدوستيرون والفازوبريسين والببتيدات المدرّة للصوديوم توازن الحجم والصوديوم."), text("Autoregulation stabilizes renal blood flow and filtration across a useful pressure range.", "يحافظ التنظيم الذاتي على جريان الكلية والترشيح ضمن مجال ضغط مفيد.")],
    [{ label: text("Typical GFR", "معدل الرشح الكبيبي المعتاد"), value: "≈ 90–120 mL/min/1.73m²", note: text("Declines with age and varies with clinical context.", "ينخفض مع العمر ويختلف حسب السياق السريري.") }, { label: text("Renal blood flow", "جريان الدم الكلوي"), value: "≈ 20–25% of cardiac output", note: text("High flow supports filtration and homeostasis.", "الجريان المرتفع يدعم الترشيح والاتزان الداخلي.") }],
    [text("Chronic kidney disease affects filtration, endocrine functions, acid-base regulation and volume control.", "يؤثر مرض الكلى المزمن في الترشيح والوظائف الصماء والتوازن الحمضي القاعدي وضبط الحجم."), text("Obstruction can raise upstream pressure and damage renal parenchyma.", "قد يرفع الانسداد الضغط قبل موقعه ويؤذي النسيج الكلوي.")],
  ),
  profile(
    "SYS_NERVOUS",
    text("A rapid information-processing network integrating sensation, movement, cognition, autonomic control and homeostatic behavior.", "شبكة سريعة لمعالجة المعلومات تدمج الإحساس والحركة والإدراك والتحكم الذاتي والسلوك المنظم للاتزان الداخلي."),
    [text("Cerebral cortex, deep nuclei and white matter", "القشرة المخية والنوى العميقة والمادة البيضاء"), text("Brainstem, cerebellum and spinal cord", "جذع الدماغ والمخيخ والحبل الشوكي"), text("Peripheral nerves and sensory receptors", "الأعصاب المحيطية والمستقبلات الحسية")],
    [text("Membrane potentials and action potentials", "جهود الغشاء وجهود الفعل"), text("Synaptic transmission and neural circuits", "النقل المشبكي والدارات العصبية"), text("Sensory coding, motor control and autonomic integration", "الترميز الحسي والتحكم الحركي والتكامل الذاتي")],
    [{ title: text("Action potential", "جهد الفعل"), description: text("Voltage-gated ion channels produce an all-or-none electrical signal that propagates along axons and is accelerated by myelin.", "تولد قنوات الأيونات المعتمدة على الجهد إشارة كهربائية كلية أو معدومة تنتشر على المحاور ويسرعها الميالين.") }, { title: text("Synaptic integration", "التكامل المشبكي"), description: text("Excitatory and inhibitory inputs combine across space and time to determine neuronal output.", "تتجمع المدخلات المنبهة والمثبطة مكانيًا وزمانيًا لتحديد خرج العصبون.") }],
    [text("Local circuits, descending pathways and neuromodulators adjust network gain and behavior.", "تعدل الدارات الموضعية والمسارات النازلة والمعدلات العصبية كسب الشبكات والسلوك."), text("Autonomic reflexes couple visceral sensory input to sympathetic and parasympathetic output.", "تربط المنعكسات الذاتية المدخلات الحشوية بالمخرجات الودية ونظيرة الودية.")],
    [{ label: text("Typical neuron resting potential", "جهد الراحة العصبي المعتاد"), value: "≈ −70 mV", note: text("Varies by cell type and ionic environment.", "يختلف حسب نوع الخلية والبيئة الأيونية.") }, { label: text("Fast myelinated conduction", "التوصيل السريع في الألياف الميالينية"), value: "up to ≈ 120 m/s", note: text("Large myelinated peripheral fibers.", "الألياف المحيطية الكبيرة الميالينية.") }],
    [text("Stroke links vascular territory anatomy to focal neurologic deficits.", "تربط السكتة تشريح الأقاليم الوعائية بالعجز العصبي البؤري."), text("Demyelination reduces conduction reliability and can produce multifocal dysfunction.", "يقلل زوال الميالين موثوقية التوصيل وقد يسبب خللًا متعدد البؤر.")],
  ),
  profile(
    "SYS_MUSCULOSKELETAL",
    text("An integrated mechanical system in which bones, joints, muscles, tendons and neural control convert force into stable movement.", "منظومة ميكانيكية متكاملة تحول فيها العظام والمفاصل والعضلات والأوتار والتحكم العصبي القوة إلى حركة مستقرة."),
    [text("Axial and appendicular framework", "الإطار المحوري والطرفي"), text("Major joints and muscle groups", "المفاصل والمجموعات العضلية الرئيسية"), text("Functional chains linking trunk and limbs", "السلاسل الوظيفية التي تربط الجذع بالأطراف")],
    [text("Lever mechanics and joint torque", "ميكانيكا الروافع وعزم المفصل"), text("Motor-unit recruitment and force-length relationships", "تجنيد الوحدات الحركية وعلاقة القوة بالطول"), text("Proprioception and postural control", "الحس العميق وضبط القوام")],
    [{ title: text("Movement chain", "سلسلة الحركة"), description: text("Muscle force is transmitted through tendons across joints; coordinated agonist, antagonist and stabilizer activity shapes the final movement.", "تنتقل قوة العضلة عبر الأوتار والمفاصل ويشكل التنسيق بين المحركات والمضادات والمثبتات الحركة النهائية.") }, { title: text("Adaptation", "التكيف"), description: text("Bone and muscle remodel in response to mechanical loading, disuse, hormones and nutrition.", "تعيد العظام والعضلات تشكيلها استجابة للحمل الميكانيكي وقلة الاستخدام والهرمونات والتغذية.") }],
    [text("Spinal reflexes and descending motor pathways regulate tone and movement.", "تنظم المنعكسات الشوكية والمسارات الحركية النازلة النغمة والحركة."), text("Mechanical loading and endocrine signals alter bone turnover and muscle protein balance.", "يغير الحمل الميكانيكي والإشارات الصماء دوران العظم وتوازن بروتين العضلة.")],
    [{ label: text("Skeletal muscle share of body mass", "نسبة العضلات الهيكلية من كتلة الجسم"), value: "≈ 30–40%", note: text("Highly dependent on sex, age and training.", "تعتمد بشدة على الجنس والعمر والتدريب.") }, { label: text("Adult bones", "عدد عظام البالغ"), value: "206", note: text("Conventional count; anatomical variants exist.", "العدد التقليدي مع وجود اختلافات تشريحية.") }],
    [text("Osteoarthritis reflects failure of the whole joint organ, not cartilage alone.", "يعكس الفصال العظمي فشل عضو المفصل كاملًا وليس الغضروف وحده."), text("Weakness, pain and altered motor control can reinforce one another after injury.", "قد يعزز الضعف والألم واضطراب التحكم الحركي بعضه بعضًا بعد الإصابة.")],
  ),
  profile(
    "SYS_SKELETAL",
    text("The body's mineralized support framework, combining mechanically optimized bone with joints, cartilage, marrow and connective attachments.", "إطار الدعم المعدني للجسم ويجمع عظمًا محسّنًا ميكانيكيًا مع المفاصل والغضروف والنخاع والارتباطات الضامة."),
    [text("Axial versus appendicular skeleton", "الهيكل المحوري مقابل الطرفي"), text("Cortical versus trabecular architecture", "البنية القشرية مقابل الإسفنجية"), text("Joint types and articular cartilage", "أنواع المفاصل والغضروف المفصلي")],
    [text("Bone remodeling and mineral exchange", "إعادة تشكيل العظم وتبادل المعادن"), text("Mechanotransduction and load adaptation", "التحويل الميكانيكي والتكيف مع الحمل"), text("Marrow hematopoiesis", "تكوين الدم في النخاع")],
    [{ title: text("Bone remodeling", "إعادة تشكيل العظم"), description: text("Osteoclast resorption and osteoblast formation are coupled in multicellular units, renewing bone and adapting it to load.", "يقترن ارتشاف ناقضات العظم ببناء بانيات العظم في وحدات متعددة الخلايا لتجديد العظم وتكييفه مع الحمل.") }, { title: text("Mineral homeostasis", "اتزان المعادن"), description: text("PTH, vitamin D, kidney function and gut absorption coordinate calcium and phosphate balance.", "ينسق هرمون جار الدرق وفيتامين D ووظيفة الكلية وامتصاص الأمعاء توازن الكالسيوم والفوسفات.") }],
    [text("Mechanical strain influences remodeling through osteocyte signaling.", "يؤثر الإجهاد الميكانيكي في إعادة التشكيل عبر إشارات الخلايا العظمية."), text("PTH and vitamin-D pathways couple bone to renal and intestinal mineral handling.", "تربط مسارات هرمون جار الدرق وفيتامين D العظم بالتعامل الكلوي والمعوي مع المعادن.")],
    [{ label: text("Peak bone mass", "ذروة الكتلة العظمية"), value: "late 20s–early 30s", note: text("Approximate; varies by person and skeletal site.", "تقريبي ويختلف حسب الشخص وموقع الهيكل.") }],
    [text("Osteoporosis reflects reduced strength from both low mass and microarchitectural deterioration.", "تعكس هشاشة العظام انخفاض القوة بسبب نقص الكتلة وتدهور البنية المجهرية معًا.")],
  ),
  profile(
    "SYS_MUSCULAR",
    text("The force-generating component of movement, built from excitable fibers whose contractile proteins are controlled by motor neurons and cellular energy systems.", "المكون المولد للقوة في الحركة ويتكون من ألياف قابلة للاستثارة تضبط بروتيناتها الانقباضية العصبونات الحركية وأنظمة الطاقة الخلوية."),
    [text("Fiber, fascicle and tendon organization", "تنظيم الليف والحزمة والوتر"), text("Sarcomere and myofilaments", "الساركومير والخيوط العضلية"), text("Neuromuscular junction and motor unit", "الوصلة العصبية العضلية والوحدة الحركية")],
    [text("Excitation-contraction coupling", "اقتران التنبيه بالانقباض"), text("Force-length and force-velocity behavior", "سلوك القوة مع الطول والسرعة"), text("Aerobic and anaerobic ATP production", "إنتاج ATP الهوائي واللاهوائي")],
    [{ title: text("Cross-bridge cycle", "دورة الجسر العرضي"), description: text("Calcium exposes actin binding sites; myosin uses ATP to repeatedly attach, pivot and detach, generating force.", "يكشف الكالسيوم مواقع ارتباط الأكتين ويستخدم الميوسين ATP للارتباط والدوران والانفصال المتكرر مولدًا القوة.") }, { title: text("Recruitment", "التجنيد"), description: text("Increasing force recruits additional motor units and raises motor-neuron firing frequency.", "تزداد القوة بتجنيد وحدات حركية إضافية ورفع تواتر إطلاق العصبونات الحركية.") }],
    [text("Motor cortex, spinal circuits and proprioceptive feedback shape recruitment patterns.", "تشكل القشرة الحركية والدارات الشوكية والتغذية الراجعة للحس العميق أنماط التجنيد."), text("Training, nutrition and endocrine state influence protein turnover and mitochondrial capacity.", "يؤثر التدريب والتغذية والحالة الصماء في دوران البروتين والقدرة الميتوكندرية.")],
    [{ label: text("Resting skeletal-muscle ATP stores", "مخزون ATP العضلي في الراحة"), value: "seconds", note: text("Immediate ATP is small; phosphocreatine and metabolism rapidly replenish it.", "المخزون المباشر صغير ويجدد الفوسفوكرياتين والاستقلاب ATP سريعًا.") }],
    [text("Neuromuscular transmission disorders can produce weakness despite structurally intact muscle fibers.", "قد تسبب اضطرابات النقل العصبي العضلي ضعفًا رغم سلامة بنية الألياف العضلية.")],
  ),
  profile(
    "SYS_ENDOCRINE",
    text("A distributed chemical signaling network using hormones, receptors and feedback loops to coordinate slow and sustained physiology across organs.", "شبكة كيميائية موزعة تستخدم الهرمونات والمستقبلات وحلقات التغذية الراجعة لتنسيق وظائف بطيئة ومستدامة بين الأعضاء."),
    [text("Hypothalamus-pituitary axes", "محاور تحت المهاد والنخامى"), text("Thyroid, parathyroid and adrenal glands", "الدرق وجارات الدرق والكظر"), text("Pancreatic islets and gonadal endocrine tissue", "جزر البنكرياس والأنسجة الصماء التناسلية")],
    [text("Peptide versus steroid hormone signaling", "إشارات الهرمونات الببتيدية مقابل الستيرويدية"), text("Negative-feedback endocrine axes", "المحاور الصماء ذات التغذية الراجعة السلبية"), text("Metabolic and stress integration", "تكامل الاستقلاب والاستجابة للضغط")],
    [{ title: text("Feedback control", "التحكم بالتغذية الراجعة"), description: text("Target-gland hormones usually suppress upstream hypothalamic and pituitary signals, stabilizing output around a physiologic range.", "تثبط هرمونات الغدة الهدف عادة إشارات الوطاء والنخامى الأعلى فتحافظ على الخرج ضمن مجال فسيولوجي.") }, { title: text("Receptor signaling", "إشارات المستقبلات"), description: text("Peptide hormones typically use membrane receptors and second messengers, whereas steroid and thyroid hormones alter gene transcription through intracellular receptors.", "تستخدم الهرمونات الببتيدية غالبًا مستقبلات غشائية ورسلًا ثانوية بينما تغير الستيرويدات وهرمونات الدرق نسخ الجينات عبر مستقبلات داخلية.") }],
    [text("Circadian rhythms modify cortisol, growth hormone and several metabolic signals.", "تعدل الإيقاعات اليومية الكورتيزول وهرمون النمو وعدة إشارات استقلابية."), text("Glucose, calcium, osmolality and other controlled variables directly influence endocrine secretion.", "يؤثر الغلوكوز والكالسيوم والأسمولية ومتغيرات مضبوطة أخرى مباشرة في الإفراز الصماوي.")],
    [{ label: text("Typical fasting glucose", "الغلوكوز الصائم المعتاد"), value: "≈ 70–99 mg/dL", note: text("Common reference interval; laboratories vary.", "مجال مرجعي شائع وقد يختلف بين المختبرات.") }],
    [text("Primary gland failure and central pituitary/hypothalamic failure produce different hormone patterns.", "ينتج فشل الغدة الأولي وفشل النخامى أو الوطاء المركزي أنماطًا هرمونية مختلفة."), text("Endocrine disease often requires interpreting hormone concentration together with feedback relationships and timing.", "يتطلب فهم المرض الصماوي غالبًا تفسير تركيز الهرمون مع علاقات التغذية الراجعة والتوقيت.")],
  ),
  profile(
    "SYS_LYMPHATIC",
    text("A fluid-return and immune-surveillance network connecting tissue spaces, lymphoid organs and the venous circulation.", "شبكة لإعادة السوائل والمراقبة المناعية تربط الفراغات النسيجية بالأعضاء اللمفاوية والدوران الوريدي."),
    [text("Lymphatic capillaries and collecting vessels", "الشعيرات والأوعية اللمفاوية الجامعة"), text("Regional nodes and central ducts", "العقد الإقليمية والقنوات المركزية"), text("Spleen, thymus and mucosal lymphoid tissue", "الطحال والزعترية والنسيج اللمفاوي المخاطي")],
    [text("Interstitial-fluid return", "إعادة السائل الخلالي"), text("Antigen presentation and lymphocyte activation", "عرض المستضد وتنشيط الخلايا اللمفاوية"), text("Innate-adaptive immune coordination", "تنسيق المناعة الفطرية والتكيفية")],
    [{ title: text("Lymph transport", "نقل اللمف"), description: text("Valves plus skeletal-muscle, respiratory and intrinsic vessel pumping move lymph toward the thoracic venous angles.", "تدفع الصمامات ومضخات العضلات والتنفس والأوعية الذاتية اللمف نحو الزوايا الوريدية الصدرية.") }, { title: text("Adaptive immunity", "المناعة التكيفية"), description: text("Antigen presentation activates selected lymphocyte clones that differentiate into effector and memory populations.", "ينشط عرض المستضد نسائل مختارة من الخلايا اللمفاوية لتتمايز إلى خلايا مؤثرة وذاكرية.") }],
    [text("Chemokines and adhesion molecules guide immune-cell trafficking between blood, tissues and lymphoid organs.", "توجه الكيموكينات وجزيئات الالتصاق حركة الخلايا المناعية بين الدم والأنسجة والأعضاء اللمفاوية."), text("Inflammatory mediators locally alter vascular permeability and leukocyte recruitment.", "تغير وسائط الالتهاب موضعيًا نفاذية الأوعية وتجنيد الكريات البيضاء.")],
    [{ label: text("Interstitial fluid returned as lymph", "السائل الخلالي المعاد كلمف"), value: "≈ 2–4 L/day", note: text("Approximate adult value; varies with activity and filtration.", "قيمة تقريبية للبالغ وتختلف مع النشاط والترشيح.") }],
    [text("Lymphatic obstruction causes protein-rich interstitial edema.", "يسبب انسداد اللمف وذمة خلالية غنية بالبروتين."), text("Splenic dysfunction increases susceptibility to severe infection by encapsulated bacteria.", "يزيد خلل الطحال القابلية للعدوى الشديدة بالجراثيم المكبسلة.")],
  ),
  profile(
    "SYS_REPRODUCTIVE",
    text("A gonadal, ductal and endocrine system supporting gamete production, reproductive cycles, fertilization, pregnancy and sexual function.", "منظومة تناسلية وقنوية وصماء تدعم إنتاج الأمشاج والدورات التناسلية والإخصاب والحمل والوظيفة الجنسية."),
    [text("Gonads and reproductive ducts", "الغدد التناسلية والقنوات"), text("Uterus and accessory glands", "الرحم والغدد الملحقة"), text("Pelvic relationships and vascular supply", "العلاقات الحوضية والتروية الوعائية")],
    [text("Hypothalamic-pituitary-gonadal axis", "محور الوطاء والنخامى والغدد التناسلية"), text("Gametogenesis and steroidogenesis", "تكوين الأمشاج والستيرويدات"), text("Menstrual cycle, fertilization and reproductive transport", "الدورة الشهرية والإخصاب والنقل التناسلي")],
    [{ title: text("HPG axis", "محور HPG"), description: text("Pulsatile GnRH drives LH and FSH secretion; gonadal steroids and inhibins provide feedback to the hypothalamus and pituitary.", "يحرك GnRH النبضي إفراز LH وFSH وتوفر الستيرويدات التناسلية والإنهيبين تغذية راجعة للوطاء والنخامى.") }, { title: text("Gametogenesis", "تكوين الأمشاج"), description: text("Meiosis reduces chromosome number while specialized supporting cells create the hormonal and nutritional environment required for mature gametes.", "يخفض الانقسام المنصف عدد الصبغيات بينما تنشئ الخلايا الداعمة البيئة الهرمونية والغذائية اللازمة لنضج الأمشاج.") }],
    [text("Neuroendocrine pulses and gonadal feedback regulate reproductive timing.", "تنظم النبضات العصبية الصماء والتغذية الراجعة التناسلية توقيت الوظائف التناسلية."), text("Pregnancy introduces placental endocrine control and progressive maternal cardiovascular, renal and respiratory adaptation.", "يضيف الحمل تحكمًا صماويًا مشيميًا وتكيفًا تدريجيًا قلبيًا ووعائيًا وكلويًا وتنفسيا لدى الأم.")],
    [{ label: text("Typical menstrual cycle", "الدورة الشهرية المعتادة"), value: "≈ 21–35 days", note: text("Cycle length is variable; 28 days is only a common teaching example.", "طول الدورة متغير و28 يومًا مثال تعليمي شائع فقط.") }],
    [text("Infertility can arise from gonadal, endocrine, tubal, uterine, ductal or sperm-related factors.", "قد تنتج صعوبة الإنجاب من عوامل تناسلية أو صماء أو أنبوبية أو رحمية أو قنوية أو مرتبطة بالنطاف."), text("Pelvic anatomy is essential for understanding spread of infection, surgery and referred pain.", "تشريح الحوض أساسي لفهم انتشار العدوى والجراحة والألم المحال.")],
  ),
  profile(
    "SYS_INTEGUMENTARY",
    text("The skin is a large sensory, immune and thermoregulatory organ that separates internal physiology from the external environment.", "الجلد عضو حسي ومناعي ومنظم للحرارة يفصل الوظائف الداخلية عن البيئة الخارجية."),
    [text("Epidermis, dermis and hypodermis", "البشرة والأدمة وتحت الجلد"), text("Hair follicles and glands", "جريبات الشعر والغدد"), text("Cutaneous vascular and sensory networks", "الشبكات الوعائية والحسية الجلدية")],
    [text("Barrier formation and water balance", "تكوين الحاجز وتوازن الماء"), text("Thermoregulation by blood flow and sweating", "تنظيم الحرارة بالجريان والعرق"), text("Touch, pain and temperature sensation", "إحساس اللمس والألم والحرارة")],
    [{ title: text("Barrier renewal", "تجدد الحاجز"), description: text("Basal keratinocytes proliferate and differentiate outward, replacing the cornified surface while intercellular lipids reduce water loss.", "تتكاثر الخلايا الكيراتينية القاعدية وتتمايز للخارج لتعوض السطح المتقرن بينما تقلل الدهون بين الخلايا فقد الماء.") }, { title: text("Heat exchange", "تبادل الحرارة"), description: text("Cutaneous vasodilation increases dry heat loss and eccrine sweating adds evaporative cooling.", "يزيد توسع أوعية الجلد فقد الحرارة الجاف ويضيف التعرق المفرز تبريدًا بالتبخر.") }],
    [text("Sympathetic pathways regulate cutaneous vessels and eccrine sweat glands.", "تنظم المسارات الودية أوعية الجلد والغدد العرقية المفرزة."), text("Local inflammatory and immune signals coordinate barrier repair after injury.", "تنسق الإشارات الالتهابية والمناعية الموضعية إصلاح الحاجز بعد الأذية.")],
    [{ label: text("Skin surface area", "مساحة سطح الجلد"), value: "≈ 1.5–2.0 m²", note: text("Approximate adult range and body-size dependent.", "مدى تقريبي للبالغ يعتمد على حجم الجسم.") }],
    [text("Burn depth predicts loss of barrier, fluid, thermal and sensory functions.", "يتنبأ عمق الحرق بفقد وظائف الحاجز والسوائل والحرارة والإحساس."), text("Peripheral neuropathy can reduce protective skin sensation even when the skin itself is intact.", "قد يقلل الاعتلال العصبي المحيطي الإحساس الجلدي الوقائي رغم سلامة الجلد نفسه.")],
  ),
];

const supplementalPathways = [
  ["PHYS_SKELETAL_REMODELING", "SYS_SKELETAL", "Bone remodeling cycle", "دورة إعادة تشكيل العظم", ["ANAT_COMPACT_BONE", "ANAT_TRABECULAR_BONE", "ANAT_BONE_MARROW"]],
  ["PHYS_MUSCLE_CONTRACTION", "SYS_MUSCULAR", "Excitation-contraction pathway", "مسار التنبيه والانقباض", ["ANAT_NEUROMUSCULAR_JUNCTION", "ANAT_MUSCLE_FIBER", "ANAT_SARCOMERE", "ANAT_TENDON"]],
  ["PHYS_ENDOCRINE_AXIS", "SYS_ENDOCRINE", "Hypothalamic-pituitary endocrine axis", "محور الوطاء والنخامى الصماوي", ["ANAT_HYPOTHALAMUS", "ANAT_PITUITARY", "ANAT_THYROID", "ANAT_ADRENALS", "ANAT_PANCREATIC_ISLETS"]],
  ["PHYS_LYMPH_FLOW", "SYS_LYMPHATIC", "Lymph return and immune surveillance", "عودة اللمف والمراقبة المناعية", ["ANAT_LYMPH_CAPILLARIES", "ANAT_LYMPH_VESSELS", "ANAT_LYMPH_NODES", "ANAT_SPLEEN"]],
  ["PHYS_REPRODUCTIVE_AXIS", "SYS_REPRODUCTIVE", "Gonadal endocrine and gamete pathway", "المسار الصماوي التناسلي والأمشاج", ["ANAT_HYPOTHALAMUS", "ANAT_PITUITARY", "ANAT_OVARIES", "ANAT_UTERINE_TUBES", "ANAT_UTERUS"]],
  ["PHYS_SKIN_THERMOREGULATION", "SYS_INTEGUMENTARY", "Skin barrier and thermoregulation", "حاجز الجلد وتنظيم الحرارة", ["ANAT_EPIDERMIS", "ANAT_DERMIS", "ANAT_SWEAT_GLAND", "ANAT_HYPODERMIS"]],
] as const;

const supplementalMap = new Map(supplementalStructures.map((structure) => [structure.id, structure]));

export const supplementalPhysiologyAnimations: PhysiologyAnimation[] = supplementalPathways.map(
  ([id, systemId, en, ar, structureIds]) => ({
    id,
    systemId,
    name: text(en, ar),
    structureIds: [...structureIds],
    duration: 10,
    steps: structureIds.map((structureId, index) => ({
      id: `${id}_${index + 1}`,
      structureId,
      name: supplementalMap.get(structureId)?.name ?? text(structureId, structureId),
      description: text(
        `Stage ${index + 1}: follow ${supplementalMap.get(structureId)?.name.en ?? structureId} as part of the integrated ${en.toLowerCase()} sequence.`,
        `المرحلة ${index + 1}: تتبع ${supplementalMap.get(structureId)?.name.ar ?? structureId} ضمن تسلسل ${ar} المتكامل.`,
      ),
      order: index + 1,
    })),
  }),
);

export function getSystemLearningProfile(systemId: string) {
  return systemLearningProfiles.find((item) => item.systemId === systemId);
}
