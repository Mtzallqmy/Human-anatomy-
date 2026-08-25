import * as THREE from "three";
import { disposeObject } from "@/src/three/utils/disposeObject";

interface FlowParticle {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  offset: number;
  speed: number;
}

const colors: Record<string, string> = {
  SYS_CARDIOVASCULAR: "#ff8174",
  SYS_RESPIRATORY: "#70d6eb",
  SYS_DIGESTIVE: "#f4b06a",
  SYS_URINARY: "#b8a2ff",
  SYS_NERVOUS: "#ffd67a",
  SYS_MUSCULOSKELETAL: "#ff9c85",
};

export class PhysiologyAnimator {
  readonly group = new THREE.Group();
  private particles: FlowParticle[] = [];
  private targets: THREE.Mesh[] = [];
  private systemId = "SYS_CARDIOVASCULAR";
  private elapsed = 0;

  constructor() {
    this.group.name = "Physiology_Pathway_Visualization";
    this.group.visible = false;
  }

  configure(systemId: string, points: THREE.Vector3[], targets: THREE.Mesh[] = []) {
    for (const child of [...this.group.children]) {
      this.group.remove(child);
      disposeObject(child);
    }
    this.particles = [];
    this.targets = targets;
    this.systemId = systemId;
    this.elapsed = 0;
    if (points.length < 2) return;
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    this.createStream(curve, colors[systemId] ?? "#7ed7dc", 20);
  }

  private createStream(curve: THREE.CatmullRomCurve3, color: string, count: number) {
    const path = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 96, 0.02, 8, false),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    path.renderOrder = 4;
    this.group.add(path);
    for (let index = 0; index < count; index += 1) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 12, 10),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.98,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      mesh.renderOrder = 5;
      this.group.add(mesh);
      this.particles.push({ mesh, curve, offset: index / count, speed: 0.1 });
    }
  }

  setEnabled(enabled: boolean) {
    this.group.visible = enabled;
    if (!enabled) {
      for (const target of this.targets) {
        if (target.userData.physiologyScale instanceof THREE.Vector3)
          target.scale.copy(target.userData.physiologyScale as THREE.Vector3);
      }
    }
  }

  update(delta: number) {
    if (!this.group.visible) return;
    this.elapsed += delta;
    for (const particle of this.particles) {
      particle.mesh.position.copy(
        particle.curve.getPointAt((particle.offset + this.elapsed * particle.speed) % 1),
      );
      particle.mesh.scale.setScalar(0.82 + Math.sin(this.elapsed * 4 + particle.offset * 8) * 0.18);
    }
    if (this.systemId === "SYS_RESPIRATORY") {
      const breath = 1 + Math.sin(this.elapsed * 1.6) * 0.045;
      for (const target of this.targets) {
        if (!(target.userData.physiologyScale instanceof THREE.Vector3))
          target.userData.physiologyScale = target.scale.clone();
        target.scale.copy(target.userData.physiologyScale as THREE.Vector3).multiplyScalar(breath);
      }
    }
  }
}
