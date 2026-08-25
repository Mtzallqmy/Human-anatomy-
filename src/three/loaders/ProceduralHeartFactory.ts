import * as THREE from "three";
import { createTissueMaterial, type TissueKind } from "@/src/three/materials/medicalMaterials";

function ellipsoid(
  name: string,
  position: [number, number, number],
  scale: [number, number, number],
  tissue: TissueKind,
  group: THREE.Group,
) {
  const geometry = new THREE.SphereGeometry(1, 48, 36);
  const mesh = new THREE.Mesh(geometry, createTissueMaterial(tissue));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function vessel(
  name: string,
  points: [number, number, number][],
  radius: number,
  tissue: TissueKind,
  group: THREE.Group,
) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => new THREE.Vector3(...point)),
    false,
    "centripetal",
  );
  const geometry = new THREE.TubeGeometry(curve, 62, radius, 16, false);
  const mesh = new THREE.Mesh(geometry, createTissueMaterial(tissue));
  mesh.name = name;
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function valve(name: string, position: [number, number, number], radius: number, group: THREE.Group) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.065, 12, 38), createTissueMaterial("valve"));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.x = 0.44;
  group.add(mesh);
  return mesh;
}

export function createProceduralHeart(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Cardiovascular_Heart_Model";

  const leftVentricle = ellipsoid(
    "Heart_LeftVentricle",
    [-0.48, -0.53, 0],
    [0.82, 1.12, 0.78],
    "left-chamber",
    group,
  );
  leftVentricle.rotation.z = -0.16;

  const rightVentricle = ellipsoid(
    "Heart_RightVentricle",
    [0.46, -0.41, 0.23],
    [0.78, 0.9, 0.64],
    "right-chamber",
    group,
  );
  rightVentricle.rotation.z = 0.24;

  ellipsoid("Heart_RightAtrium", [0.84, 0.62, 0.02], [0.65, 0.54, 0.62], "right-chamber", group);
  ellipsoid("Heart_LeftAtrium", [-0.5, 0.67, -0.12], [0.62, 0.49, 0.55], "left-chamber", group);

  const septum = ellipsoid(
    "Heart_InterventricularSeptum",
    [0.02, -0.34, 0.57],
    [0.16, 0.71, 0.2],
    "septum",
    group,
  );
  septum.rotation.z = -0.12;

  vessel(
    "Heart_Aorta",
    [
      [-0.25, 0.64, 0],
      [-0.28, 1.27, -0.03],
      [-0.43, 1.87, -0.15],
      [-0.9, 2.12, -0.23],
      [-1.12, 1.89, -0.34],
      [-1.1, 1.37, -0.43],
    ],
    0.21,
    "artery",
    group,
  );
  vessel(
    "Heart_PulmonaryTrunk",
    [
      [0.11, 0.34, 0.51],
      [0.18, 0.95, 0.57],
      [0.28, 1.38, 0.42],
      [0.64, 1.61, 0.18],
      [1.03, 1.55, -0.05],
    ],
    0.19,
    "vein",
    group,
  );
  vessel(
    "Heart_SuperiorVenaCava",
    [
      [0.89, 0.64, -0.23],
      [1.02, 1.08, -0.22],
      [1.07, 1.56, -0.24],
      [1.07, 2.02, -0.27],
    ],
    0.17,
    "vein",
    group,
  );
  vessel(
    "Heart_InferiorVenaCava",
    [
      [0.84, 0.22, -0.33],
      [0.97, -0.21, -0.36],
      [1.08, -0.77, -0.4],
      [1.15, -1.21, -0.45],
    ],
    0.16,
    "vein",
    group,
  );

  valve("Heart_TricuspidValve", [0.61, 0.11, 0.71], 0.21, group);
  valve("Heart_MitralValve", [-0.45, 0.16, 0.7], 0.18, group);
  valve("Heart_PulmonaryValve", [0.16, 0.71, 0.76], 0.13, group);
  valve("Heart_AorticValve", [-0.22, 0.73, 0.44], 0.12, group);

  vessel(
    "Heart_CoronaryArteries",
    [
      [-0.23, 0.8, 0.51],
      [-0.14, 0.44, 0.76],
      [-0.07, 0.02, 0.88],
      [-0.11, -0.43, 0.88],
      [-0.32, -0.95, 0.68],
    ],
    0.046,
    "coronary",
    group,
  );
  vessel(
    "Heart_CoronaryArteries",
    [
      [-0.15, 0.42, 0.81],
      [0.12, 0.39, 0.81],
      [0.46, 0.31, 0.8],
      [0.75, 0.15, 0.72],
    ],
    0.034,
    "coronary",
    group,
  );
  vessel(
    "Heart_CoronaryArteries",
    [
      [-0.11, -0.23, 0.9],
      [-0.42, -0.35, 0.79],
      [-0.73, -0.54, 0.63],
    ],
    0.029,
    "coronary",
    group,
  );

  group.position.y = -0.2;
  return group;
}
