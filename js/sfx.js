/* =============================================================
   SFX — âm thanh phản hồi bằng Web Audio (không cần file mp3)
   ============================================================= */

let ctx = null;
let on = true;

function ac() {
  if (!on) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch (e) {
    return null;
  }
}

export function setEnabled(v) {
  on = !!v;
}
export function isEnabled() {
  return on;
}

function tone(freq, start, dur, { type = 'sine', gain = 0.18 } = {}) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.02);
}

export const click = () => tone(660, 0, 0.06, { type: 'triangle', gain: 0.08 });

export const correct = () => {
  tone(784, 0, 0.12, { type: 'triangle' });
  tone(1046, 0.1, 0.18, { type: 'triangle' });
};

export const wrong = () => {
  tone(300, 0, 0.14, { type: 'sawtooth', gain: 0.1 });
  tone(220, 0.12, 0.2, { type: 'sawtooth', gain: 0.1 });
};

export const win = () => {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.13, 0.28, { type: 'triangle' }));
};

export const star = () => {
  tone(1200, 0, 0.08, { type: 'sine', gain: 0.1 });
  tone(1600, 0.07, 0.1, { type: 'sine', gain: 0.08 });
};
