import * as THREE from "three";
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { AnatomicalStructure, ModelAsset } from "@/src/types/medical";
import { AssetCacheManager } from "@/src/three/loaders/AssetCacheManager";
import { createProceduralHeart } from "@/src/three/loaders/ProceduralHeartFactory";

export interface DecoderConfiguration {
  dracoDecoderPath?: string;
  ktx2TranscoderPath?: string;
  meshoptDecoder?: Parameters<GLTFLoader["setMeshoptDecoder"]>[0];
}

const ignoredWords = new Set(["system", "major", "human", "body", "structure", "organ", "musculus", "muscle", "gland"]);
const memoryHeavySystems = new Set(["SYS_FULL_BODY", "SYS_MALE_BODY", "SYS_FEMALE_BODY", "SYS_MALE_REPRODUCTIVE", "SYS_FEMALE_REPRODUCTIVE"]);

function normalize(value: string) {
  return value.toLowerCase().replaceAll("œ", "oe").replaceAll("æ", "ae").replace(/[^a-z0-9]+/g, " ").trim();
}

function tokens(value: string) {
  return normalize(value).split(" ").filter((token) => token.length > 2 && !ignoredWords.has(token));
}

function identifiers(structure: AnatomicalStructure) {
  return [structure.name.en, structure.latinName ?? "", structure.id.replace(/^ANAT_/, "").replaceAll("_", " ")]
    .map(normalize)
    .filter(Boolean);
}

function scoreObject(structure: AnatomicalStructure, object: THREE.Object3D) {
  const anatomyId = typeof object.userData.anatomyId === "string" ? object.userData.anatomyId : "";
  const source = normalize(`${object.name} ${anatomyId}`);
  if (!source) return 0;
  let best = 0;
  for (const identifier of identifiers(structure)) {
    if (source === identifier) best = Math.max(best, 100);
    else if (identifier.length > 4 && source.includes(identifier)) best = Math.max(best, 82);
    else if (source.length > 4 && identifier.includes(source)) best = Math.max(best, 68);
    const wanted = tokens(identifier);
    if (!wanted.length) continue;
    const ratio = wanted.filter((token) => source.includes(token)).length / wanted.length;
    if (ratio === 1) best = Math.max(best, 70 + wanted.length * 2);
    else if (ratio >= 0.67) best = Math.max(best, 52 + Math.round(ratio * 10));
  }
  return best;
}

const maleOnlyTerms = ["testis", "testicle", "epididym", "deferens", "prostate", "penis", "seminal vesicle", "bulbourethral", "spermatic cord", "scrot"];
const femaleOnlyTerms = ["ovary", "ovaries", "uterus", "uterine", "fallopian", "cervix", "vagina", "vulva", "clitoris", "labium", "labia"];

function applySexProfile(scene: THREE.Group, systemId: string) {
  const male = systemId === "SYS_MALE_BODY" || systemId === "SYS_MALE_REPRODUCTIVE";
  const female = systemId === "SYS_FEMALE_BODY" || systemId === "SYS_FEMALE_REPRODUCTIVE";
  if (!male && !female) return;
  const excluded = male ? femaleOnlyTerms : maleOnlyTerms;
  scene.traverse((object) => {
    const anatomyId = typeof object.userData.anatomyId === "string" ? object.userData.anatomyId : "";
    const source = normalize(`${object.name} ${anatomyId}`);
    if (excluded.some((term) => source.includes(term))) {
      object.visible = false;
      object.userData.sexProfileExcluded = true;
    }
  });
  scene.userData.sexProfile = male ? "male" : "female";
}

function normalizeModelBounds(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(scene);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const longest = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(longest) || longest <= 0) return;
  scene.scale.multiplyScalar(4.8 / longest);
  scene.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(scene);
  scene.position.sub(box.getCenter(new THREE.Vector3()));
  scene.updateMatrixWorld(true);
}

function adaptExternalModel(scene: THREE.Group, structures: AnatomicalStructure[], systemId: string) {
  applySexProfile(scene, systemId);
  normalizeModelBounds(scene);
  const selectable = structures.filter((structure) => structure.meshIds.length > 0);
  const objects: THREE.Object3D[] = [];
  scene.traverse((object) => {
    if ((object.name || object.userData.anatomyId) && object.visible) objects.push(object);
  });
  for (const structure of selectable) {
    let bestScore = 0;
    let bestObject: THREE.Object3D | undefined;
    for (const object of objects) {
      const score = scoreObject(structure, object);
      if (score > bestScore) {
        bestScore = score;
        bestObject = object;
      }
    }
    if (bestObject && bestScore >= 58) {
      bestObject.userData.localStructureId = structure.id;
      bestObject.userData.matchConfidence = bestScore;
      bestObject.userData.systemId = structure.systemId;
    }
  }
  scene.userData.externalAnatomyModel = true;
  scene.userData.mappedStructureCount = selectable.filter((structure) => objects.some((object) => object.userData.localStructureId === structure.id)).length;
  return scene;
}

function prefersSafeModel(asset: ModelAsset) {
  if (typeof window === "undefined" || !memoryHeavySystems.has(asset.systemId)) return false;
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  const memory = navigatorWithMemory.deviceMemory ?? 4;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 820;
  return memory <= 4 || coarse || narrow;
}

async function loadProcedural(asset: ModelAsset, structures: AnatomicalStructure[]) {
  if (asset.systemId === "SYS_CARDIOVASCULAR") return createProceduralHeart();
  const { createProceduralFullBody, createProceduralSystem } = await import("@/src/three/loaders/ProceduralSystemFactory");
  return ["SYS_FULL_BODY", "SYS_MALE_BODY", "SYS_FEMALE_BODY"].includes(asset.systemId)
    ? createProceduralFullBody()
    : createProceduralSystem(asset.systemId, structures);
}

export class ModelLoader {
  private readonly decoderConfiguration: DecoderConfiguration;
  constructor(decoderConfiguration: DecoderConfiguration = {}) {
    this.decoderConfiguration = decoderConfiguration;
  }

  async load(asset: ModelAsset, structures: AnatomicalStructure[] = []): Promise<THREE.Group> {
    if (asset.format === "procedural" || !asset.url || prefersSafeModel(asset)) {
      const fallback = await loadProcedural(asset, structures);
      if (asset.format !== "procedural" && asset.url) fallback.userData.fallbackReason = "mobile-memory-safety";
      return fallback;
    }
    try {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const loader = new GLTFLoader();
      if (this.decoderConfiguration.dracoDecoderPath) {
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        const draco = new DRACOLoader();
        draco.setDecoderPath(this.decoderConfiguration.dracoDecoderPath);
        loader.setDRACOLoader(draco);
      }
      if (this.decoderConfiguration.meshoptDecoder) loader.setMeshoptDecoder(this.decoderConfiguration.meshoptDecoder);
      return await AssetCacheManager.getOrLoad(`${asset.id}:${asset.version ?? "1"}`, async () => {
        const gltf = await loader.loadAsync(asset.url as string);
        return adaptExternalModel(gltf.scene, structures, asset.systemId);
      });
    } catch (error) {
      console.warn(`High-detail model failed for ${asset.systemId}; using procedural fallback.`, error);
      const fallback = await loadProcedural(asset, structures);
      fallback.userData.fallbackReason = "external-model-unavailable";
      return fallback;
    }
  }
}
