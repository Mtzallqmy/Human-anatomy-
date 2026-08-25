-- Generated from the typed cardiovascular MVP datasets.
-- Re-run with: npm run db:seed:render
begin;
insert into public.systems (id, slug, canonical_name, status, is_available, sort_order, metadata) values
  ('SYS_CARDIOVASCULAR', 'cardiovascular', 'Cardiovascular', 'published', true, 0, '{"icon":"heart","accentColor":"#d36d68"}'::jsonb),
  ('SYS_SKELETAL', 'skeletal', 'Skeletal', 'published', false, 1, '{"icon":"bone","accentColor":"#718394"}'::jsonb),
  ('SYS_MUSCULAR', 'muscular', 'Muscular', 'published', false, 2, '{"icon":"activity","accentColor":"#718394"}'::jsonb),
  ('SYS_NERVOUS', 'nervous', 'Nervous', 'published', false, 3, '{"icon":"brain","accentColor":"#718394"}'::jsonb),
  ('SYS_RESPIRATORY', 'respiratory', 'Respiratory', 'published', false, 4, '{"icon":"wind","accentColor":"#718394"}'::jsonb),
  ('SYS_DIGESTIVE', 'digestive', 'Digestive', 'published', false, 5, '{"icon":"circle-dot","accentColor":"#718394"}'::jsonb),
  ('SYS_URINARY', 'urinary', 'Urinary', 'published', false, 6, '{"icon":"droplets","accentColor":"#718394"}'::jsonb),
  ('SYS_ENDOCRINE', 'endocrine', 'Endocrine', 'published', false, 7, '{"icon":"sparkles","accentColor":"#718394"}'::jsonb),
  ('SYS_LYMPHATIC', 'lymphatic', 'Lymphatic', 'published', false, 8, '{"icon":"git-branch","accentColor":"#718394"}'::jsonb),
  ('SYS_REPRODUCTIVE', 'reproductive', 'Reproductive', 'published', false, 9, '{"icon":"circle","accentColor":"#718394"}'::jsonb)
on conflict (id) do nothing;

insert into public.system_translations (system_id, locale, name, description) values
  ('SYS_CARDIOVASCULAR', 'en', 'Cardiovascular', 'The heart, blood vessels, and circulation.'),
  ('SYS_CARDIOVASCULAR', 'ar', 'الجهاز الدوري', 'القلب والأوعية الدموية والدورة الدموية.'),
  ('SYS_SKELETAL', 'en', 'Skeletal', 'Bones, joints, and supporting structures.'),
  ('SYS_SKELETAL', 'ar', 'الجهاز الهيكلي', 'العظام والمفاصل والتراكيب الداعمة.'),
  ('SYS_MUSCULAR', 'en', 'Muscular', 'Skeletal, smooth, and cardiac muscle.'),
  ('SYS_MUSCULAR', 'ar', 'الجهاز العضلي', 'العضلات الهيكلية والملساء والقلبية.'),
  ('SYS_NERVOUS', 'en', 'Nervous', 'Brain, spinal cord, and peripheral nerves.'),
  ('SYS_NERVOUS', 'ar', 'الجهاز العصبي', 'الدماغ والحبل الشوكي والأعصاب المحيطية.'),
  ('SYS_RESPIRATORY', 'en', 'Respiratory', 'Airways, lungs, and gas exchange.'),
  ('SYS_RESPIRATORY', 'ar', 'الجهاز التنفسي', 'الطرق الهوائية والرئتان وتبادل الغازات.'),
  ('SYS_DIGESTIVE', 'en', 'Digestive', 'Digestive tract and accessory organs.'),
  ('SYS_DIGESTIVE', 'ar', 'الجهاز الهضمي', 'القناة الهضمية والأعضاء الملحقة.'),
  ('SYS_URINARY', 'en', 'Urinary', 'Kidneys, ureters, and urinary bladder.'),
  ('SYS_URINARY', 'ar', 'الجهاز البولي', 'الكليتان والحالبان والمثانة البولية.'),
  ('SYS_ENDOCRINE', 'en', 'Endocrine', 'Hormone-producing glands and tissues.'),
  ('SYS_ENDOCRINE', 'ar', 'جهاز الغدد الصماء', 'الغدد والأنسجة المنتجة للهرمونات.'),
  ('SYS_LYMPHATIC', 'en', 'Lymphatic', 'Lymphatic vessels, nodes, and immunity.'),
  ('SYS_LYMPHATIC', 'ar', 'الجهاز اللمفاوي', 'الأوعية والعقد اللمفاوية والمناعة.'),
  ('SYS_REPRODUCTIVE', 'en', 'Reproductive', 'Reproductive organs and development.'),
  ('SYS_REPRODUCTIVE', 'ar', 'الجهاز التناسلي', 'الأعضاء التناسلية وعلم التطور.')
on conflict (system_id, locale) do nothing;

