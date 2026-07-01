/** Soft wisps of smoke released when the flame goes out. */
import * as THREE from "three";

const COUNT = 60;

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (180.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = (1.0 - smoothstep(0.2, 1.0, d)) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(0.62, 0.6, 0.58), a);
  }
`;

type Particle = {
  active: boolean;
  life: number;
  maxLife: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  seed: number;
};

export class SmokeParticles {
  readonly points: THREE.Points;
  private particles: Particle[] = [];
  private geometry: THREE.BufferGeometry;
  private emitting = false;
  private emitTimer = 0;
  private origin = new THREE.Vector3();
  private time = 0;

  constructor() {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);
    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    this.points = new THREE.Points(this.geometry, material);
    this.points.frustumCulled = false;

    for (let i = 0; i < COUNT; i++) {
      this.particles.push({
        active: false,
        life: 0,
        maxLife: 1,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        seed: Math.random() * 100,
      });
    }
  }

  /** Begin releasing smoke from the wick tip for ~3.5 seconds. */
  start(origin: THREE.Vector3): void {
    this.origin.copy(origin);
    this.emitting = true;
    this.emitTimer = 3.5;
  }

  stop(): void {
    this.emitting = false;
    for (const p of this.particles) p.active = false;
  }

  update(dt: number): void {
    this.time += dt;
    if (this.emitting) {
      this.emitTimer -= dt;
      if (this.emitTimer <= 0) this.emitting = false;
      // release a couple of wisps per frame while emitting
      let toEmit = 2;
      for (const p of this.particles) {
        if (toEmit === 0) break;
        if (!p.active) {
          p.active = true;
          p.life = 0;
          p.maxLife = 1.8 + Math.random() * 1.6;
          p.pos.copy(this.origin);
          p.pos.x += (Math.random() - 0.5) * 0.03;
          p.vel.set(
            (Math.random() - 0.5) * 0.06,
            0.28 + Math.random() * 0.18,
            (Math.random() - 0.5) * 0.06
          );
          toEmit--;
        }
      }
    }

    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    const sizes = this.geometry.attributes.aSize as THREE.BufferAttribute;
    const alphas = this.geometry.attributes.aAlpha as THREE.BufferAttribute;

    this.particles.forEach((p, i) => {
      if (!p.active) {
        alphas.setX(i, 0);
        return;
      }
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        alphas.setX(i, 0);
        return;
      }
      const t = p.life / p.maxLife;
      // gentle sideways drift as the wisp rises
      p.pos.x += (p.vel.x + Math.sin(this.time * 1.8 + p.seed) * 0.04) * dt;
      p.pos.z += (p.vel.z + Math.cos(this.time * 1.5 + p.seed) * 0.03) * dt;
      p.pos.y += p.vel.y * dt;
      positions.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
      sizes.setX(i, 0.05 + t * 0.22);
      alphas.setX(i, 0.35 * Math.sin(Math.PI * t)); // fade in, fade out
    });

    positions.needsUpdate = true;
    sizes.needsUpdate = true;
    alphas.needsUpdate = true;
  }
}
