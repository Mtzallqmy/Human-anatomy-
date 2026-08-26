import * as THREE from "three";

export type TissueKind =
  | "myocardium"
  | "right-chamber"
  | "left-chamber"
  | "artery"
  | "vein"
  | "valve"
  | "coronary"
  | "septum"
  | "lung-tissue"
  | "liver-tissue"
  | "kidney-tissue"
  | "brain-tissue"
  | "bone-tissue"
  | "cartilage"
  | "nerve-tissue"
  | "mucosa"
  | "skin-tissue";

const tissueColors: Record<TissueKind, string> = {
  myocardium: "#9e4a48",
  "right-chamber": "#8d4a5e",
  "left-chamber": "#b85a51",
  artery: "#d06a5e",
  vein: "#5a84a6",
  valve: "#f0d9a8",
  coronary: "#e8a88a",
  septum: "#c48a89",
  "lung-tissue": "#d49088",
  "liver-tissue": "#a85e4a",
  "kidney-tissue": "#8e4d4a",
  "brain-tissue": "#d9c5b0",
  "bone-tissue": "#e8ddd0",
  cartilage: "#d4e0e8",
  "nerve-tissue": "#e8dcc0",
  mucosa: "#e8a090",
  "skin-tissue": "#d4a88a",
};

const tissueRoughness: Record<TissueKind, number> = {
  myocardium: 0.42,
  "right-chamber": 0.44,
  "left-chamber": 0.4,
  artery: 0.38,
  vein: 0.36,
  valve: 0.28,
  coronary: 0.32,
  septum: 0.46,
  "lung-tissue": 0.52,
  "liver-tissue": 0.48,
  "kidney-tissue": 0.44,
  "brain-tissue": 0.5,
  "bone-tissue": 0.34,
  cartilage: 0.26,
  "nerve-tissue": 0.32,
  mucosa: 0.38,
  "skin-tissue": 0.44,
};

export function createTissueMaterial(kind: TissueKind): THREE.MeshPhysicalMaterial {
  const isValvular = kind === "valve" || kind === "cartilage";
  const isVascular = kind === "artery" || kind === "vein" || kind === "coronary";
  const isTranslucent = kind === "septum" || kind === "lung-tissue" || kind === "mucosa";
  const material = new THREE.MeshPhysicalMaterial({
    color: tissueColors[kind],
    roughness: tissueRoughness[kind],
    metalness: isValvular ? 0.02 : isVascular ? 0.06 : 0.03,
    clearcoat: isValvular ? 0.42 : isVascular ? 0.32 : 0.18,
    clearcoatRoughness: isValvular ? 0.28 : 0.42,
    sheen: isTranslucent ? 0.35 : 0.12,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(tissueColors[kind]).multiplyScalar(1.15),
    transparent: isTranslucent,
    opacity: kind === "septum" ? 0.68 : kind === "lung-tissue" ? 0.84 : isTranslucent ? 0.88 : 1,
    side: THREE.DoubleSide,
    flatShading: false,
  });
  material.userData.originalColor = material.color.getHex();
  material.userData.originalOpacity = material.opacity;
  material.userData.tissueKind = kind;
  return material;
}

export function createHighlightMaterial(base: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial {
  const highlight = base.clone();
  highlight.emissive = new THREE.Color(base.color).multiplyScalar(0.35);
  highlight.emissiveIntensity = 0.42;
  highlight.roughness = Math.max(0.18, base.roughness - 0.12);
  highlight.clearcoat = 0.55;
  highlight.needsUpdate = true;
  return highlight;
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
