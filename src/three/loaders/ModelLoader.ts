import type * as THREE from "three";
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { ModelAsset } from "@/src/types/medical";
import type { AnatomicalStructure } from "@/src/types/medical";
import { AssetCacheManager } from "@/src/three/loaders/AssetCacheManager";
import { createProceduralHeart } from "@/src/three/loaders/ProceduralHeartFactory";

export interface DecoderConfiguration {
  dracoDecoderPath?: string;
  ktx2TranscoderPath?: string;
  meshoptDecoder?: Parameters<GLTFLoader["setMeshoptDecoder"]>[0];
}

export class ModelLoader {
  private readonly decoderConfiguration: DecoderConfiguration;

  constructor(decoderConfiguration: DecoderConfiguration = {}) {
    this.decoderConfiguration = decoderConfiguration;
  }

  async load(asset: ModelAsset, structures: AnatomicalStructure[] = []): Promise<THREE.Group> {
    if (asset.format === "procedural" || !asset.url) {
      if (asset.systemId === "SYS_CARDIOVASCULAR") return createProceduralHeart();
      const { createProceduralFullBody, createProceduralSystem } =
        await import("@/src/three/loaders/ProceduralSystemFactory");
      return asset.systemId === "SYS_FULL_BODY"
        ? createProceduralFullBody()
        : createProceduralSystem(asset.systemId, structures);
    }

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

    return AssetCacheManager.getOrLoad(`${asset.id}:${asset.version ?? "1"}`, async () => {
      const gltf = await loader.loadAsync(asset.url as string);
      return gltf.scene;
    });
  }
}
