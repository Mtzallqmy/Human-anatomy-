# Body systems

Stage 4 proves that one viewer and one medical-content contract can serve multiple systems.

| Module          | Root                 | Scope                               | Physiology                | Pathology examples                              |
| --------------- | -------------------- | ----------------------------------- | ------------------------- | ----------------------------------------------- |
| Full body       | ANAT_HUMAN_BODY      | Simplified system layers            | Cross-system context      | Highlight fallback                              |
| Cardiovascular  | ANAT_HEART           | Heart and great vessels             | Blood flow                | MI, stenosis, hypertrophy, atherosclerosis      |
| Respiratory     | ANAT_RESPIRATORY     | Airways, lungs, alveoli, diaphragm  | Airflow and breathing     | Asthma, pneumonia, emphysema, fibrosis          |
| Digestive       | ANAT_DIGESTIVE       | Tract and accessory organs          | Transit                   | GERD, ulcer, fatty liver, cirrhosis, gallstones |
| Urinary         | ANAT_URINARY         | Kidneys, collecting system, bladder | Filtration and urine flow | Stones, hydronephrosis, CKD, PKD                |
| Nervous         | ANAT_NERVOUS         | Brain regions, cord, major nerves   | Neural signal             | Stroke, MS, tumor                               |
| Musculoskeletal | ANAT_MUSCULOSKELETAL | Major bones and muscle groups       | Movement chain            | Fracture, OA, osteoporosis, disc, tear          |

Selecting a system loads only its bundle and model. Full-body mode loads a simplified layered model and applies per-system visibility and opacity. Structure routes restore the owning system before focus. Cross-system relations use stable IDs and the same `structure_relations` table.

Procedural models are clearly labeled illustrative. They validate interaction and data architecture; they are not clinically validated geometry.
