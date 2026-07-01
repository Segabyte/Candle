/**
 * The ivory candle: wax body, softened rim, melted-wax pool, side drips,
 * wick, flame quad and its warm lights.
 */
import * as THREE from "three";
import { createFlameMaterial } from "./flameShader";
import type { CandleSize } from "@shared/types";

export const SIZE_HEIGHTS: Record<CandleSize, number> = {
  small: 1.15,
  medium: 1.7,
  large: 2.3,
};

export const CANDLE_RADIUS = 0.5;
const WICK_HEIGHT = 0.14;
const FLAME_HEIGHT = 0.42;

export type CandleModel = {
  group: THREE.Group;
  body: THREE.Mesh;
  rim: THREE.Mesh;
  pool: THREE.Mesh;
  drips: THREE.Mesh[];
  wick: THREE.Mesh;
  flame: THREE.Mesh;
  flameMaterial: THREE.ShaderMaterial;
  flameLight: THREE.PointLight;
  innerGlow: THREE.PointLight;
  initialHeight: number;
};

const IVORY = 0xf3e9d4;

export function createCandle(size: CandleSize): CandleModel {
  const group = new THREE.Group();
  const initialHeight = SIZE_HEIGHTS[size];

  const waxMaterial = new THREE.MeshPhysicalMaterial({
    color: IVORY,
    roughness: 0.48,
    clearcoat: 0.25,
    clearcoatRoughness: 0.6,
    sheen: 0.4,
    sheenColor: new THREE.Color(0xffe8c0),
  });

  // Body — slightly tapered cylinder, many segments for a smooth silhouette.
  const bodyGeo = new THREE.CylinderGeometry(
    CANDLE_RADIUS * 0.96,
    CANDLE_RADIUS,
    1, // unit height; scaled at runtime for melting
    48,
    1
  );
  bodyGeo.translate(0, 0.5, 0); // pivot at the base so melting sinks the top
  const body = new THREE.Mesh(bodyGeo, waxMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Softened rim at the top edge — gently irregular, like warmed wax.
  const rimGeo = new THREE.TorusGeometry(CANDLE_RADIUS * 0.9, 0.045, 10, 48);
  const rimPos = rimGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < rimPos.count; i++) {
    const x = rimPos.getX(i);
    const z = rimPos.getZ(i);
    const angle = Math.atan2(z, x);
    rimPos.setY(i, rimPos.getY(i) + Math.sin(angle * 3.7) * 0.02 + Math.sin(angle * 7.3) * 0.012);
  }
  rimGeo.computeVertexNormals();
  const rim = new THREE.Mesh(rimGeo, waxMaterial);
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // Melted wax pool on top — warm, faintly glowing near the wick.
  const poolMaterial = new THREE.MeshStandardMaterial({
    color: 0xf7dfae,
    roughness: 0.25,
    emissive: 0xff8c2e,
    emissiveIntensity: 0.28,
  });
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(CANDLE_RADIUS * 0.88, 48),
    poolMaterial
  );
  pool.rotation.x = -Math.PI / 2;
  group.add(pool);

  // Wax drips down the side, growing as the candle melts.
  const drips: THREE.Mesh[] = [];
  const dripAngles = [0.4, 2.0, 3.6, 5.1];
  for (const angle of dripAngles) {
    const dripGeo = new THREE.SphereGeometry(0.05, 12, 12);
    dripGeo.scale(0.75, 3.2, 0.55);
    const drip = new THREE.Mesh(dripGeo, waxMaterial);
    drip.position.set(
      Math.cos(angle) * CANDLE_RADIUS * 0.99,
      0,
      Math.sin(angle) * CANDLE_RADIUS * 0.99
    );
    drip.castShadow = true;
    group.add(drip);
    drips.push(drip);
  }

  // Wick — dark, slightly bent, shortening over the session.
  const wickGeo = new THREE.CylinderGeometry(0.012, 0.018, 1, 8);
  wickGeo.translate(0, 0.5, 0);
  const wick = new THREE.Mesh(
    wickGeo,
    new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.95 })
  );
  wick.rotation.z = 0.06;
  group.add(wick);

  // Flame — billboarded shader quad above the wick.
  const flameMaterial = createFlameMaterial();
  const flame = new THREE.Mesh(
    new THREE.PlaneGeometry(FLAME_HEIGHT * 0.62, FLAME_HEIGHT),
    flameMaterial
  );
  group.add(flame);

  // Warm light cast by the flame (the room's only real light source).
  const flameLight = new THREE.PointLight(0xffa64d, 14, 12, 2);
  flameLight.castShadow = true;
  flameLight.shadow.mapSize.set(512, 512);
  flameLight.shadow.bias = -0.004;
  group.add(flameLight);

  // Faint light inside the wax so the top glows through, like real candles.
  const innerGlow = new THREE.PointLight(0xff9540, 1.6, 1.6, 2);
  group.add(innerGlow);

  return {
    group,
    body,
    rim,
    pool,
    drips,
    wick,
    flame,
    flameMaterial,
    flameLight,
    innerGlow,
    initialHeight,
  };
}

export const CANDLE_DIMS = { WICK_HEIGHT, FLAME_HEIGHT };
