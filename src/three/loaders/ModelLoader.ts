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

const ignoredWords = new Set([
  "system",
  "major",
  "human",
  "body",
  "structure",
  "organ",
  "musculus",
  "muscle",
  "gland",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("œ", "oe")
    .replaceAll("æ", "ae")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2 && !ignoredWords.has(token));
}

function identifiers(structure: AnatomicalStructure) {
  const values = [
    structure.name.en,
    structure.latinName ?? "",
    structure.id.replace(/^ANAT_/, "").replaceAll("_", " "),
  ];
  return values.map(normalize).filter(Boolean);
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
    const matched = wanted.filter((token) => source.includes(token)).length;
    const ratio = matched / wanted.length;
    if (ratio === 1) best = Math.max(best, 70 + wanted.length * 2);
    else if (ratio >= 0.67) best = Math.max(best, 52 + Math.round(ratio * 10));
  }
  return best;
}

function normalizeModelBounds(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(scene);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const longest = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(longest) || longest <= 0) return;

  const targetLongestDimension = 4.8;
  const scale = targetLongestDimension / longest;
  scene.scale.multiplyScalar(scale);
  scene.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  scene.position.sub(center);
  scene.updateMatrixWorld(true);
}

function adaptExternalModel(scene: THREE.Group, structures: AnatomicalStructure[]) {
  normalizeModelBounds(scene);
  const selectable = structures.filter((structure) => structure.meshIds.length > 0);
  const objects: THREE.Object3D[] = [];
  scene.traverse((object) => {
    if (object.name || object.userData.anatomyId) objects.push(object);
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
  scene.userData.mappedStructureCount = selectable.filter((structure) =>
    objects.some((object) => object.userData.localStructureId === structure.id),
  ).length;
  return scene;
}

async function loadProcedural(asset: ModelAsset, structures: AnatomicalStructure[]) {
  if (asset.systemId === "SYS_CARDIOVASCULAR") return createProceduralHeart();
  const { createProceduralFullBody, createProceduralSystem } =
    await import("@/src/three/loaders/ProceduralSystemFactory");
  return asset.systemId === "SYS_FULL_BODY"
    ? createProceduralFullBody()
    : createProceduralSystem(asset.systemId, structures);
}

export class ModelLoader {
  private readonly decoderConfiguration: DecoderConfiguration;

  constructor(decoderConfiguration: DecoderConfiguration = {}) {
    this.decoderConfiguration = decoderConfiguration;
  }

  async load(asset: ModelAsset, structures: AnatomicalStructure[] = []): Promise<THREE.Group> {
    if (asset.format === "procedural" || !asset.url) return loadProcedural(asset, structures);

    try {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const loader = new GLTFLoader();

      if (this.decoderConfiguration.dracoDecoderPath) {
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        const draco = new DRACOLoader();
        draco.setDecoderPath(this.decoderConfiguration.dracoDecoderPath);
        loader.setDRACOLoader(draco);
      }

      if (this.decoderConfiguration.meshoptDecoder) {
        loader.setMeshoptDecoder(this.decoderConfiguration.meshoptDecoder);
      }

      return await AssetCacheManager.getOrLoad(`${asset.id}:${asset.version ?? "1"}`, async () => {
        const gltf = await loader.loadAsync(asset.url as string);
        return adaptExternalModel(gltf.scene, structures);
      });
    } catch (error) {
      console.warn(`High-detail model failed for ${asset.systemId}; using procedural fallback.`, error);
      const fallback = await loadProcedural(asset, structures);
      fallback.userData.fallbackReason = "external-model-unavailable";
      return fallback;
    }
  }
}
