import * as THREE from "three";

function cloneMaterial(source: THREE.Material): THREE.Material {
  const result = source.clone();
  for (const [key, value] of Object.entries(source)) {
    if (value instanceof THREE.Texture) (result as unknown as Record<string, unknown>)[key] = value.clone();
  }
  return result;
}

function cloneModel(source: THREE.Group): THREE.Group {
  const result = source.clone(true);
  result.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry = object.geometry.clone();
    object.material = Array.isArray(object.material)
      ? object.material.map(cloneMaterial)
      : cloneMaterial(object.material);
  });
  return result;
}

export class AssetCacheManager {
  private static readonly cache = new Map<string, Promise<THREE.Group>>();

  static async getOrLoad(key: string, load: () => Promise<THREE.Group>): Promise<THREE.Group> {
    let pending = this.cache.get(key);
    if (!pending) {
      pending = load();
      this.cache.set(key, pending);
      pending.catch(() => this.cache.delete(key));
    }
    return cloneModel(await pending);
  }

  static clear() {
    this.cache.clear();
  }
}
