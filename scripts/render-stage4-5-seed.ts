import { writeFileSync } from "node:fs";
import {
  allHumanStructures,
  crossSystemRelationships,
  expandedDiseases,
  physiologyAnimations,
} from "../src/data/anatomy/humanBodyCatalog";
import { modelAssets } from "../src/data/assets/modelAssets";
import { imagingStudies } from "../src/data/imaging/imagingStudies";
import { heartDiseases } from "../src/data/pathology/heartDiseases";
import { bodySystems } from "../src/data/systems/systems";

const q = (value: string | null | undefined) =>
  value == null ? "null" : `'${value.replaceAll("'", "''")}'`;
const json = (value: unknown) => `${q(JSON.stringify(value))}::jsonb`;
const bool = (value: boolean) => (value ? "true" : "false");
const lines: string[] = ["begin;", "set local statement_timeout = '60s';"];

for (const [index, system] of bodySystems.entries()) {
  lines.push(`insert into public.systems(id,slug,canonical_name,status,is_available,sort_order,metadata)
values(${q(system.id)},${q(system.slug)},${q(system.name.en)},'published',${bool(system.available)},${index},${json({ icon: system.icon, accentColor: system.accentColor, rootStructureIds: system.rootStructureIds, organIds: system.organIds })})
on conflict(id) do update set slug=excluded.slug,canonical_name=excluded.canonical_name,status='published',is_available=excluded.is_available,sort_order=excluded.sort_order,metadata=excluded.metadata,deleted_at=null;`);
  for (const locale of ["en", "ar"] as const) {
    lines.push(`insert into public.system_translations(system_id,locale,name,description) values(${q(system.id)},${q(locale)},${q(system.name[locale])},${q(system.description[locale])}) on conflict(system_id,locale) do update set name=excluded.name,description=excluded.description;`);
  }
}

for (const [index, structure] of allHumanStructures.entries()) {
  lines.push(`insert into public.anatomical_structures(id,system_id,parent_id,slug,canonical_name,latin_name,status,sort_order,metadata)
values(${q(structure.id)},${q(structure.systemId)},${q(structure.parentId)},${q(structure.id.toLowerCase().replaceAll("_", "-"))},${q(structure.name.en)},${q(structure.latinName)},'published',${index},${json({ labelAnchor: structure.labelAnchor, studyNumber: structure.studyNumber })})
on conflict(id) do update set system_id=excluded.system_id,parent_id=excluded.parent_id,canonical_name=excluded.canonical_name,latin_name=excluded.latin_name,status='published',sort_order=excluded.sort_order,metadata=excluded.metadata,deleted_at=null;`);
  for (const locale of ["en", "ar"] as const) {
    lines.push(`insert into public.structure_translations(structure_id,locale,name,description,anatomy,physiology,location,blood_supply,innervation)
values(${q(structure.id)},${q(locale)},${q(structure.name[locale])},${q(structure.description[locale])},${q(structure.anatomy[locale])},${q(structure.physiology[locale])},${q(structure.location[locale])},${q(structure.bloodSupply?.[locale])},${q(structure.innervation?.[locale])})
on conflict(structure_id,locale) do update set name=excluded.name,description=excluded.description,anatomy=excluded.anatomy,physiology=excluded.physiology,location=excluded.location,blood_supply=excluded.blood_supply,innervation=excluded.innervation;`);
  }
  lines.push(`insert into public.structure_synonyms(structure_id,locale,synonym) values(${q(structure.id)},'en',${q(structure.name.en)}) on conflict(structure_id,locale,synonym) do nothing;`);
  lines.push(`insert into public.structure_synonyms(structure_id,locale,synonym) values(${q(structure.id)},'ar',${q(structure.name.ar)}) on conflict(structure_id,locale,synonym) do nothing;`);
  for (const referenceId of structure.referenceIds)
    lines.push(`insert into public.structure_references(structure_id,reference_id,section_key) values(${q(structure.id)},${q(referenceId)},'overview') on conflict do nothing;`);
}

const extraSynonyms: Record<string, string[]> = {
  ANAT_KIDNEY_LEFT: ["كلية", "الكلى"], ANAT_KIDNEY_RIGHT: ["كلية", "الكلى"],
  ANAT_LUNG_LEFT: ["رئة", "الرئة"], ANAT_LUNG_RIGHT: ["رئة", "الرئة"],
  ANAT_BRAIN: ["المخ", "دماغ"], ANAT_LIVER: ["كبد"], ANAT_HEART: ["قلب"],
};
for (const [structureId, synonyms] of Object.entries(extraSynonyms))
  for (const synonym of synonyms)
    lines.push(`insert into public.structure_synonyms(structure_id,locale,synonym) values(${q(structureId)},'ar',${q(synonym)}) on conflict(structure_id,locale,synonym) do nothing;`);

for (const relation of crossSystemRelationships) {
  lines.push(`insert into public.structure_relations(structure_id,related_structure_id,relation_type) values(${q(relation.sourceStructureId)},${q(relation.targetStructureId)},${q(relation.type)}) on conflict do nothing;`);
}

