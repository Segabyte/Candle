/**
 * Procedural candle flame: a billboarded plane running a noise-driven
 * teardrop shader. White-gold core, amber body, faint blue at the base,
 * with natural flicker from fbm noise.
 */
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity; // 1 = burning, 0 = out
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
               u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // p.x in [-0.5, 0.5], p.y in [0, 1] bottom→top of flame quad
    vec2 p = vec2(vUv.x - 0.5, vUv.y);

    // Rising turbulence bends the flame; stronger near the tip.
    float sway = fbm(vec2(p.x * 2.5 + uTime * 0.7, p.y * 3.5 - uTime * 2.4));
    p.x += (sway - 0.5) * 0.22 * smoothstep(0.15, 1.0, p.y);
    p.x += sin(uTime * 9.0 + p.y * 6.0) * 0.012 * p.y; // quick shimmer

    // Teardrop silhouette: wide near the base, tapering to the tip.
    float w = mix(0.19, 0.015, smoothstep(0.08, 0.95, p.y));
    w *= 0.75 + 0.25 * fbm(vec2(uTime * 1.6, p.y * 5.0));
    float base = smoothstep(0.0, 0.12, p.y) * (1.0 - smoothstep(0.86, 1.0, p.y));
    float d = abs(p.x) / max(w, 0.001);
    float body = (1.0 - smoothstep(0.55, 1.0, d)) * base;

    // Bright inner core, hovering just above the wick.
    float core = (1.0 - smoothstep(0.0, 0.55, length(vec2(p.x * 3.2, (p.y - 0.28) * 1.9)))) * base;

    // Blue combustion zone at the very base of the flame.
    float blue = (1.0 - smoothstep(0.0, 0.35, length(vec2(p.x * 3.4, (p.y - 0.05) * 3.0))));

    vec3 colBody = vec3(1.0, 0.55, 0.12);
    vec3 colCore = vec3(1.0, 0.93, 0.72);
    vec3 colBlue = vec3(0.25, 0.42, 1.0);

    vec3 col = colBody * body * 1.2;
    col = mix(col, colCore, core * 0.95);
    col += colBlue * blue * 0.35 * body;

    float alpha = clamp(body * 1.4 + core, 0.0, 1.0) * uIntensity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col * uIntensity, alpha);
  }
`;

export function createFlameMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
