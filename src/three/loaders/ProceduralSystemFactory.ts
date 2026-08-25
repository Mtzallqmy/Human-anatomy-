import * as THREE from "three";
import type { AnatomicalStructure } from "@/src/types/medical";

type Position = readonly [number, number, number];

const systemColors: Record<string, string> = {
  SYS_RESPIRATORY: "#75b9c5",
  SYS_DIGESTIVE: "#bd8062",
  SYS_URINARY: "#8d77ba",
  SYS_NERVOUS: "#d0ad7e",
  SYS_MUSCULOSKELETAL: "#c7b49c",
};

const positions: Record<string, Position> = {
  ANAT_NASAL_CAVITY: [0, 2.2, 0],
  ANAT_PHARYNX: [0, 1.85, 0],
  ANAT_LARYNX: [0, 1.5, 0],
  ANAT_TRACHEA: [0, 0.85, 0],
  ANAT_LUNG_RIGHT: [0.62, 0, 0],
  ANAT_LUNG_LEFT: [-0.62, 0, 0],
  ANAT_MAIN_BRONCHI: [0, 0.35, 0.18],
  ANAT_BRONCHIAL_TREE: [0, -0.05, 0.25],
  ANAT_ALVEOLI: [0.76, -0.55, 0.34],
  ANAT_DIAPHRAGM: [0, -1.1, 0],
  ANAT_ORAL_CAVITY: [0, 2.2, 0],
  ANAT_DIGESTIVE_PHARYNX: [0, 1.85, 0],
  ANAT_ESOPHAGUS: [0, 0.95, 0],
  ANAT_STOMACH: [-0.42, 0.05, 0.15],
  ANAT_LIVER: [0.48, 0.18, 0],
  ANAT_GALLBLADDER: [0.7, -0.15, 0.3],
  ANAT_PANCREAS: [0, -0.3, 0.15],
  ANAT_DUODENUM: [-0.15, -0.55, 0.12],
  ANAT_SMALL_INTESTINE: [0, -1.05, 0.1],
  ANAT_LARGE_INTESTINE: [0, -1.15, -0.05],
  ANAT_RECTUM: [0, -2.0, 0],
  ANAT_KIDNEY_RIGHT: [0.65, 0.55, 0],
  ANAT_KIDNEY_LEFT: [-0.65, 0.55, 0],
  ANAT_RENAL_CORTEX: [-0.65, 0.55, 0.25],
  ANAT_RENAL_MEDULLA: [-0.65, 0.55, 0.38],
  ANAT_RENAL_PELVIS: [-0.42, 0.48, 0.42],
  ANAT_URETERS: [0, -0.35, 0],
  ANAT_URINARY_BLADDER: [0, -1.55, 0],
  ANAT_URETHRA: [0, -2.05, 0],
  ANAT_BRAIN: [0, 1.75, 0],
  ANAT_CEREBRUM: [0, 1.85, 0],
  ANAT_FRONTAL_LOBE: [0, 1.9, 0.42],
  ANAT_PARIETAL_LOBE: [0, 2.05, 0],
  ANAT_TEMPORAL_LOBE: [0.62, 1.72, 0.05],
  ANAT_OCCIPITAL_LOBE: [0, 1.88, -0.42],
  ANAT_CEREBELLUM: [0, 1.38, -0.4],
  ANAT_BRAINSTEM: [0, 1.15, 0],
  ANAT_BRAIN_VENTRICLES: [0, 1.82, 0.18],
  ANAT_SPINAL_CORD: [0, -0.2, 0],
  ANAT_PERIPHERAL_NERVES: [0, -0.7, 0],
  ANAT_SKULL: [0, 1.95, 0],
  ANAT_VERTEBRAL_COLUMN: [0, 0.15, -0.25],
  ANAT_RIB_CAGE: [0, 0.55, 0],
  ANAT_PELVIS: [0, -0.85, 0],
  ANAT_UPPER_LIMB: [1.35, 0.2, 0],
  ANAT_LOWER_LIMB: [0.55, -1.85, 0],
  ANAT_DELTOID: [1.0, 0.85, 0.2],
  ANAT_PECTORALIS_MAJOR: [0, 0.62, 0.42],
  ANAT_BICEPS: [1.28, 0.25, 0.24],
  ANAT_TRICEPS: [-1.28, 0.25, -0.12],
  ANAT_RECTUS_ABDOMINIS: [0, -0.25, 0.42],
  ANAT_QUADRICEPS: [0.52, -1.35, 0.3],
  ANAT_HAMSTRINGS: [-0.52, -1.35, -0.1],
  ANAT_GASTROCNEMIUS: [0.52, -2.1, -0.05],
};

function material(color: string, opacity = 0.9) {
  const value = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.58,
    metalness: 0,
    clearcoat: 0.12,
    transparent: opacity < 1,
    opacity,
  });
  value.userData.originalColor = value.color.getHex();
  value.userData.originalOpacity = opacity;
  return value;
}

