import * as THREE from "three";
import { CameraManager } from "@/src/three/camera/CameraManager";
import { PhysiologyAnimator } from "@/src/three/animation/PhysiologyAnimator";
import { SelectionManager } from "@/src/three/interactions/SelectionManager";
import { LabelManager } from "@/src/three/labels/LabelManager";
import { ModelLoader } from "@/src/three/loaders/ModelLoader";
import { PathologyVisualizer } from "@/src/three/pathology/PathologyVisualizer";
import { HighlightManager } from "@/src/three/selection/HighlightManager";
import { MeshRegistry } from "@/src/three/selection/MeshRegistry";
import { disposeObject } from "@/src/three/utils/disposeObject";
import type {
  AnatomicalStructure,
  Disease,
  LabelMode,
  Locale,
  ModelAsset,
  QualityMode,
} from "@/src/types/medical";

interface SceneOptions {
  canvas: HTMLCanvasElement;
  context: WebGLRenderingContext;
  labelLayer: HTMLElement;
  container: HTMLElement;
  meshMapping: Readonly<Record<string, string>>;
  structures: AnatomicalStructure[];
  onSelect: (structureId: string) => void;
}

const ratios: Record<QualityMode, number> = { low: 1, medium: 1.4, high: 2 };

export class SceneManager {
  private readonly scene = new THREE.Scene();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cameraManager: CameraManager;
  private readonly registry: MeshRegistry;
  private readonly highlighter = new HighlightManager();
  private readonly animator = new PhysiologyAnimator();
  private readonly pathology: PathologyVisualizer;
  private readonly selection: SelectionManager;
  private readonly labels: LabelManager;
  private readonly resizeObserver: ResizeObserver;
  private readonly timer = new THREE.Timer();
  private readonly container: HTMLElement;
  private readonly structures: AnatomicalStructure[];
  private model: THREE.Group | null = null;
  private rootStructureId: string | null = null;
  private animationFrame = 0;

  constructor(options: SceneOptions) {
    const { canvas, context, container, labelLayer, meshMapping, structures, onSelect } = options;
    this.container = container;
    this.structures = structures;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 600;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.cameraManager = new CameraManager(canvas, width, height);
    this.registry = new MeshRegistry(meshMapping);
    this.pathology = new PathologyVisualizer(this.registry);
    this.selection = new SelectionManager(
      canvas,
      this.cameraManager.camera,
      () => this.model,
      this.registry,
      onSelect,
    );
    this.labels = new LabelManager(labelLayer, this.cameraManager.camera, structures, onSelect);
    // Studio medical lighting — soft, clinical, high-detail
    this.scene.fog = new THREE.Fog("#0d141a", 9, 18);
    this.scene.background = new THREE.Color("#0d141a");
    const hemi = new THREE.HemisphereLight("#eaf2f8", "#2a1e22", 1.25);
    this.scene.add(hemi);
    const ambient = new THREE.AmbientLight("#e8eef2", 0.9);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight("#fff4e8", 2.85);
    key.position.set(4.5, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.2;
    key.shadow.camera.far = 18;
    key.shadow.bias = -0.0006;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight("#8ec0d8", 2.0);
    rim.position.set(-5.5, 2.5, -4);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight("#ffd9c4", 1.05);
    fill.position.set(0, -3.5, 4.5);
    this.scene.add(fill);
    const bounce = new THREE.DirectionalLight("#c8d8e4", 0.65);
    bounce.position.set(-2, 4, 2);
    this.scene.add(bounce);
    this.scene.add(this.animator.group);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.render();
  }

  async loadModel(asset: ModelAsset) {
    if (this.model) {
      this.scene.remove(this.model);
      disposeObject(this.model);
    }
    this.model = await new ModelLoader().load(asset, this.structures);
    this.rootStructureId = asset.rootStructureId;
    this.scene.add(this.model);
    this.model.updateMatrixWorld(true);
    const targets: THREE.Mesh[] = [];
    const points: THREE.Vector3[] = [];
    for (const structure of this.structures.filter((item) => item.id !== asset.rootStructureId)) {
      const object = this.registry.getObjectsForStructure(this.model, structure.id)[0];
      if (!(object instanceof THREE.Mesh)) continue;
      points.push(new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3()));
      if (/LUNG/.test(structure.id)) targets.push(object);
    }
    this.animator.configure(asset.systemId, points.slice(0, 10), targets);
  }

