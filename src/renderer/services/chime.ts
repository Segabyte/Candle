/**
 * A soft completion chime synthesized with WebAudio — two gentle bell tones
 * that fade over ~4 seconds. No audio file needed, never loops, never loud.
 */
let ctx: AudioContext | null = null;

function tone(
  audio: AudioContext,
  freq: number,
  start: number,
  duration: number,
  peak: number
): void {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  // a hint of shimmer
  const overtone = audio.createOscillator();
  const overtoneGain = audio.createGain();
  overtone.type = "sine";
  overtone.frequency.value = freq * 2.76;
  overtoneGain.gain.value = 0.12;

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  overtone.connect(overtoneGain);
  overtoneGain.connect(gain);
  gain.connect(audio.destination);

  osc.start(start);
  overtone.start(start);
  osc.stop(start + duration + 0.1);
  overtone.stop(start + duration + 0.1);
}

export function playChime(): void {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime + 0.05;
    tone(ctx, 523.25, t, 3.5, 0.16); // C5
    tone(ctx, 783.99, t + 0.9, 4.0, 0.1); // G5
  } catch {
    // audio unavailable — stay silent, never interrupt
  }
}
