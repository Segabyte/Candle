/**
 * Maps session progress (0..1) onto the candle:
 * height sinks, wick shortens, the pool widens, drips lengthen.
 */
import type { CandleModel } from "./candleModel";
import { CANDLE_DIMS } from "./candleModel";

/** Fraction of the candle that remains as a stub when the session ends. */
const END_STUB = 0.14;

export function currentHeight(model: CandleModel, progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return model.initialHeight * (1 - p * (1 - END_STUB));
}

export function applyMelt(model: CandleModel, progress: number): void {
  const p = Math.min(1, Math.max(0, progress));
  const h = currentHeight(model, p);

  // Body sinks (pivot is at the base, so scaling lowers the top).
  model.body.scale.y = h;

  // Rim and pool ride the top surface; the pool widens as wax melts.
  model.rim.position.y = h - 0.012;
  model.pool.position.y = h + 0.004;
  const poolScale = 0.72 + 0.28 * Math.min(1, p * 2 + 0.25);
  model.pool.scale.setScalar(poolScale);

  // Wick shortens and chars as it burns down.
  const wickLen = CANDLE_DIMS.WICK_HEIGHT * (1 - p * 0.45);
  model.wick.scale.y = wickLen;
  model.wick.position.y = h - 0.01;

  // Flame and lights hover above the wick tip.
  const flameBase = h + wickLen - 0.02;
  model.flame.position.y = flameBase + CANDLE_DIMS.FLAME_HEIGHT * 0.5;
  model.flameLight.position.y = flameBase + 0.16;
  model.innerGlow.position.y = Math.max(0.1, h - 0.18);

  // Drips slide down and lengthen with melting.
  model.drips.forEach((drip, i) => {
    const start = 0.1 + i * 0.16; // each drip begins at a different moment
    const t = Math.min(1, Math.max(0, (p - start) / (1 - start + 0.001)));
    drip.visible = t > 0.02;
    const len = 0.05 + t * 0.3;
    drip.scale.set(0.75, len / 0.05, 0.55);
    drip.position.y = h - len * 1.4;
  });
}

/** Wick-tip position in candle-local space (smoke origin). */
export function wickTip(model: CandleModel, progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  const h = currentHeight(model, p);
  return h + CANDLE_DIMS.WICK_HEIGHT * (1 - p * 0.45);
}