const diseases = [...heartDiseases, ...expandedDiseases];
const expandedDiseaseIds = new Set(expandedDiseases.map((item) => item.id));
for (const disease of diseases) {
  const slug = disease.id.toLowerCase().replace(/^dis_/, "").replaceAll("_", "-");
  lines.push(`insert into public.diseases(id,slug,canonical_name,status) values(${q(disease.id)},${q(slug)},${q(disease.name.en)},'published') on conflict(id) do update set canonical_name=excluded.canonical_name,status='published',deleted_at=null;`);
  for (const locale of ["en", "ar"] as const) {
    lines.push(`insert into public.disease_translations(disease_id,locale,name,summary,etiology,pathogenesis,morphology,functional_effects)
values(${q(disease.id)},${q(locale)},${q(disease.name[locale])},${q(disease.summary[locale])},${q(disease.etiology[locale])},${q(disease.pathogenesis[locale])},${q(disease.morphology[locale])},${q(disease.functionalEffects[locale])})
on conflict(disease_id,locale) do update set name=excluded.name,summary=excluded.summary,etiology=excluded.etiology,pathogenesis=excluded.pathogenesis,morphology=excluded.morphology,functional_effects=excluded.functional_effects;`);
  }
  for (const [index, structureId] of disease.affectedStructureIds.entries())
    lines.push(`insert into public.disease_structures(disease_id,structure_id,is_primary) values(${q(disease.id)},${q(structureId)},${bool(index === 0)}) on conflict(disease_id,structure_id) do update set is_primary=excluded.is_primary;`);
  for (const stage of expandedDiseaseIds.has(disease.id) ? disease.stages : []) {
    const min = stage.order === 0 ? 0 : Math.max(0, (stage.order - 1) / Math.max(1, disease.stages.length - 1));
    const max = stage.order === 0 ? 0 : stage.order / Math.max(1, disease.stages.length - 1);
    lines.push(`insert into public.disease_stages(id,disease_id,stage_order,progress_min,progress_max,visual_config) values(${q(stage.id)},${q(disease.id)},${stage.order},${min.toFixed(3)},${max.toFixed(3)},${json(stage.visualState ?? {})}) on conflict(id) do update set stage_order=excluded.stage_order,progress_min=excluded.progress_min,progress_max=excluded.progress_max,visual_config=excluded.visual_config;`);
    for (const locale of ["en", "ar"] as const)
      lines.push(`insert into public.disease_stage_translations(disease_stage_id,locale,name,description) values(${q(stage.id)},${q(locale)},${q(stage.name[locale])},${q(stage.description[locale])}) on conflict(disease_stage_id,locale) do update set name=excluded.name,description=excluded.description;`);
  }
  for (const referenceId of disease.referenceIds)
    lines.push(`insert into public.disease_references(disease_id,reference_id,section_key) values(${q(disease.id)},${q(referenceId)},'overview') on conflict do nothing;`);
}

for (const animation of physiologyAnimations) {
  const slug = animation.id.toLowerCase().replace(/^phys_/, "").replaceAll("_", "-");
  lines.push(`insert into public.physiology_topics(id,slug,canonical_name,status,visual_config) values(${q(animation.id)},${q(slug)},${q(animation.name.en)},'published',${json({ duration: animation.duration, steps: animation.steps.map((step) => ({ id: step.id, structureId: step.structureId, order: step.order })) })}) on conflict(id) do update set canonical_name=excluded.canonical_name,status='published',visual_config=excluded.visual_config,deleted_at=null;`);
  for (const locale of ["en", "ar"] as const)
    lines.push(`insert into public.physiology_translations(physiology_topic_id,locale,name,summary,mechanism) values(${q(animation.id)},${q(locale)},${q(animation.name[locale])},${q(animation.steps.map((step) => step.name[locale]).join(" → "))},${q(animation.steps.map((step) => step.description[locale]).join(" "))}) on conflict(physiology_topic_id,locale) do update set name=excluded.name,summary=excluded.summary,mechanism=excluded.mechanism;`);
  for (const [index, structureId] of animation.structureIds.entries())
    lines.push(`insert into public.structure_physiology(structure_id,physiology_topic_id,sort_order) values(${q(structureId)},${q(animation.id)},${index}) on conflict(structure_id,physiology_topic_id) do update set sort_order=excluded.sort_order;`);
  for (const referenceId of ["REF_GUYTON_HALL", "REF_GRAYS_ANATOMY"])
    lines.push(`insert into public.physiology_references(physiology_topic_id,reference_id,section_key) values(${q(animation.id)},${q(referenceId)},'mechanism') on conflict do nothing;`);
}

