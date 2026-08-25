import type * as THREE from "three";
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { ModelAsset } from "@/src/types/medical";
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

  async load(asset: ModelAsset): Promise<THREE.Group> {
    if (asset.format === "procedural" || !asset.url) return createProceduralHeart();

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

    const gltf = await loader.loadAsync(asset.url);
    return gltf.scene;
  }
}