function geometryFor(id: string): THREE.BufferGeometry {
  if (/TRACHEA|ESOPHAGUS|URETHRA|SPINAL_CORD|VERTEBRAL/.test(id))
    return new THREE.CapsuleGeometry(0.14, 1.4, 10, 20);
  if (/URETERS|MAIN_BRONCHI|BRONCHIAL_TREE|PERIPHERAL_NERVES/.test(id))
    return new THREE.TorusKnotGeometry(0.42, 0.055, 80, 9, 2, 3);
  if (/LUNG/.test(id)) return new THREE.CapsuleGeometry(0.5, 1.1, 16, 28);
  if (/KIDNEY/.test(id)) return new THREE.TorusGeometry(0.42, 0.19, 20, 40, Math.PI * 1.72);
  if (/INTESTINE/.test(id)) return new THREE.TorusKnotGeometry(0.54, 0.1, 110, 12, 3, 4);
  if (/DIAPHRAGM|PELVIS|RIB_CAGE/.test(id)) return new THREE.TorusGeometry(0.8, 0.08, 14, 54, Math.PI);
  if (/LIMB|BICEPS|TRICEPS|QUADRICEPS|HAMSTRINGS|GASTROCNEMIUS/.test(id))
    return new THREE.CapsuleGeometry(0.2, 1.1, 10, 20);
  if (/SKULL|BRAIN|CEREBR|LOBE/.test(id)) return new THREE.SphereGeometry(0.68, 34, 26);
  if (/ALVEOLI/.test(id)) return new THREE.IcosahedronGeometry(0.36, 2);
  return new THREE.SphereGeometry(0.42, 30, 22);
}

function scaleFor(id: string): Position {
  if (/LUNG/.test(id)) return [0.85, 1.2, 0.72];
  if (/LIVER/.test(id)) return [1.25, 0.62, 0.72];
  if (/STOMACH/.test(id)) return [0.75, 1.02, 0.62];
  if (/BLADDER/.test(id)) return [0.9, 0.72, 0.65];
  if (/PANCREAS/.test(id)) return [1.1, 0.35, 0.42];
  if (/GALLBLADDER/.test(id)) return [0.44, 0.8, 0.42];
  if (/RECTUM|URETHRA/.test(id)) return [0.55, 0.55, 0.55];
  if (/LOBE/.test(id)) return [0.78, 0.72, 0.72];
  if (/BRAIN_VENTRICLES/.test(id)) return [0.5, 0.25, 0.3];
  if (/MUSCLE|DELTOID|PECTORALIS|RECTUS/.test(id)) return [1, 0.6, 0.45];
  return [1, 1, 1];
}

export function createProceduralSystem(systemId: string, structures: AnatomicalStructure[]): THREE.Group {
  const group = new THREE.Group();
  group.name = `${systemId}_Procedural_Educational_Model`;
  const baseColor = systemColors[systemId] ?? "#a99283";
  for (const structure of structures) {
    if (structure.meshIds.length === 0) continue;
    const mesh = new THREE.Mesh(geometryFor(structure.id), material(baseColor));
    mesh.name = structure.meshIds[0];
    mesh.position.set(...(positions[structure.id] ?? structure.labelAnchor ?? [0, 0, 0]));
    mesh.scale.set(...scaleFor(structure.id));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.systemId = systemId;
    group.add(mesh);
  }
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);
  return group;
}

export function createProceduralFullBody(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Full_Body_Layer_Model";
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.82, 2.15, 14, 28), material("#6b7f8b", 0.13));
  torso.name = "BodyLayer_Musculoskeletal";
  torso.userData.systemId = "SYS_MUSCULOSKELETAL";
  group.add(torso);
  const layers = [
    ["BodyLayer_Cardiovascular", "SYS_CARDIOVASCULAR", "#cf645f", [0, 0.35, 0.3], [0.3, 0.42, 0.3]],
    ["BodyLayer_Respiratory", "SYS_RESPIRATORY", "#70b7c6", [0, 0.55, 0], [0.85, 0.72, 0.42]],
    ["BodyLayer_Digestive", "SYS_DIGESTIVE", "#bd8062", [0, -0.42, 0.12], [0.75, 0.65, 0.48]],
    ["BodyLayer_Urinary", "SYS_URINARY", "#8d77ba", [0, -0.65, -0.12], [0.58, 0.36, 0.34]],
    ["BodyLayer_Nervous", "SYS_NERVOUS", "#d0ad7e", [0, 1.72, 0], [0.55, 0.55, 0.55]],
  ] as const;
  for (const [name, systemId, color, position, scale] of layers) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 28, 22), material(color, 0.82));
    mesh.name = name;
    mesh.userData.systemId = systemId;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    group.add(mesh);
  }
  group.position.y = -0.2;
  return group;
}
