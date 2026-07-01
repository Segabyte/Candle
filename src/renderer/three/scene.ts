/**
 * The candle-lit room: renderer, camera, floor shadow, and the animation
 * loop that drives flicker, melting, extinguishing, and smoke.
 */
import * as THREE from "three";
import { createCandle, type CandleModel, SIZE_HEIGHTS } from "./candleModel";
import { applyMelt, wickTip } from "./waxMeltAnimation";
import { SmokeParticles } from "./smokeParticles";
import type { CandleSize } from "@shared/types";

export class CandleSceneController {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private model: CandleModel;
  private smoke: SmokeParticles;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  private progress = 0;
  private lit = false;
  private flameStrength = 0; // eased 0..1 — lighting/extinguishing
  private size: CandleSize;
  private mini: boolean;

  constructor(canvas: HTMLCanvasElement, size: CandleSize, mini = false) {
    this.size = size;
    this.mini = mini;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !mini,
      alpha: true,
      powerPreference: mini ? "low-power" : "default",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !mini;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    this.frameCamera();

    // Near-darkness with the faintest cool ambient, so the flame owns the room.
    this.scene.add(new THREE.AmbientLight(0x2a2018, mini ? 2.2 : 1.4));
    const fill = new THREE.DirectionalLight(0x554433, 0.25);
    fill.position.set(-2, 3, 2);
    this.scene.add(fill);

    // Floor that only shows the candle's soft shadow.
    if (!mini) {
      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(6, 48),
        new THREE.ShadowMaterial({ opacity: 0.45 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.scene.add(floor);

      // Warm pool of light on the floor around the candle.
      const glowTex = makeRadialTexture();
      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(2.4, 48),
        new THREE.MeshBasicMaterial({
          map: glowTex,
          transparent: true,
          opacity: 0.28,
          depthWrite: false,
        })
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.002;
      this.scene.add(glow);
    }

    this.model = createCandle(size);
    this.scene.add(this.model.group);

    this.smoke = new SmokeParticles();
    this.scene.add(this.smoke.points);

    applyMelt(this.model, 0);
    this.setLit(false, true);
    this.animate();
  }

  private frameCamera(): void {
    const h = SIZE_HEIGHTS[this.size];
    const target = new THREE.Vector3(0, h * 0.52 + 0.15, 0);
    this.camera.position.set(0, h * 0.75 + 0.5, h * 1.15 + 2.6);
    this.camera.lookAt(target);
  }

  resize(width: number, height: number): void {
    if (width === 0 || height === 0) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setProgress(progress: number): void {
    this.progress = Math.min(1, Math.max(0, progress));
  }

  setSize(size: CandleSize): void {
    if (size === this.size) return;
    this.size = size;
    this.scene.remove(this.model.group);
    disposeGroup(this.model.group);
    this.model = createCandle(size);
    this.scene.add(this.model.group);
    applyMelt(this.model, this.progress);
    this.frameCamera();
    this.setLit(this.lit, true);
  }

  /** Light or extinguish the flame. Extinguishing releases smoke. */
  setLit(lit: boolean, immediate = false): void {
    if (lit === this.lit && !immediate) return;
    const wasLit = this.lit;
    this.lit = lit;
    if (immediate) this.flameStrength = lit ? 1 : 0;
    if (wasLit && !lit && !immediate) {
      const tipY = wickTip(this.model, this.progress);
      this.smoke.start(new THREE.Vector3(0.01, tipY + 0.03, 0));
    }
    if (lit) this.smoke.stop();
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);
    const t = this.clock.elapsedTime;

    // Ease the flame in (lighting) or out (gentle extinguish).
    const target = this.lit ? 1 : 0;
    const speed = this.lit ? 1.6 : 0.7; // going out is slower, softer
    this.flameStrength += (target - this.flameStrength) * Math.min(1, dt * speed * 3);
    if (Math.abs(this.flameStrength - target) < 0.01) this.flameStrength = target;

    applyMelt(this.model, this.progress);

    // Natural flicker: layered sines approximating candle turbulence.
    const flicker =
      0.82 +
      0.1 * Math.sin(t * 11.3) +
      0.05 * Math.sin(t * 23.7 + 1.4) +
      0.045 * Math.sin(t * 5.1 + 0.6) +
      0.035 * Math.sin(t * 41.0);

    this.model.flameMaterial.uniforms.uTime.value = t;
    this.model.flameMaterial.uniforms.uIntensity.value = this.flameStrength;
    this.model.flameLight.intensity = 14 * flicker * this.flameStrength;
    this.model.innerGlow.intensity = 1.6 * flicker * this.flameStrength;
    (this.model.pool.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.28 * flicker * this.flameStrength;
    this.model.flame.visible = this.flameStrength > 0.01;

    // subtle sideways breath of the flame light
    this.model.flameLight.position.x = Math.sin(t * 7.7) * 0.02;
    this.model.flameLight.position.z = Math.cos(t * 6.3) * 0.02;

    // billboard the flame toward the camera
    this.model.flame.quaternion.copy(this.camera.quaternion);

    this.smoke.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    disposeGroup(this.scene as unknown as THREE.Group);
    this.renderer.dispose();
  }
}

function makeRadialTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, "rgba(255, 166, 77, 1)");
  grad.addColorStop(0.5, "rgba(255, 140, 46, 0.35)");
  grad.addColorStop(1, "rgba(255, 140, 46, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function disposeGroup(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
}
