import type * as THREE from "three";

export class MeshRegistry {
  private readonly mapping: Readonly<Record<string, string>>;

  constructor(mapping: Readonly<Record<string, string>>) {
    this.mapping = mapping;
  }

  private resolve(object: THREE.Object3D): string | undefined {
    const localStructureId = object.userData.localStructureId;
    if (typeof localStructureId === "string" && localStructureId) return localStructureId;
    return this.mapping[object.name];
  }

  getStructureId(object: THREE.Object3D): string | undefined {
    let current: THREE.Object3D | null = object;
    while (current) {
      const structureId = this.resolve(current);
      if (structureId) return structureId;
      current = current.parent;
    }
    return undefined;
  }

  getObjectsForStructure(root: THREE.Object3D, structureId: string): THREE.Object3D[] {
    const objects: THREE.Object3D[] = [];
    root.traverse((object) => {
      if (this.resolve(object) === structureId) objects.push(object);
    });
    return objects;
  }
}
