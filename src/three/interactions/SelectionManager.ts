import * as THREE from "three";
import { MeshRegistry } from "@/src/three/selection/MeshRegistry";

export class SelectionManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly pointerStart = new THREE.Vector2();
  private readonly canvas: HTMLCanvasElement;
  private readonly camera: THREE.Camera;
  private readonly getRoot: () => THREE.Object3D | null;
  private readonly registry: MeshRegistry;
  private readonly onSelect: (structureId: string) => void;

  constructor(
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
    getRoot: () => THREE.Object3D | null,
    registry: MeshRegistry,
    onSelect: (structureId: string) => void,
  ) {
    this.canvas = canvas;
    this.camera = camera;
    this.getRoot = getRoot;
    this.registry = registry;
    this.onSelect = onSelect;
    canvas.addEventListener("pointerdown", this.handlePointerDown);
    canvas.addEventListener("pointerup", this.handlePointerUp);
    canvas.addEventListener("pointermove", this.handlePointerMove);
  }

  private handlePointerDown = (event: PointerEvent) => {
    this.pointerStart.set(event.clientX, event.clientY);
  };

  private getHit(event: PointerEvent) {
    const root = this.getRoot();
    if (!root) return undefined;
    const bounds = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    this.pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObject(root, true);
    return hits.find((hit) => hit.object.visible && this.registry.getStructureId(hit.object));
  }

  private handlePointerUp = (event: PointerEvent) => {
    if (this.pointerStart.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 5) return;
    const hit = this.getHit(event);
    if (!hit) return;
    const structureId = this.registry.getStructureId(hit.object);
    if (structureId) this.onSelect(structureId);
  };

  private handlePointerMove = (event: PointerEvent) => {
    this.canvas.style.cursor = this.getHit(event) ? "pointer" : "grab";
  };

  dispose() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
  }
}