for (const asset of modelAssets) {
  lines.push(`insert into public.three_d_assets(system_id,root_structure_id,name,asset_type,format,version,license,attribution,status,metadata)
values(${q(asset.systemId)},${q(asset.rootStructureId)},${q(asset.id)},'procedural','procedural',${q(asset.version ?? "1.0.0")},${q(asset.license)},${q(asset.attribution.en)},'published',${json({ lod: asset.lod })})
on conflict(system_id,name,version) do update set root_structure_id=excluded.root_structure_id,license=excluded.license,attribution=excluded.attribution,status='published',metadata=excluded.metadata,deleted_at=null;`);
  for (const structure of allHumanStructures.filter((item) => asset.structureIds.includes(item.id)))
    for (const meshName of structure.meshIds)
      lines.push(`insert into public.mesh_mappings(asset_id,mesh_name,structure_id) select id,${q(meshName)},${q(structure.id)} from public.three_d_assets where system_id=${q(asset.systemId)} and name=${q(asset.id)} and version=${q(asset.version ?? "1.0.0")} on conflict(asset_id,mesh_name) do update set structure_id=excluded.structure_id;`);
}

for (const study of imagingStudies) {
  lines.push(`insert into public.imaging_studies(id,slug,modality,body_region,classification,source,license,attribution,de_identified,educational_use,status,content_version,review_due_at)
values(${q(study.id)},${q(study.slug)},${q(study.modality)}::public.imaging_modality,${q(study.bodyRegion)},${q(study.classification)}::public.imaging_classification,${q(study.source)},${q(study.license)},${q(study.attribution)},${bool(study.deIdentified)},${bool(study.educationalUse)},'published',${study.version},${q(study.reviewDueAt)})
on conflict(id) do update set modality=excluded.modality,body_region=excluded.body_region,classification=excluded.classification,source=excluded.source,license=excluded.license,attribution=excluded.attribution,de_identified=excluded.de_identified,educational_use=excluded.educational_use,status='published',content_version=excluded.content_version,review_due_at=excluded.review_due_at,deleted_at=null;`);
  for (const locale of ["en", "ar"] as const)
    lines.push(`insert into public.imaging_study_translations(study_id,locale,title,description) values(${q(study.id)},${q(locale)},${q(study.title[locale])},${q(study.description[locale])}) on conflict(study_id,locale) do update set title=excluded.title,description=excluded.description;`);
  for (const [index, structureId] of study.structureIds.entries())
    lines.push(`insert into public.imaging_structure_links(study_id,structure_id,is_primary) values(${q(study.id)},${q(structureId)},${bool(index === 0)}) on conflict(study_id,structure_id) do update set is_primary=excluded.is_primary;`);
  for (const diseaseId of study.diseaseIds)
    lines.push(`insert into public.imaging_disease_links(study_id,disease_id) values(${q(study.id)},${q(diseaseId)}) on conflict do nothing;`);
  for (const referenceId of study.referenceIds)
    lines.push(`insert into public.imaging_references(study_id,reference_id) values(${q(study.id)},${q(referenceId)}) on conflict do nothing;`);
  for (const [seriesOrder, series] of study.series.entries()) {
    lines.push(`insert into public.imaging_series(id,study_id,orientation,sequence_name,sort_order) values(${q(series.id)},${q(study.id)},${q(series.orientation)}::public.imaging_orientation,${q(series.sequence)},${seriesOrder}) on conflict(id) do update set orientation=excluded.orientation,sequence_name=excluded.sequence_name,sort_order=excluded.sort_order;`);
    for (const locale of ["en", "ar"] as const)
      lines.push(`insert into public.imaging_series_translations(series_id,locale,name,description) values(${q(series.id)},${q(locale)},${q(series.name[locale])},'') on conflict(series_id,locale) do update set name=excluded.name;`);
    for (const frame of series.frames)
      lines.push(`insert into public.imaging_frames(id,series_id,frame_index,generated_variant) values(${q(frame.id)},${q(series.id)},${frame.index},${q(frame.generatedVariant)}) on conflict(id) do update set frame_index=excluded.frame_index,generated_variant=excluded.generated_variant;`);
    for (const item of series.annotations) {
      lines.push(`insert into public.imaging_annotations(id,series_id,frame_index,structure_id,geometry_type,geometry,color) values(${q(item.id)},${q(series.id)},${item.frameIndex},${q(item.structureId)},${q(item.geometry.type)}::public.annotation_geometry_type,${json(item.geometry)},${q(item.color)}) on conflict(id) do update set frame_index=excluded.frame_index,structure_id=excluded.structure_id,geometry_type=excluded.geometry_type,geometry=excluded.geometry,color=excluded.color;`);
      for (const locale of ["en", "ar"] as const)
        lines.push(`insert into public.imaging_annotation_translations(annotation_id,locale,label,description) values(${q(item.id)},${q(locale)},${q(item.label[locale])},${q(item.description[locale])}) on conflict(annotation_id,locale) do update set label=excluded.label,description=excluded.description;`);
    }
  }
}

lines.push("commit;");
writeFileSync("supabase/seed-stage4-5.sql", `${lines.join("\n")}\n`);
console.log(`Rendered ${lines.length} statements to supabase/seed-stage4-5.sql`);
