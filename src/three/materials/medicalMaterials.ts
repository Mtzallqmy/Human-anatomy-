import * as THREE from "three";

export type TissueKind =
  "myocardium" | "right-chamber" | "left-chamber" | "artery" | "vein" | "valve" | "coronary" | "septum";

const tissueColors: Record<TissueKind, string> = {
  myocardium: "#914a48",
  "right-chamber": "#8b5261",
  "left-chamber": "#a75854",
  artery: "#bd6a61",
  vein: "#6485a2",
  valve: "#e4cba0",
  coronary: "#dc9a82",
  septum: "#ad7271",
};

export function createTissueMaterial(kind: TissueKind): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    color: tissueColors[kind],
    roughness: kind === "valve" ? 0.45 : 0.64,
    metalness: 0.04,
    clearcoat: 0.16,
    clearcoatRoughness: 0.48,
    transparent: kind === "septum",
    opacity: kind === "septum" ? 0.72 : 1,
    side: THREE.DoubleSide,
  });
  material.userData.originalColor = material.color.getHex();
  material.userData.originalOpacity = material.opacity;
  return material;
}

export function restoreTissueMaterial(material: THREE.MeshPhysicalMaterial) {
  material.color.setHex(material.userData.originalColor as number);
  material.opacity = material.userData.originalOpacity as number;
  material.transparent = material.opacity < 1;
  material.emissive.setHex(0x000000);
  material.emissiveIntensity = 0;
  material.depthWrite = true;
  material.needsUpdate = true;
}
