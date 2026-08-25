import * as THREE from "three";
import type { MeshRegistry } from "@/src/three/selection/MeshRegistry";
import type { Disease } from "@/src/types/medical";

export class PathologyVisualizer {
  private readonly registry: MeshRegistry;

  constructor(registry: MeshRegistry) {
    this.registry = registry;
  }

  apply(root: THREE.Object3D, disease: Disease | undefined, progress: number, showHealthy: boolean) {
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshPhysicalMaterial)) return;
      if (!(object.userData.originalScale instanceof THREE.Vector3))
        object.userData.originalScale = object.scale.clone();
      object.material.color.setHex(object.material.userData.originalColor as number);
      object.material.emissive.setHex(0x000000);
      object.material.emissiveIntensity = 0;
      object.scale.copy(object.userData.originalScale as THREE.Vector3);
      const structureId = this.registry.getStructureId(object);
      if (!disease || !structureId || !disease.affectedStructureIds.includes(structureId) || showHealthy)
        return;
      const diseaseStages = disease.stages.filter((stage) => stage.order > 0);
      const stageIndex = Math.min(
        diseaseStages.length - 1,
        Math.max(0, Math.ceil(progress * diseaseStages.length) - 1),
      );
      const visualState = diseaseStages[stageIndex]?.visualState;
      const color = visualState?.color ?? "#dca26f";
      object.material.color.lerp(new THREE.Color(color), progress * 0.72);
      object.material.emissive.set(color);
      object.material.emissiveIntensity = progress * 0.19;
      if (visualState?.scaleMultiplier)
        object.scale.multiplyScalar(1 + progress * visualState.scaleMultiplier);
      const targetName = visualState?.morphTarget;
      const target = targetName ? object.morphTargetDictionary?.[targetName] : undefined;
      if (typeof target === "number" && object.morphTargetInfluences)
        object.morphTargetInfluences[target] = progress;
    });
  }
}
