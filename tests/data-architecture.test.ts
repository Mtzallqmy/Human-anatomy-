import test from "node:test";
import assert from "node:assert/strict";
import { allHumanStructures, crossSystemRelationships, expandedDiseases } from "../src/data/anatomy/humanBodyCatalog";
import { meshRegistry, modelAssets } from "../src/data/assets/modelAssets";
import { imagingStudies } from "../src/data/imaging/imagingStudies";
import { annotationGeometrySchema } from "../src/data-access/imaging/schemas";
import { bodySystems } from "../src/data/systems/systems";
import { medicalRepository } from "../src/services/medicalRepository";

test("every published system module has a root structure and lazy model asset", () => {
  for (const system of bodySystems.filter((item) => item.available)) {
    assert.ok(system.rootStructureIds.length > 0, `${system.id} has no root`);
    assert.ok(modelAssets.some((asset) => asset.systemId === system.id), `${system.id} has no asset`);
    for (const rootId of system.rootStructureIds)
      assert.ok(allHumanStructures.some((structure) => structure.id === rootId), `${rootId} is missing`);
  }
});

test("anatomical hierarchy, mesh registry, and cross-system links are valid", () => {
  const ids = new Set(allHumanStructures.map((item) => item.id));
  for (const structure of allHumanStructures) {
    if (structure.parentId) assert.ok(ids.has(structure.parentId), `${structure.id} has an invalid parent`);
    for (const mesh of structure.meshIds) assert.equal(meshRegistry[mesh], structure.id);
  }
  for (const relation of crossSystemRelationships) {
    assert.ok(ids.has(relation.sourceStructureId));
    assert.ok(ids.has(relation.targetStructureId));
  }
});

test("expanded diseases have four ordered educational stages", () => {
  for (const disease of expandedDiseases) {
    assert.equal(disease.stages.length, 4);
    assert.deepEqual(disease.stages.map((stage) => stage.order), [0, 1, 2, 3]);
    assert.equal(disease.visualizationAccuracy, "illustrative");
  }
});

test("imaging studies are licensed, de-identified, linked, and normalized", () => {
  const structures = new Set(allHumanStructures.map((item) => item.id));
  for (const study of imagingStudies) {
    assert.equal(study.status, "published");
    assert.equal(study.deIdentified, true);
    assert.equal(study.educationalUse, true);
    assert.ok(study.source.length > 1 && study.license.length > 1 && study.attribution.length > 1);
    assert.ok(study.structureIds.every((id) => structures.has(id)));
    for (const series of study.series) {
      assert.ok(series.frames.length > 0);
      for (const annotation of series.annotations) {
        assert.ok(structures.has(annotation.structureId));
        assert.doesNotThrow(() => annotationGeometrySchema.parse(annotation.geometry));
      }
    }
  }
});

test("unified search finds English and Arabic multi-system anatomy", () => {
  assert.ok(medicalRepository.search("kidney").some((item) => item.id === "ANAT_KIDNEY_LEFT"));
  assert.ok(medicalRepository.search("الرئة").some((item) => item.systemId === "SYS_RESPIRATORY"));
});