  select(structureId: string, focus = true) {
    if (!this.model) return;
    if (structureId === this.rootStructureId) {
      this.highlighter.clear();
      this.model.traverse((object) => {
        if (object instanceof THREE.Mesh) object.visible = true;
      });
      if (focus) this.cameraManager.focus([this.model]);
      return;
    }
    const objects = this.registry.getObjectsForStructure(this.model, structureId);
    this.highlighter.select(objects);
    if (focus && objects.length > 0) this.cameraManager.focus(objects);
  }

  setVisibility(hiddenStructureIds: string[], isolatedStructureId: string | null) {
    if (!this.model) return;
    const wholeOrganHidden = Boolean(
      this.rootStructureId && hiddenStructureIds.includes(this.rootStructureId),
    );
    const wholeOrganIsolated = isolatedStructureId === this.rootStructureId;
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const structureId = this.registry.getStructureId(object);
      object.visible = Boolean(
        structureId &&
        !wholeOrganHidden &&
        !hiddenStructureIds.includes(structureId) &&
        (!isolatedStructureId || wholeOrganIsolated || structureId === isolatedStructureId),
      );
    });
  }

  setXrayMode(enabled: boolean, selectedStructureId: string) {
    if (!this.model) return;
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshPhysicalMaterial)) return;
      const selected = this.registry.getStructureId(object) === selectedStructureId;
      object.material.transparent = enabled || Number(object.material.userData.originalOpacity) < 1;
      object.material.opacity =
        enabled && !selected ? 0.18 : Number(object.material.userData.originalOpacity);
      object.material.depthWrite = !enabled || selected;
      object.material.needsUpdate = true;
    });
  }
  setSectionMode(enabled: boolean) {
    if (!this.model) return;
    this.renderer.localClippingEnabled = enabled;
    const plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const item of materials) {
        item.clippingPlanes = enabled ? [plane] : null;
        item.clipShadows = enabled;
        item.needsUpdate = true;
      }
    });
  }
  setExplodedView(enabled: boolean) {
    if (!this.model) return;
    const center = new THREE.Box3().setFromObject(this.model).getCenter(new THREE.Vector3());
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      if (!(object.userData.originalPosition instanceof THREE.Vector3))
        object.userData.originalPosition = object.position.clone();
      const original = object.userData.originalPosition as THREE.Vector3;
      if (!enabled) {
        object.position.copy(original);
        return;
      }
      const direction = original.clone().sub(center).normalize();
      if (direction.lengthSq() < 0.001) direction.set(0, 0, 1);
      object.position.copy(original).add(direction.multiplyScalar(0.22));
    });
  }

  setLabels(mode: LabelMode, locale: Locale) {
    this.labels.setMode(mode, locale);
  }
  setLocale(locale: Locale) {
    this.labels.setLocale(locale);
  }
  setBloodFlow(enabled: boolean) {
    this.animator.setEnabled(enabled);
  }
  setDisease(disease: Disease | undefined, progress: number, showHealthy: boolean) {
    if (this.model) this.pathology.apply(this.model, disease, progress, showHealthy);
  }
  setQuality(mode: QualityMode) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratios[mode]));
  }
  setSystemLayers(visibleSystemIds: string[], opacityBySystem: Record<string, number>) {
    if (!this.model) return;
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const systemId = object.userData.systemId as string | undefined;
      if (!systemId) return;
      object.visible = visibleSystemIds.includes(systemId);
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const item of materials) {
        if (!(item instanceof THREE.MeshPhysicalMaterial)) continue;
        const base = Number(item.userData.originalOpacity ?? 1);
        const opacity = Math.min(base, opacityBySystem[systemId] ?? base);
        item.opacity = opacity;
        item.transparent = opacity < 1;
        item.depthWrite = opacity > 0.25;
        item.needsUpdate = true;
      }
    });
  }
  resetCamera() {
    this.cameraManager.reset();
  }

  private resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.cameraManager.resize(width, height);
  }

  private render = (timestamp?: number) => {
    this.animationFrame = requestAnimationFrame(this.render);
    this.timer.update(timestamp);
    const delta = this.timer.getDelta();
    this.animator.update(delta);
    this.cameraManager.controls.update();
    this.renderer.render(this.scene, this.cameraManager.camera);
    this.labels.update(this.container.clientWidth, this.container.clientHeight);
  };

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.timer.dispose();
    this.selection.dispose();
    this.labels.dispose();
    this.highlighter.clear();
    this.cameraManager.dispose();
    if (this.model) disposeObject(this.model);
    disposeObject(this.animator.group);
    this.renderer.dispose();
  }
}
