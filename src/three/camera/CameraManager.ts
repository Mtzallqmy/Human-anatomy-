import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";

export class CameraManager {
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private readonly initialPosition = new THREE.Vector3(4.5, 2.8, 6.8);
  private readonly initialTarget = new THREE.Vector3(0, 0.05, 0);

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(34, width / Math.max(height, 1), 0.1, 100);
    this.camera.position.copy(this.initialPosition);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 2.8;
    this.controls.maxDistance = 12;
    this.controls.target.copy(this.initialTarget);
    this.controls.update();
  }

  focus(objects: THREE.Object3D[]) {
    if (objects.length === 0) return;
    const box = new THREE.Box3();
    for (const object of objects) box.expandByObject(object);
    const target = box.getCenter(new THREE.Vector3());
    const direction = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    const distance = Math.max(box.getSize(new THREE.Vector3()).length() * 1.8, 3.8);
    const destination = target.clone().addScaledVector(direction, distance);
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.controls.target);
    gsap.to(this.camera.position, {
      x: destination.x,
      y: destination.y,
      z: destination.z,
      duration: 1.08,
      ease: "power3.inOut",
    });
    gsap.to(this.controls.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.08,
      ease: "power3.inOut",
    });
  }

  reset() {
    gsap.to(this.camera.position, {
      x: this.initialPosition.x,
      y: this.initialPosition.y,
      z: this.initialPosition.z,
      duration: 0.95,
      ease: "power2.inOut",
    });
    gsap.to(this.controls.target, {
      x: this.initialTarget.x,
      y: this.initialTarget.y,
      z: this.initialTarget.z,
      duration: 0.95,
      ease: "power2.inOut",
    });
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.controls.target);
    this.controls.dispose();
  }
}
