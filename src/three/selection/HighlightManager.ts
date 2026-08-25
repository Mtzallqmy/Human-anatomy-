import * as THREE from "three";

export class HighlightManager {
  private highlighted: THREE.Mesh[] = [];

  select(objects: THREE.Object3D[]) {
    this.clear();
    for (const object of objects) {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshPhysicalMaterial)) return;
        child.material.emissive.set("#f08d81");
        child.material.emissiveIntensity = 0.48;
        this.highlighted.push(child);
      });
    }
  }

  clear() {
    for (const mesh of this.highlighted) {
      if (!(mesh.material instanceof THREE.MeshPhysicalMaterial)) continue;
      mesh.material.emissive.setHex(0x000000);
      mesh.material.emissiveIntensity = 0;
    }
    this.highlighted = [];
  }
}