insert into public.anatomical_structures (id, system_id, parent_id, slug, canonical_name, latin_name, status, sort_order, metadata) values
  ('ANAT_HEART', 'SYS_CARDIOVASCULAR', null, 'anat-heart', 'Heart', 'Cor', 'published', 0, '{"labelAnchor":[0,0,0]}'::jsonb),
  ('ANAT_HEART_RA', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-ra', 'Right atrium', 'Atrium dextrum', 'published', 1, '{"labelAnchor":[1.12,0.84,0.2],"studyNumber":3}'::jsonb),
  ('ANAT_HEART_LA', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-la', 'Left atrium', 'Atrium sinistrum', 'published', 2, '{"labelAnchor":[-0.62,0.94,0.05]}'::jsonb),
  ('ANAT_HEART_RV', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-rv', 'Right ventricle', 'Ventriculus dexter', 'published', 3, '{"labelAnchor":[0.72,-0.52,0.6]}'::jsonb),
  ('ANAT_HEART_LV', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-lv', 'Left ventricle', 'Ventriculus sinister', 'published', 4, '{"labelAnchor":[-0.56,-0.72,0.64],"studyNumber":4}'::jsonb),
  ('ANAT_HEART_SEPTUM', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-septum', 'Interventricular septum', 'Septum interventriculare', 'published', 5, '{"labelAnchor":[0.02,-0.24,0.79]}'::jsonb),
  ('ANAT_HEART_AORTA', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-aorta', 'Aorta', 'Aorta', 'published', 6, '{"labelAnchor":[-0.38,1.96,0.08],"studyNumber":1}'::jsonb),
  ('ANAT_HEART_PULMONARY_TRUNK', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-pulmonary-trunk', 'Pulmonary trunk', 'Truncus pulmonalis', 'published', 7, '{"labelAnchor":[0.36,1.54,0.58],"studyNumber":2}'::jsonb),
  ('ANAT_HEART_SVC', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-svc', 'Superior vena cava', 'Vena cava superior', 'published', 8, '{"labelAnchor":[1.08,1.91,-0.05]}'::jsonb),
  ('ANAT_HEART_IVC', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-ivc', 'Inferior vena cava', 'Vena cava inferior', 'published', 9, '{"labelAnchor":[1.11,-1.05,-0.24]}'::jsonb),
  ('ANAT_HEART_TRICUSPID', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-tricuspid', 'Tricuspid valve', 'Valva atrioventricularis dextra', 'published', 10, '{"labelAnchor":[0.8,0.24,0.71]}'::jsonb),
  ('ANAT_HEART_MITRAL', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-mitral', 'Mitral valve', 'Valva atrioventricularis sinistra', 'published', 11, '{"labelAnchor":[-0.55,0.33,0.75]}'::jsonb),
  ('ANAT_HEART_PULMONARY_VALVE', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-pulmonary-valve', 'Pulmonary valve', 'Valva trunci pulmonalis', 'published', 12, '{"labelAnchor":[0.37,0.95,0.72]}'::jsonb),
  ('ANAT_HEART_AORTIC_VALVE', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-aortic-valve', 'Aortic valve', 'Valva aortae', 'published', 13, '{"labelAnchor":[-0.33,0.99,0.49]}'::jsonb),
  ('ANAT_HEART_CORONARY', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'anat-heart-coronary', 'Coronary arteries', 'Arteriae coronariae', 'published', 14, '{"labelAnchor":[-0.14,-0.02,1.18]}'::jsonb)
on conflict (id) do nothing;

insert into public.structure_translations (structure_id, locale, name, description, anatomy, physiology, location, blood_supply, innervation) values
  ('ANAT_HEART', 'en', 'Heart', 'A four-chambered muscular pump that coordinates pulmonary and systemic circulation.', 'The heart occupies the middle mediastinum. Its right and left atria receive venous return, while the ventricles eject blood into the pulmonary trunk and aorta.', 'Rhythmic electrical activation coordinates atrial and ventricular contraction, generating forward flow through the pulmonary and systemic circuits.', 'Middle mediastinum, between the lungs', 'Right and left coronary arteries', 'Sympathetic cardiac nerves and parasympathetic vagal fibers'),
  ('ANAT_HEART', 'ar', 'القلب', 'مضخة عضلية ذات أربع حجرات تنسق بين الدورانين الرئوي والجهازي.', 'يشغل القلب المنصف الأوسط. يستقبل الأذينان الأيمن والأيسر العود الوريدي، بينما يقذف البطينان الدم إلى الجذع الرئوي والأبهر.', 'ينسق التنبيه الكهربائي المنتظم انقباض الأذينين والبطينين مولدًا تدفق الدم باتجاه أمامي في الدورانين الرئوي والجهازي.', 'المنصف الأوسط بين الرئتين', 'الشريانان التاجيان الأيمن والأيسر', 'الأعصاب القلبية الودية وألياف العصب المبهم نظيرة الودية'),
  ('ANAT_HEART_RA', 'en', 'Right atrium', 'A thin-walled chamber that receives systemic venous return from the venae cavae and coronary sinus.', 'A thin-walled chamber that receives systemic venous return from the venae cavae and coronary sinus.', 'Collects deoxygenated blood and transfers it across the tricuspid valve into the right ventricle.', 'Right superior cardiac border', null, null),
  ('ANAT_HEART_RA', 'ar', 'الأذين الأيمن', 'حجرة رقيقة الجدار تستقبل العود الوريدي الجهازي من الوريدين الأجوفين والجيب التاجي.', 'حجرة رقيقة الجدار تستقبل العود الوريدي الجهازي من الوريدين الأجوفين والجيب التاجي.', 'تجمع الدم غير المؤكسج وتنقله عبر الصمام ثلاثي الشرفات إلى البطين الأيمن.', 'الحافة القلبية العلوية اليمنى', null, null),
  ('ANAT_HEART_LA', 'en', 'Left atrium', 'A posterior chamber that receives oxygenated blood through the pulmonary veins.', 'A posterior chamber that receives oxygenated blood through the pulmonary veins.', 'Acts as a reservoir and conduit before filling the left ventricle through the mitral valve.', 'Posterior aspect of the cardiac base', null, null),
  ('ANAT_HEART_LA', 'ar', 'الأذين الأيسر', 'حجرة خلفية تستقبل الدم المؤكسج عبر الأوردة الرئوية.', 'حجرة خلفية تستقبل الدم المؤكسج عبر الأوردة الرئوية.', 'تعمل خزانًا وممرًا للدم قبل ملء البطين الأيسر عبر الصمام التاجي.', 'السطح الخلفي لقاعدة القلب', null, null),
  ('ANAT_HEART_RV', 'en', 'Right ventricle', 'A crescent-shaped ventricular chamber forming much of the anterior cardiac surface.', 'A crescent-shaped ventricular chamber forming much of the anterior cardiac surface.', 'Generates the pressure required to deliver blood to the low-resistance pulmonary circulation.', 'Anterior and inferior cardiac surface', null, null),
  ('ANAT_HEART_RV', 'ar', 'البطين الأيمن', 'حجرة بطينية هلالية الشكل تشكل معظم السطح الأمامي للقلب.', 'حجرة بطينية هلالية الشكل تشكل معظم السطح الأمامي للقلب.', 'تولد الضغط اللازم لإيصال الدم إلى الدوران الرئوي منخفض المقاومة.', 'السطح القلبي الأمامي والسفلي', null, null),
  ('ANAT_HEART_LV', 'en', 'Left ventricle', 'The thick-walled chamber forming the cardiac apex and much of the left diaphragmatic surface.', 'The thick-walled chamber forming the cardiac apex and much of the left diaphragmatic surface.', 'Ejects oxygenated blood through the aortic valve to sustain systemic arterial circulation.', 'Left inferolateral heart and apex', null, null),
  ('ANAT_HEART_LV', 'ar', 'البطين الأيسر', 'حجرة سميكة الجدار تشكل قمة القلب وجزءًا كبيرًا من سطحه الحجابي الأيسر.', 'حجرة سميكة الجدار تشكل قمة القلب وجزءًا كبيرًا من سطحه الحجابي الأيسر.', 'تقذف الدم المؤكسج عبر الصمام الأبهري للمحافظة على الدوران الشرياني الجهازي.', 'الجانب السفلي الوحشي الأيسر للقلب وقمته', null, null),
  ('ANAT_HEART_SEPTUM', 'en', 'Interventricular septum', 'A predominantly muscular partition separating the right and left ventricles, with a small membranous component.', 'A predominantly muscular partition separating the right and left ventricles, with a small membranous component.', 'Maintains separation of pulmonary and systemic flow and contributes to coordinated ventricular contraction.', 'Between the right and left ventricular cavities', null, null),
  ('ANAT_HEART_SEPTUM', 'ar', 'الحاجز بين البطينين', 'حاجز عضلي في معظمه يفصل بين البطينين الأيمن والأيسر ويحتوي جزءًا غشائيًا صغيرًا.', 'حاجز عضلي في معظمه يفصل بين البطينين الأيمن والأيسر ويحتوي جزءًا غشائيًا صغيرًا.', 'يحافظ على فصل الدورانين الرئوي والجهازي ويساهم في انقباض البطينين بصورة متناسقة.', 'بين جوفي البطينين الأيمن والأيسر', null, null),
  ('ANAT_HEART_AORTA', 'en', 'Aorta', 'The largest systemic artery, beginning at the aortic root and continuing as the ascending aorta and arch.', 'The largest systemic artery, beginning at the aortic root and continuing as the ascending aorta and arch.', 'Conducts oxygenated blood from the left ventricle and buffers pulsatile ejection through elastic recoil.', 'Superior mediastinum, arising from the left ventricle', null, null),
  ('ANAT_HEART_AORTA', 'ar', 'الشريان الأبهر', 'أكبر شريان جهازي، يبدأ من جذر الأبهر ويتابع بصفته الأبهر الصاعد ثم القوس الأبهري.', 'أكبر شريان جهازي، يبدأ من جذر الأبهر ويتابع بصفته الأبهر الصاعد ثم القوس الأبهري.', 'ينقل الدم المؤكسج من البطين الأيسر ويخفف نبضات القذف بفضل الارتداد المرن.', 'المنصف العلوي، وينشأ من البطين الأيسر', null, null),
  ('ANAT_HEART_PULMONARY_TRUNK', 'en', 'Pulmonary trunk', 'A great vessel arising from the right ventricle and dividing into the right and left pulmonary arteries.', 'A great vessel arising from the right ventricle and dividing into the right and left pulmonary arteries.', 'Delivers deoxygenated blood to the pulmonary arterial circulation for gas exchange.', 'Anterior and left of the ascending aorta', null, null),
  ('ANAT_HEART_PULMONARY_TRUNK', 'ar', 'الجذع الرئوي', 'وعاء كبير ينشأ من البطين الأيمن وينقسم إلى الشريانين الرئويين الأيمن والأيسر.', 'وعاء كبير ينشأ من البطين الأيمن وينقسم إلى الشريانين الرئويين الأيمن والأيسر.', 'يوصل الدم غير المؤكسج إلى الدوران الشرياني الرئوي لإتمام تبادل الغازات.', 'أمام الأبهر الصاعد وإلى يساره', null, null),
  ('ANAT_HEART_SVC', 'en', 'Superior vena cava', 'A large valveless vein returning blood from the head, neck, upper limbs, and upper thorax.', 'A large valveless vein returning blood from the head, neck, upper limbs, and upper thorax.', 'Channels systemic venous return from the upper body into the right atrium.', 'Right superior mediastinum', null, null),
  ('ANAT_HEART_SVC', 'ar', 'الوريد الأجوف العلوي', 'وريد كبير بلا صمامات يعيد الدم من الرأس والعنق والطرفين العلويين والجزء العلوي من الصدر.', 'وريد كبير بلا صمامات يعيد الدم من الرأس والعنق والطرفين العلويين والجزء العلوي من الصدر.', 'ينقل العود الوريدي الجهازي من الجزء العلوي للجسم إلى الأذين الأيمن.', 'الجهة اليمنى من المنصف العلوي', null, null),
  ('ANAT_HEART_IVC', 'en', 'Inferior vena cava', 'The main venous channel returning blood from the lower body and abdomen to the heart.', 'The main venous channel returning blood from the lower body and abdomen to the heart.', 'Maintains systemic venous return from structures below the diaphragm.', 'Inferior aspect of the right atrium', null, null),
  ('ANAT_HEART_IVC', 'ar', 'الوريد الأجوف السفلي', 'القناة الوريدية الرئيسية التي تعيد الدم من الجزء السفلي للجسم والبطن إلى القلب.', 'القناة الوريدية الرئيسية التي تعيد الدم من الجزء السفلي للجسم والبطن إلى القلب.', 'تحافظ على العود الوريدي الجهازي من التراكيب الواقعة أسفل الحجاب الحاجز.', 'السطح السفلي للأذين الأيمن', null, null),
  ('ANAT_HEART_TRICUSPID', 'en', 'Tricuspid valve', 'The right atrioventricular valve formed by three leaflets supported by chordae tendineae.', 'The right atrioventricular valve formed by three leaflets supported by chordae tendineae.', 'Permits right ventricular filling and prevents regurgitation into the right atrium during systole.', 'Between the right atrium and right ventricle', null, null),
  ('ANAT_HEART_TRICUSPID', 'ar', 'الصمام ثلاثي الشرفات', 'الصمام الأذيني البطيني الأيمن ويتكون من ثلاث شرفات تدعمها الحبال الوترية.', 'الصمام الأذيني البطيني الأيمن ويتكون من ثلاث شرفات تدعمها الحبال الوترية.', 'يسمح بملء البطين الأيمن ويمنع رجوع الدم إلى الأذين الأيمن أثناء الانقباض.', 'بين الأذين الأيمن والبطين الأيمن', null, null),
  ('ANAT_HEART_MITRAL', 'en', 'Mitral valve', 'The left atrioventricular valve with anterior and posterior leaflets tethered to papillary muscles.', 'The left atrioventricular valve with anterior and posterior leaflets tethered to papillary muscles.', 'Directs left ventricular filling and prevents retrograde flow into the left atrium during systole.', 'Between the left atrium and left ventricle', null, null),
  ('ANAT_HEART_MITRAL', 'ar', 'الصمام التاجي', 'الصمام الأذيني البطيني الأيسر ذو شرفتين أمامية وخلفية ترتبطان بالعضلات الحليمية.', 'الصمام الأذيني البطيني الأيسر ذو شرفتين أمامية وخلفية ترتبطان بالعضلات الحليمية.', 'ينظم ملء البطين الأيسر ويمنع ارتجاع الدم إلى الأذين الأيسر أثناء الانقباض.', 'بين الأذين الأيسر والبطين الأيسر', null, null),
  ('ANAT_HEART_PULMONARY_VALVE', 'en', 'Pulmonary valve', 'A semilunar valve with three cusps at the origin of the pulmonary trunk.', 'A semilunar valve with three cusps at the origin of the pulmonary trunk.', 'Opens during right ventricular systole and prevents reverse pulmonary arterial flow during diastole.', 'Right ventricular outflow tract', null, null),
  ('ANAT_HEART_PULMONARY_VALVE', 'ar', 'الصمام الرئوي', 'صمام هلالي له ثلاث شرفات عند منشأ الجذع الرئوي.', 'صمام هلالي له ثلاث شرفات عند منشأ الجذع الرئوي.', 'يفتح أثناء انقباض البطين الأيمن ويمنع رجوع الدم من الشريان الرئوي أثناء الانبساط.', 'مجرى خروج البطين الأيمن', null, null),
  ('ANAT_HEART_AORTIC_VALVE', 'en', 'Aortic valve', 'A semilunar valve with three cusps located between the left ventricular outflow tract and aortic root.', 'A semilunar valve with three cusps located between the left ventricular outflow tract and aortic root.', 'Enables forward systemic ejection while preventing aortic regurgitation in diastole.', 'Aortic root, superior to the left ventricle', null, null),
  ('ANAT_HEART_AORTIC_VALVE', 'ar', 'الصمام الأبهري', 'صمام هلالي ذو ثلاث شرفات يقع بين مجرى خروج البطين الأيسر وجذر الأبهر.', 'صمام هلالي ذو ثلاث شرفات يقع بين مجرى خروج البطين الأيسر وجذر الأبهر.', 'يسمح بقذف الدم نحو الدوران الجهازي ويمنع القلس الأبهري أثناء الانبساط.', 'جذر الأبهر فوق البطين الأيسر', null, null),
  ('ANAT_HEART_CORONARY', 'en', 'Coronary arteries', 'Epicardial arterial branches arising from the aortic root and supplying the myocardium.', 'Epicardial arterial branches arising from the aortic root and supplying the myocardium.', 'Provide myocardial oxygen and nutrients, with most left coronary perfusion occurring during diastole.', 'Epicardial surface and atrioventricular grooves', null, null),
  ('ANAT_HEART_CORONARY', 'ar', 'الشرايين التاجية', 'فروع شريانية فوق تامورية تنشأ من جذر الأبهر وتغذي عضلة القلب.', 'فروع شريانية فوق تامورية تنشأ من جذر الأبهر وتغذي عضلة القلب.', 'تزود عضلة القلب بالأكسجين والمغذيات، وتحدث أغلب تروية التاجي الأيسر أثناء الانبساط.', 'السطح فوق التاموري والأخاديد الأذينية البطينية', null, null)
on conflict (structure_id, locale) do nothing;

insert into public.structure_relations (structure_id, related_structure_id, relation_type) values
  ('ANAT_HEART_RA', 'ANAT_HEART_SVC', 'related'),
  ('ANAT_HEART_RA', 'ANAT_HEART_IVC', 'related'),
  ('ANAT_HEART_RA', 'ANAT_HEART_TRICUSPID', 'related'),
  ('ANAT_HEART_LA', 'ANAT_HEART_MITRAL', 'related'),
  ('ANAT_HEART_LA', 'ANAT_HEART_LV', 'related'),
  ('ANAT_HEART_RV', 'ANAT_HEART_TRICUSPID', 'related'),
  ('ANAT_HEART_RV', 'ANAT_HEART_PULMONARY_VALVE', 'related'),
  ('ANAT_HEART_LV', 'ANAT_HEART_MITRAL', 'related'),
  ('ANAT_HEART_LV', 'ANAT_HEART_AORTIC_VALVE', 'related'),
  ('ANAT_HEART_LV', 'ANAT_HEART_SEPTUM', 'related'),
  ('ANAT_HEART_SEPTUM', 'ANAT_HEART_LV', 'related'),
  ('ANAT_HEART_SEPTUM', 'ANAT_HEART_RV', 'related'),
  ('ANAT_HEART_AORTA', 'ANAT_HEART_AORTIC_VALVE', 'related'),
  ('ANAT_HEART_AORTA', 'ANAT_HEART_LV', 'related'),
  ('ANAT_HEART_PULMONARY_TRUNK', 'ANAT_HEART_RV', 'related'),
  ('ANAT_HEART_PULMONARY_TRUNK', 'ANAT_HEART_PULMONARY_VALVE', 'related'),
  ('ANAT_HEART_SVC', 'ANAT_HEART_RA', 'related'),
  ('ANAT_HEART_IVC', 'ANAT_HEART_RA', 'related'),
  ('ANAT_HEART_TRICUSPID', 'ANAT_HEART_RA', 'related'),
  ('ANAT_HEART_TRICUSPID', 'ANAT_HEART_RV', 'related'),
  ('ANAT_HEART_MITRAL', 'ANAT_HEART_LA', 'related'),
  ('ANAT_HEART_MITRAL', 'ANAT_HEART_LV', 'related'),
  ('ANAT_HEART_PULMONARY_VALVE', 'ANAT_HEART_RV', 'related'),
  ('ANAT_HEART_PULMONARY_VALVE', 'ANAT_HEART_PULMONARY_TRUNK', 'related'),
  ('ANAT_HEART_AORTIC_VALVE', 'ANAT_HEART_LV', 'related'),
  ('ANAT_HEART_AORTIC_VALVE', 'ANAT_HEART_AORTA', 'related'),
  ('ANAT_HEART_CORONARY', 'ANAT_HEART_AORTA', 'related'),
  ('ANAT_HEART_CORONARY', 'ANAT_HEART_LV', 'related')
on conflict (structure_id, related_structure_id, relation_type) do nothing;

insert into public.structure_synonyms (structure_id, locale, synonym) values
  ('ANAT_HEART', 'en', 'Cardiac organ'),
  ('ANAT_HEART', 'ar', 'الفؤاد'),
  ('ANAT_HEART_LV', 'en', 'Left cardiac ventricle'),
  ('ANAT_HEART_LV', 'ar', 'الحجرة البطينية اليسرى'),
  ('ANAT_HEART_AORTA', 'en', 'Main artery'),
  ('ANAT_HEART_AORTA', 'ar', 'الشريان الأورطي')
on conflict (structure_id, locale, synonym) do nothing;

insert into public.physiology_topics (id, slug, canonical_name, status, sort_order, visual_config) values
  ('PHYS_BLOOD_FLOW', 'blood-flow', 'Blood flow', 'published', 0, '{"animationPreset":"cardiovascular-blood-flow"}'::jsonb),
  ('PHYS_CARDIAC_CYCLE', 'cardiac-cycle', 'Cardiac cycle', 'published', 1, '{"animationPreset":"cardiac-cycle"}'::jsonb),
  ('PHYS_ELECTRICAL_CONDUCTION', 'electrical-conduction', 'Electrical conduction', 'published', 2, '{"animationPreset":"electrical-conduction"}'::jsonb)
on conflict (id) do nothing;

insert into public.physiology_translations (physiology_topic_id, locale, name, summary, mechanism) values
  ('PHYS_BLOOD_FLOW', 'en', 'Blood flow', 'Movement of deoxygenated and oxygenated blood through the chambers, valves, lungs, and systemic circulation.', 'Pressure gradients generated by cardiac contraction move blood in one direction through competent valves.'),
  ('PHYS_BLOOD_FLOW', 'ar', 'تدفق الدم', 'حركة الدم غير المؤكسج والمؤكسج عبر الحجرات والصمامات والرئتين والدورة الجهازية.', 'تنقل فروق الضغط الناتجة عن انقباض القلب الدم في اتجاه واحد عبر صمامات سليمة.'),
  ('PHYS_CARDIAC_CYCLE', 'en', 'Cardiac cycle', 'The coordinated sequence of ventricular filling, contraction, ejection, and relaxation.', 'Electrical activation and pressure changes coordinate chamber contraction with valve opening and closure.'),
  ('PHYS_CARDIAC_CYCLE', 'ar', 'الدورة القلبية', 'التتابع المنسق لامتلاء البطينين وانقباضهما وقذف الدم وارتخائهما.', 'ينسق التنبيه الكهربائي وتغيرات الضغط انقباض الحجرات مع فتح الصمامات وإغلاقها.'),
  ('PHYS_ELECTRICAL_CONDUCTION', 'en', 'Electrical conduction', 'Ordered propagation of electrical activity that initiates atrial and ventricular contraction.', 'Impulse formation in the sinoatrial node is followed by atrioventricular delay and rapid ventricular conduction.'),
  ('PHYS_ELECTRICAL_CONDUCTION', 'ar', 'التوصيل الكهربائي', 'انتشار منظم للنشاط الكهربائي يبدأ انقباض الأذينين والبطينين.', 'يتبع تولد النبضة في العقدة الجيبية تأخير أذيني بطيني ثم توصيل بطيني سريع.')
on conflict (physiology_topic_id, locale) do nothing;

insert into public.structure_physiology (structure_id, physiology_topic_id, sort_order) values
  ('ANAT_HEART', 'PHYS_BLOOD_FLOW', 0),
  ('ANAT_HEART_RA', 'PHYS_BLOOD_FLOW', 1),
  ('ANAT_HEART_LA', 'PHYS_BLOOD_FLOW', 2),
  ('ANAT_HEART_RV', 'PHYS_BLOOD_FLOW', 3),
  ('ANAT_HEART_LV', 'PHYS_BLOOD_FLOW', 4),
  ('ANAT_HEART_SEPTUM', 'PHYS_BLOOD_FLOW', 5),
  ('ANAT_HEART_AORTA', 'PHYS_BLOOD_FLOW', 6),
  ('ANAT_HEART_PULMONARY_TRUNK', 'PHYS_BLOOD_FLOW', 7),
  ('ANAT_HEART_SVC', 'PHYS_BLOOD_FLOW', 8),
  ('ANAT_HEART_IVC', 'PHYS_BLOOD_FLOW', 9),
  ('ANAT_HEART_TRICUSPID', 'PHYS_BLOOD_FLOW', 10),
  ('ANAT_HEART_MITRAL', 'PHYS_BLOOD_FLOW', 11),
  ('ANAT_HEART_PULMONARY_VALVE', 'PHYS_BLOOD_FLOW', 12),
  ('ANAT_HEART_AORTIC_VALVE', 'PHYS_BLOOD_FLOW', 13),
  ('ANAT_HEART_CORONARY', 'PHYS_BLOOD_FLOW', 14),
  ('ANAT_HEART', 'PHYS_CARDIAC_CYCLE', 100),
  ('ANAT_HEART_RA', 'PHYS_CARDIAC_CYCLE', 101),
  ('ANAT_HEART_LA', 'PHYS_CARDIAC_CYCLE', 102),
  ('ANAT_HEART_RV', 'PHYS_CARDIAC_CYCLE', 103),
  ('ANAT_HEART_LV', 'PHYS_CARDIAC_CYCLE', 104),
  ('ANAT_HEART_TRICUSPID', 'PHYS_CARDIAC_CYCLE', 105),
  ('ANAT_HEART_MITRAL', 'PHYS_CARDIAC_CYCLE', 106),
  ('ANAT_HEART_PULMONARY_VALVE', 'PHYS_CARDIAC_CYCLE', 107),
  ('ANAT_HEART_AORTIC_VALVE', 'PHYS_CARDIAC_CYCLE', 108),
  ('ANAT_HEART', 'PHYS_ELECTRICAL_CONDUCTION', 200),
  ('ANAT_HEART_RA', 'PHYS_ELECTRICAL_CONDUCTION', 201),
  ('ANAT_HEART_LA', 'PHYS_ELECTRICAL_CONDUCTION', 202),
  ('ANAT_HEART_RV', 'PHYS_ELECTRICAL_CONDUCTION', 203),
  ('ANAT_HEART_LV', 'PHYS_ELECTRICAL_CONDUCTION', 204),
  ('ANAT_HEART_SEPTUM', 'PHYS_ELECTRICAL_CONDUCTION', 205)
on conflict (structure_id, physiology_topic_id) do nothing;

insert into public.diseases (id, slug, canonical_name, status) values
  ('DIS_ATHEROSCLEROSIS', 'dis-atherosclerosis', 'Atherosclerosis', 'published'),
  ('DIS_MYOCARDIAL_INFARCTION', 'dis-myocardial-infarction', 'Myocardial infarction', 'published'),
  ('DIS_AORTIC_STENOSIS', 'dis-aortic-stenosis', 'Aortic stenosis', 'published'),
  ('DIS_CARDIAC_HYPERTROPHY', 'dis-cardiac-hypertrophy', 'Cardiac hypertrophy', 'published')
on conflict (id) do nothing;

insert into public.disease_translations (disease_id, locale, name, summary, etiology, pathogenesis, morphology, functional_effects) values
  ('DIS_ATHEROSCLEROSIS', 'en', 'Atherosclerosis', 'A chronic arterial wall process in which lipid-rich inflammatory plaques narrow the vessel lumen.', 'Associated with dyslipidemia, elevated blood pressure, smoking, diabetes, and age.', 'Endothelial dysfunction permits lipid entry, inflammatory cell recruitment, and fibrous plaque formation.', 'Raised intimal plaques may contain a lipid core, fibrous cap, calcification, and superimposed thrombus.', 'Progressive luminal narrowing can reduce coronary perfusion and increase the risk of acute thrombosis.'),
  ('DIS_ATHEROSCLEROSIS', 'ar', 'تصلب الشرايين', 'عملية مزمنة في جدار الشرايين تتشكل فيها لويحات التهابية غنية بالشحوم فتضيق لمعة الوعاء.', 'يرتبط باضطراب شحوم الدم وارتفاع الضغط والتدخين والسكري والتقدم في العمر.', 'يسمح خلل البطانة بدخول الشحوم واستقدام الخلايا الالتهابية وتشكّل اللويحة الليفية.', 'قد تحتوي اللويحات المرتفعة في الطبقة الباطنة على لب شحمي وغطاء ليفي وتكلس وخثرة إضافية.', 'قد ينقص التضيق التدريجي للمعة تروية الشرايين التاجية ويرفع خطر الخثار الحاد.'),
  ('DIS_MYOCARDIAL_INFARCTION', 'en', 'Myocardial infarction', 'Ischemic death of myocardial tissue following a critical reduction in coronary blood supply.', 'Most commonly follows acute coronary thrombosis over a disrupted atherosclerotic plaque.', 'Sustained ischemia disrupts cellular metabolism, causes irreversible myocyte injury, and initiates inflammation.', 'The involved territory evolves from acute coagulative necrosis to granulation tissue and a mature scar.', 'Regional contractile failure can reduce cardiac output and predispose to arrhythmia.'),
  ('DIS_MYOCARDIAL_INFARCTION', 'ar', 'احتشاء عضلة القلب', 'موت إقفاري لنسيج عضلة القلب يحدث بعد انخفاض حرج في إمداد الدم التاجي.', 'ينجم غالبًا عن خثار تاجي حاد فوق لويحة تصلب شرياني متأذية.', 'يعطل الإقفار المستمر الاستقلاب الخلوي ويسبب أذية غير عكوسة للخلايا العضلية ثم يبدأ الالتهاب.', 'تتطور المنطقة المصابة من نخر تخثري حاد إلى نسيج حبيبي ثم ندبة ناضجة.', 'قد ينقص فشل الانقباض الموضعي النتاج القلبي ويهيئ لاضطرابات النظم.'),
  ('DIS_AORTIC_STENOSIS', 'en', 'Aortic stenosis', 'Narrowing of the aortic valve opening that impedes left ventricular outflow.', 'Often associated with progressive valvular calcification or congenital bicuspid valve anatomy.', 'Leaflet fibrosis and calcification restrict cusp excursion, increasing the systolic pressure gradient.', 'Thickened, calcified cusps surround a progressively reduced valvular orifice.', 'Pressure overload can provoke left ventricular hypertrophy and reduced exercise tolerance.'),
  ('DIS_AORTIC_STENOSIS', 'ar', 'تضيق الصمام الأبهري', 'تضيق في فتحة الصمام الأبهري يعيق خروج الدم من البطين الأيسر.', 'يرتبط غالبًا بالتكلس الصمامي التدريجي أو بوجود صمام أبهري خلقي ثنائي الشرفات.', 'يحد تليف الشرفات وتكلسها من حركتها ويرفع فرق الضغط الانقباضي عبر الصمام.', 'تحيط شرفات سميكة ومتكلسة بفتحة صمامية تتناقص تدريجيًا.', 'قد يسبب الحمل الضغطي تضخم البطين الأيسر وتراجع تحمل الجهد.'),
  ('DIS_CARDIAC_HYPERTROPHY', 'en', 'Cardiac hypertrophy', 'Adaptive or pathological enlargement of cardiomyocytes resulting in increased myocardial mass.', 'Can arise from chronic pressure overload, valvular disease, inherited conditions, or sustained training.', 'Mechanical and neurohormonal signals stimulate myocyte growth and remodeling of the extracellular matrix.', 'Ventricular walls thicken, and the chamber geometry can remodel according to the dominant load.', 'Increased stiffness may impair diastolic filling and raise myocardial oxygen demand.'),
  ('DIS_CARDIAC_HYPERTROPHY', 'ar', 'تضخم عضلة القلب', 'تضخم تكيفي أو مرضي في الخلايا العضلية القلبية يؤدي إلى زيادة كتلة العضلة القلبية.', 'قد ينشأ عن الحمل الضغطي المزمن أو أمراض الصمامات أو الحالات الوراثية أو التدريب المستمر.', 'تحرض الإشارات الميكانيكية والعصبية الهرمونية نمو الخلايا العضلية وإعادة تشكيل المصفوفة خارج الخلوية.', 'تزداد سماكة جدران البطين وقد يعاد تشكيل هندسة الحجرة بحسب نوع الحمل المسيطر.', 'قد تضعف زيادة الصلابة الامتلاء الانبساطي وترفع حاجة العضلة القلبية إلى الأكسجين.')
on conflict (disease_id, locale) do nothing;

insert into public.disease_structures (disease_id, structure_id, is_primary) values
  ('DIS_ATHEROSCLEROSIS', 'ANAT_HEART_CORONARY', true),
  ('DIS_ATHEROSCLEROSIS', 'ANAT_HEART_AORTA', false),
  ('DIS_MYOCARDIAL_INFARCTION', 'ANAT_HEART_LV', true),
  ('DIS_MYOCARDIAL_INFARCTION', 'ANAT_HEART_RV', false),
  ('DIS_MYOCARDIAL_INFARCTION', 'ANAT_HEART_CORONARY', false),
  ('DIS_AORTIC_STENOSIS', 'ANAT_HEART_AORTIC_VALVE', true),
  ('DIS_AORTIC_STENOSIS', 'ANAT_HEART_LV', false),
  ('DIS_AORTIC_STENOSIS', 'ANAT_HEART_AORTA', false),
  ('DIS_CARDIAC_HYPERTROPHY', 'ANAT_HEART_LV', true),
  ('DIS_CARDIAC_HYPERTROPHY', 'ANAT_HEART_SEPTUM', false)
on conflict (disease_id, structure_id) do nothing;

insert into public.disease_stages (id, disease_id, stage_order, progress_min, progress_max, visual_config) values
  ('DIS_ATHEROSCLEROSIS_HEALTHY', 'DIS_ATHEROSCLEROSIS', 0, 0, 0.12, '{}'::jsonb),
  ('DIS_ATHEROSCLEROSIS_EARLY', 'DIS_ATHEROSCLEROSIS', 1, 0.001, 0.333, '{"materialPreset":"early-disease","color":"#dfa66a"}'::jsonb),
  ('DIS_ATHEROSCLEROSIS_MODERATE', 'DIS_ATHEROSCLEROSIS', 2, 0.334, 0.667, '{"materialPreset":"moderate-disease","color":"#dfa66a"}'::jsonb),
  ('DIS_ATHEROSCLEROSIS_ADVANCED', 'DIS_ATHEROSCLEROSIS', 3, 0.668, 1, '{"materialPreset":"advanced-disease","morphTarget":"diseaseSeverity","color":"#dfa66a"}'::jsonb),
  ('DIS_MYOCARDIAL_INFARCTION_HEALTHY', 'DIS_MYOCARDIAL_INFARCTION', 0, 0, 0.12, '{}'::jsonb),
  ('DIS_MYOCARDIAL_INFARCTION_EARLY', 'DIS_MYOCARDIAL_INFARCTION', 1, 0.001, 0.333, '{"materialPreset":"early-disease","color":"#a988c1"}'::jsonb),
  ('DIS_MYOCARDIAL_INFARCTION_MODERATE', 'DIS_MYOCARDIAL_INFARCTION', 2, 0.334, 0.667, '{"materialPreset":"moderate-disease","color":"#a988c1"}'::jsonb),
  ('DIS_MYOCARDIAL_INFARCTION_ADVANCED', 'DIS_MYOCARDIAL_INFARCTION', 3, 0.668, 1, '{"materialPreset":"advanced-disease","morphTarget":"diseaseSeverity","color":"#a988c1"}'::jsonb),
  ('DIS_AORTIC_STENOSIS_HEALTHY', 'DIS_AORTIC_STENOSIS', 0, 0, 0.12, '{}'::jsonb),
  ('DIS_AORTIC_STENOSIS_EARLY', 'DIS_AORTIC_STENOSIS', 1, 0.001, 0.333, '{"materialPreset":"early-disease","color":"#d9bc79"}'::jsonb),
  ('DIS_AORTIC_STENOSIS_MODERATE', 'DIS_AORTIC_STENOSIS', 2, 0.334, 0.667, '{"materialPreset":"moderate-disease","color":"#d9bc79"}'::jsonb),
  ('DIS_AORTIC_STENOSIS_ADVANCED', 'DIS_AORTIC_STENOSIS', 3, 0.668, 1, '{"materialPreset":"advanced-disease","morphTarget":"diseaseSeverity","color":"#d9bc79"}'::jsonb),
  ('DIS_CARDIAC_HYPERTROPHY_HEALTHY', 'DIS_CARDIAC_HYPERTROPHY', 0, 0, 0.12, '{}'::jsonb),
  ('DIS_CARDIAC_HYPERTROPHY_EARLY', 'DIS_CARDIAC_HYPERTROPHY', 1, 0.001, 0.333, '{"materialPreset":"early-disease","color":"#dd8471","scaleMultiplier":0.05}'::jsonb),
  ('DIS_CARDIAC_HYPERTROPHY_MODERATE', 'DIS_CARDIAC_HYPERTROPHY', 2, 0.334, 0.667, '{"materialPreset":"moderate-disease","color":"#dd8471","scaleMultiplier":0.09}'::jsonb),
  ('DIS_CARDIAC_HYPERTROPHY_ADVANCED', 'DIS_CARDIAC_HYPERTROPHY', 3, 0.668, 1, '{"materialPreset":"advanced-disease","morphTarget":"diseaseSeverity","color":"#dd8471","scaleMultiplier":0.13}'::jsonb)
on conflict (id) do nothing;

insert into public.disease_stage_translations (disease_stage_id, locale, name, description) values
  ('DIS_ATHEROSCLEROSIS_HEALTHY', 'en', 'Healthy', 'Preserved normal structure and function.'),
  ('DIS_ATHEROSCLEROSIS_HEALTHY', 'ar', 'سليم', 'بنية ووظيفة طبيعيتان محفوظتان.'),
  ('DIS_ATHEROSCLEROSIS_EARLY', 'en', 'Early', 'Small lipid deposits develop in the arterial intima.'),
  ('DIS_ATHEROSCLEROSIS_EARLY', 'ar', 'مبكر', 'تظهر ترسبات شحمية صغيرة في بطانة الشريان.'),
  ('DIS_ATHEROSCLEROSIS_MODERATE', 'en', 'Moderate', 'A growing plaque narrows the lumen and impairs flow reserve.'),
  ('DIS_ATHEROSCLEROSIS_MODERATE', 'ar', 'متوسط', 'تضيق اللويحة المتنامية اللمعة وتضعف احتياطي التدفق.'),
  ('DIS_ATHEROSCLEROSIS_ADVANCED', 'en', 'Advanced', 'A complex plaque may critically obstruct flow or rupture.'),
  ('DIS_ATHEROSCLEROSIS_ADVANCED', 'ar', 'متقدم', 'قد تعيق اللويحة المعقدة التدفق بشدة أو تتعرض للتمزق.'),
  ('DIS_MYOCARDIAL_INFARCTION_HEALTHY', 'en', 'Healthy', 'Preserved normal structure and function.'),
  ('DIS_MYOCARDIAL_INFARCTION_HEALTHY', 'ar', 'سليم', 'بنية ووظيفة طبيعيتان محفوظتان.'),
  ('DIS_MYOCARDIAL_INFARCTION_EARLY', 'en', 'Early', 'Perfusion falls and reversible ischemia begins.'),
  ('DIS_MYOCARDIAL_INFARCTION_EARLY', 'ar', 'مبكر', 'تنخفض التروية ويبدأ إقفار قابل للعكس.'),
  ('DIS_MYOCARDIAL_INFARCTION_MODERATE', 'en', 'Moderate', 'Myocardial injury spreads within the affected vascular territory.'),
  ('DIS_MYOCARDIAL_INFARCTION_MODERATE', 'ar', 'متوسط', 'تمتد أذية العضلة القلبية ضمن منطقة الوعاء المصاب.'),
  ('DIS_MYOCARDIAL_INFARCTION_ADVANCED', 'en', 'Advanced', 'Irreversible necrosis and impaired regional contraction become established.'),
  ('DIS_MYOCARDIAL_INFARCTION_ADVANCED', 'ar', 'متقدم', 'يترسخ النخر غير العكوس وضعف الانقباض الموضعي.'),
  ('DIS_AORTIC_STENOSIS_HEALTHY', 'en', 'Healthy', 'Preserved normal structure and function.'),
  ('DIS_AORTIC_STENOSIS_HEALTHY', 'ar', 'سليم', 'بنية ووظيفة طبيعيتان محفوظتان.'),
  ('DIS_AORTIC_STENOSIS_EARLY', 'en', 'Early', 'Mild cusp thickening appears without substantial obstruction.'),
  ('DIS_AORTIC_STENOSIS_EARLY', 'ar', 'مبكر', 'تظهر سماكة خفيفة في الشرفات من دون انسداد مهم.'),
  ('DIS_AORTIC_STENOSIS_MODERATE', 'en', 'Moderate', 'Reduced leaflet mobility creates a measurable outflow gradient.'),
  ('DIS_AORTIC_STENOSIS_MODERATE', 'ar', 'متوسط', 'تؤدي محدودية حركة الشرفات إلى ظهور فرق ضغط واضح في مجرى الخروج.'),
  ('DIS_AORTIC_STENOSIS_ADVANCED', 'en', 'Advanced', 'Severe narrowing produces major left ventricular pressure overload.'),
  ('DIS_AORTIC_STENOSIS_ADVANCED', 'ar', 'متقدم', 'يسبب التضيق الشديد حملاً ضغطيًا كبيرًا على البطين الأيسر.'),
  ('DIS_CARDIAC_HYPERTROPHY_HEALTHY', 'en', 'Healthy', 'Preserved normal structure and function.'),
  ('DIS_CARDIAC_HYPERTROPHY_HEALTHY', 'ar', 'سليم', 'بنية ووظيفة طبيعيتان محفوظتان.'),
  ('DIS_CARDIAC_HYPERTROPHY_EARLY', 'en', 'Early', 'Subtle myocyte enlargement begins as an adaptive response.'),
  ('DIS_CARDIAC_HYPERTROPHY_EARLY', 'ar', 'مبكر', 'يبدأ تضخم بسيط في الخلايا العضلية بوصفه استجابة تكيفية.'),
  ('DIS_CARDIAC_HYPERTROPHY_MODERATE', 'en', 'Moderate', 'Ventricular wall thickening becomes visible and compliance decreases.'),
  ('DIS_CARDIAC_HYPERTROPHY_MODERATE', 'ar', 'متوسط', 'تصبح سماكة جدار البطين واضحة وتتراجع المطاوعة.'),
  ('DIS_CARDIAC_HYPERTROPHY_ADVANCED', 'en', 'Advanced', 'Marked remodeling may compromise filling and increase electrical instability.'),
  ('DIS_CARDIAC_HYPERTROPHY_ADVANCED', 'ar', 'متقدم', 'قد يضعف تبدل البنية الشديد الامتلاء ويرفع احتمال عدم الاستقرار الكهربائي.')
on conflict (disease_stage_id, locale) do nothing;

insert into public.references (id, title, authors, publisher, edition, publication_year, doi, pmid, url, reference_type, status) values
  ('REF_FIPAT_TA2', 'Terminologia Anatomica: International Anatomical Terminology', array['Federative International Programme for Anatomical Terminology']::text[], 'FIPAT', '2nd edition', 2019, null, null, 'https://ifaa.unifr.ch/Public/EntryPage/HomePublicNew.html', 'terminology', 'published'),
  ('REF_GRAYS_ANATOMY', 'Gray''s Anatomy: The Anatomical Basis of Clinical Practice', array['Susan Standring']::text[], 'Elsevier', '42nd edition', 2020, null, null, null, 'anatomy', 'published'),
  ('REF_GUYTON_HALL', 'Guyton and Hall Textbook of Medical Physiology', array['John E. Hall', 'Michael E. Hall']::text[], 'Elsevier', '14th edition', 2020, null, null, null, 'physiology', 'published'),
  ('REF_ROBBINS_COTRAN', 'Robbins & Cotran Pathologic Basis of Disease', array['Vinay Kumar', 'Abul K. Abbas', 'Jon C. Aster']::text[], 'Elsevier', '10th edition', 2020, null, null, null, 'pathology', 'published')
on conflict (id) do nothing;

insert into public.structure_references (structure_id, reference_id, section_key) values
  ('ANAT_HEART', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_RA', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_RA', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_RA', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_LA', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_LA', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_LA', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_RV', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_RV', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_RV', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_LV', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_LV', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_LV', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_SEPTUM', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_SEPTUM', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_SEPTUM', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_AORTA', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_AORTA', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_AORTA', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_PULMONARY_TRUNK', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_PULMONARY_TRUNK', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_PULMONARY_TRUNK', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_SVC', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_SVC', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_SVC', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_IVC', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_IVC', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_IVC', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_TRICUSPID', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_TRICUSPID', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_TRICUSPID', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_MITRAL', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_MITRAL', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_MITRAL', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_PULMONARY_VALVE', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_PULMONARY_VALVE', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_PULMONARY_VALVE', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_AORTIC_VALVE', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_AORTIC_VALVE', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_AORTIC_VALVE', 'REF_GUYTON_HALL', 'general'),
  ('ANAT_HEART_CORONARY', 'REF_FIPAT_TA2', 'general'),
  ('ANAT_HEART_CORONARY', 'REF_GRAYS_ANATOMY', 'general'),
  ('ANAT_HEART_CORONARY', 'REF_GUYTON_HALL', 'general')
on conflict (structure_id, reference_id, section_key) do nothing;

insert into public.disease_references (disease_id, reference_id, section_key) values
  ('DIS_ATHEROSCLEROSIS', 'REF_ROBBINS_COTRAN', 'general'),
  ('DIS_ATHEROSCLEROSIS', 'REF_GRAYS_ANATOMY', 'general'),
  ('DIS_MYOCARDIAL_INFARCTION', 'REF_ROBBINS_COTRAN', 'general'),
  ('DIS_MYOCARDIAL_INFARCTION', 'REF_GUYTON_HALL', 'general'),
  ('DIS_AORTIC_STENOSIS', 'REF_ROBBINS_COTRAN', 'general'),
  ('DIS_AORTIC_STENOSIS', 'REF_GUYTON_HALL', 'general'),
  ('DIS_CARDIAC_HYPERTROPHY', 'REF_ROBBINS_COTRAN', 'general'),
  ('DIS_CARDIAC_HYPERTROPHY', 'REF_GUYTON_HALL', 'general')
on conflict (disease_id, reference_id, section_key) do nothing;

insert into public.physiology_references (physiology_topic_id, reference_id, section_key) values
  ('PHYS_BLOOD_FLOW', 'REF_GUYTON_HALL', 'general'),
  ('PHYS_BLOOD_FLOW', 'REF_GRAYS_ANATOMY', 'general'),
  ('PHYS_CARDIAC_CYCLE', 'REF_GUYTON_HALL', 'general'),
  ('PHYS_CARDIAC_CYCLE', 'REF_GRAYS_ANATOMY', 'general'),
  ('PHYS_ELECTRICAL_CONDUCTION', 'REF_GUYTON_HALL', 'general'),
  ('PHYS_ELECTRICAL_CONDUCTION', 'REF_GRAYS_ANATOMY', 'general')
on conflict (physiology_topic_id, reference_id, section_key) do nothing;

insert into public.three_d_assets (id, system_id, root_structure_id, name, asset_type, format, version, license, attribution, status, metadata) values
  ('00000000-0000-4000-8000-000000000101', 'SYS_CARDIOVASCULAR', 'ANAT_HEART', 'Procedural cardiovascular heart', 'procedural', 'procedural', '1.0.0', 'Project-owned original geometry', 'Original procedural educational heart model generated from Three.js geometry.', 'published', '{"legacyId":"MODEL_PROCEDURAL_HEART","attribution":{"en":"Original procedural educational heart model generated from Three.js geometry.","ar":"نموذج تعليمي أصلي للقلب يُنشأ إجرائيًا باستخدام هندسة Three.js."}}'::jsonb)
on conflict (id) do nothing;

insert into public.mesh_mappings (asset_id, mesh_name, structure_id) values
  ('00000000-0000-4000-8000-000000000101', 'Heart_Myocardium', 'ANAT_HEART'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_RightAtrium', 'ANAT_HEART_RA'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_LeftAtrium', 'ANAT_HEART_LA'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_RightVentricle', 'ANAT_HEART_RV'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_LeftVentricle', 'ANAT_HEART_LV'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_InterventricularSeptum', 'ANAT_HEART_SEPTUM'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_Aorta', 'ANAT_HEART_AORTA'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_PulmonaryTrunk', 'ANAT_HEART_PULMONARY_TRUNK'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_SuperiorVenaCava', 'ANAT_HEART_SVC'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_InferiorVenaCava', 'ANAT_HEART_IVC'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_TricuspidValve', 'ANAT_HEART_TRICUSPID'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_MitralValve', 'ANAT_HEART_MITRAL'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_PulmonaryValve', 'ANAT_HEART_PULMONARY_VALVE'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_AorticValve', 'ANAT_HEART_AORTIC_VALVE'),
  ('00000000-0000-4000-8000-000000000101', 'Heart_CoronaryArteries', 'ANAT_HEART_CORONARY')
on conflict (asset_id, mesh_name) do nothing;
commit;

