import * as THREE from "three";

interface FlowParticle {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  offset: number;
  speed: number;
  pulseOffset: number;
}

export class PhysiologyAnimator {
  readonly group = new THREE.Group();
  private readonly particles: FlowParticle[] = [];
  private elapsed = 0;

  constructor() {
    this.group.name = "Blood_Flow_Visualization";
    this.group.visible = false;
    const venous = new THREE.CatmullRomCurve3(
      [
        [1.08, 2, 0],
        [1.03, 1.1, 0.17],
        [0.81, 0.59, 0.32],
        [0.55, 0.14, 0.63],
        [0.36, -0.43, 0.56],
        [0.1, 0.31, 0.67],
        [0.2, 0.99, 0.74],
        [0.66, 1.57, 0.33],
      ].map(([x, y, z]) => new THREE.Vector3(x, y - 0.2, z)),
    );
    const arterial = new THREE.CatmullRomCurve3(
      [
        [-0.72, 1.01, 0.12],
        [-0.48, 0.62, 0.42],
        [-0.43, 0.15, 0.73],
        [-0.46, -0.54, 0.67],
        [-0.23, 0.09, 0.65],
        [-0.23, 0.8, 0.46],
        [-0.3, 1.43, 0.13],
        [-0.54, 1.97, -0.02],
        [-0.98, 1.97, -0.15],
      ].map(([x, y, z]) => new THREE.Vector3(x, y - 0.2, z)),
    );
    this.createStream(venous, "#67b5ff", 18);
    this.createStream(arterial, "#ff8174", 18);
  }

  private createStream(curve: THREE.CatmullRomCurve3, color: string, count: number) {
    const path = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 96, 0.018, 8, false),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    path.renderOrder = 4;
    this.group.add(path);
    const geometry = new THREE.SphereGeometry(0.061, 14, 12);
    for (let index = 0; index < count; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.98,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geometry.clone(), material);
      mesh.renderOrder = 5;
      this.group.add(mesh);
      this.particles.push({
        mesh,
        curve,
        offset: index / count,
        speed: 0.105,
        pulseOffset: (index / count) * Math.PI * 2,
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.group.visible = enabled;
  }

  update(delta: number) {
    if (!this.group.visible) return;
    this.elapsed += delta;
    for (const particle of this.particles) {
      particle.mesh.position.copy(
        particle.curve.getPointAt((particle.offset + this.elapsed * particle.speed) % 1),
      );
      const pulse = 0.82 + Math.sin(this.elapsed * 4.2 + particle.pulseOffset) * 0.2;
      particle.mesh.scale.setScalar(pulse);
    }
  }
}
