import type * as THREE from "three";

export class MeshRegistry {
  private readonly mapping: Readonly<Record<string, string>>;

  constructor(mapping: Readonly<Record<string, string>>) {
    this.mapping = mapping;
  }

  getStructureId(object: THREE.Object3D): string | undefined {
    let current: THREE.Object3D | null = object;
    while (current) {
      const structureId = this.mapping[current.name];
      if (structureId) return structureId;
      current = current.parent;
    }
    return undefined;
  }

  getObjectsForStructure(root: THREE.Object3D, structureId: string): THREE.Object3D[] {
    const objects: THREE.Object3D[] = [];
    root.traverse((object) => {
      if (this.mapping[object.name] === structureId) objects.push(object);
    });
    return objects;
  }
}
