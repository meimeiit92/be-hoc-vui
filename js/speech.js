/* =============================================================
   SPEECH — phát âm bằng Web Speech API của trình duyệt
   ============================================================= */

let voices = [];
let ready = false;
let enabled = true;

const LANG = { vi: ['vi-VN', 'vi'], en: ['en-US', 'en-GB', 'en-AU', 'en'] };

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices() || [];
  ready = voices.length > 0;
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // Safari/iOS đôi khi trả rỗng lần đầu
  setTimeout(loadVoices, 300);
  setTimeout(loadVoices, 1200);
}

export function supported() {
  return 'speechSynthesis' in window;
}

export function voiceFor(lang) {
  if (!ready) loadVoices();
  const prefs = LANG[lang] || [lang];
  for (const p of prefs) {
    const exact = voices.find((v) => v.lang.toLowerCase() === p.toLowerCase());
    if (exact) return exact;
  }
  for (const p of prefs) {
    const loose = voices.find((v) => v.lang.toLowerCase().startsWith(p.slice(0, 2).toLowerCase()));
    if (loose) return loose;
  }
  return null;
}

export function hasVoice(lang) {
  return !!voiceFor(lang);
}

export function setEnabled(v) {
  enabled = !!v;
  if (!enabled && supported()) window.speechSynthesis.cancel();
}

export function isEnabled() {
  return enabled;
}

/** Đọc 1 đoạn text. lang: 'vi' | 'en' */
export function speak(text, lang = 'vi', { rate = 0.82, pitch = 1.15 } = {}) {
  if (!enabled || !supported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    const v = voiceFor(lang);
    if (v) u.voice = v;
    u.lang = v ? v.lang : (LANG[lang] ? LANG[lang][0] : lang);
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* im lặng bỏ qua */
  }
}

/** Đọc nối tiếp nhiều đoạn (vd: chữ cái rồi từ ví dụ) */
export function speakSeq(parts, { rate = 0.82, gap = 260 } = {}) {
  if (!enabled || !supported() || !parts || !parts.length) return;
  window.speechSynthesis.cancel();
  parts.forEach((p, i) => {
    setTimeout(() => {
      if (!enabled) return;
      const u = new SpeechSynthesisUtterance(String(p.text));
      const v = voiceFor(p.lang || 'vi');
      if (v) u.voice = v;
      u.lang = v ? v.lang : (LANG[p.lang] ? LANG[p.lang][0] : 'vi-VN');
      u.rate = rate;
      u.pitch = 1.15;
      window.speechSynthesis.speak(u);
    }, i * (gap + 700));
  });
}

export function stop() {
  if (supported()) window.speechSynthesis.cancel();
}
