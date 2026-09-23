/* =============================================================
   CURRICULUM — gom toàn bộ bài học thành 1 lộ trình có thứ tự
   ============================================================= */

import { VN_LETTERS, VN_TONES, VN_DIGRAPHS } from './data/vietnamese.js';
import { VN_RIMES, VN_BLENDS } from './data/vn-reading.js';
import { EN_LETTERS, EN_TOPICS } from './data/english.js';
import { MATH_LESSONS } from './data/math.js';

export const SUBJECTS = {
  vn:    { key: 'vn',    title: 'Chữ cái tiếng Việt', short: 'Tiếng Việt', emoji: '🇻🇳', color: 'vn',    hue: '#E8553D' },
  read:  { key: 'read',  title: 'Tập đọc tiếng Việt', short: 'Tập đọc',   emoji: '📖', color: 'read',  hue: '#8B5CF6' },
  math:  { key: 'math',  title: 'Toán cộng trừ',      short: 'Toán',      emoji: '🔢', color: 'math',  hue: '#2F7DD1' },
  en:    { key: 'en',    title: 'Alphabet tiếng Anh', short: 'Tiếng Anh', emoji: '🔤', color: 'en',    hue: '#3E9B57' },
  vocab: { key: 'vocab', title: 'Từ vựng tiếng Anh',  short: 'Từ vựng',   emoji: '🧺', color: 'vocab', hue: '#B4661A' },
};

export const SUBJECT_ORDER = ['vn', 'read', 'math', 'en', 'vocab'];

/* --- helpers --- */
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* Chuẩn hoá 1 item thành "card" dùng chung cho học & test */
function vnCard(l) {
  return {
    id: l.id,
    main: `${l.upper} ${l.char}`,
    key: l.char,
    sub: `đọc: ${l.name}`,
    emoji: l.emoji,
    hint: l.word,
    speak: { text: l.name, lang: 'vi' },
    speakHint: { text: l.word, lang: 'vi' },
  };
}

function toneCard(t) {
  return {
    id: t.id,
    main: t.word,
    key: t.word,
    sub: t.name,
    emoji: t.emoji,
    hint: t.tone,
    speak: { text: t.word, lang: 'vi' },
    speakHint: { text: t.name, lang: 'vi' },
  };
}

function rimeCard(r) {
  return {
    id: r.id,
    main: r.char,
    key: r.char,
    sub: `ví dụ: ${r.word}`,
    emoji: r.emoji,
    hint: r.word,
    speak: { text: r.char, lang: 'vi' },
    speakHint: { text: r.word, lang: 'vi' },
  };
}

function blendCard(b) {
  return {
    id: b.id,
    main: b.char,
    key: b.char,
    sub: b.onset !== undefined && b.onset !== '' ? `${b.onset} + ${b.rime} → ${b.char}` : (b.word || ''),
    emoji: b.emoji,
    hint: b.word || b.char,
    speak: { text: b.char, lang: 'vi' },
    speakHint: { text: b.word || b.char, lang: 'vi' },
  };
}

function enCard(l) {
  return {
    id: l.id,
    main: `${l.upper} ${l.char}`,
    key: l.char,
    sub: `${l.sound} — ${l.word}`,
    emoji: l.emoji,
    hint: l.word,
    hintVi: l.vi,
    // Gửi cho bộ đọc cách phát âm TÊN chữ cái ("ay", "bee"…) thay vì một ký tự
    // trần ("A"): nhiều giọng đọc gặp ký tự đơn lẻ sẽ tự thêm "letter"/"capital".
    speak: { text: l.say || l.upper, lang: 'en' },
    speakHint: { text: l.word, lang: 'en' },
  };
}

function vocabCard(w) {
  return {
    id: w.id,
    main: w.word,
    key: w.word,
    sub: w.vi,
    emoji: w.emoji,
    hint: w.word,
    hintVi: w.vi,
    speak: { text: w.word, lang: 'en' },
    speakHint: { text: w.word, lang: 'en' },
  };
}

/* =============================================================
   Danh sách bài học
   ============================================================= */
const lessons = [];
let seq = 0;

function addLesson(l) {
  lessons.push({ order: seq++, ...l });
}

/* ---------- 1. Chữ cái tiếng Việt ---------- */
const vnGroups = chunk(VN_LETTERS, 6);
vnGroups.forEach((g, i) => {
  addLesson({
    id: `vn-group-${i + 1}`,
    subject: 'vn',
    title: `Chữ cái ${g[0].upper} → ${g[g.length - 1].upper}`,
    emoji: '🔠',
    desc: `${g.length} chữ: ${g.map((x) => x.upper).join(' ')}`,
    type: 'cards',
    cards: g.map(vnCard),
    kinds: ['audio2card', 'card2pic', 'pic2card'],
  });
});
addLesson({
  id: 'vn-tones',
  subject: 'vn',
  title: 'Năm dấu thanh',
  emoji: '〰️',
  desc: 'Sắc, huyền, hỏi, ngã, nặng',
  type: 'cards',
  cards: VN_TONES.map(toneCard),
  kinds: ['audio2card', 'card2name', 'name2card'],
});
chunk(VN_DIGRAPHS, 6).forEach((g, i) => {
  addLesson({
    id: `vn-digraph-${i + 1}`,
    subject: 'vn',
    title: `Âm ghép ${g[0].upper} → ${g[g.length - 1].upper}`,
    emoji: '🧩',
    desc: g.map((x) => x.upper).join(' '),
    type: 'cards',
    cards: g.map(vnCard),
    kinds: ['audio2card', 'card2pic', 'pic2card'],
  });
});
addLesson({
  id: 'vn-review',
  subject: 'vn',
  title: 'Ôn tập bảng chữ cái',
  emoji: '🏆',
  desc: 'Trộn 29 chữ cái và âm ghép',
  type: 'cards',
  review: true,
  cards: [...VN_LETTERS.map(vnCard), ...VN_DIGRAPHS.map(vnCard)],
  kinds: ['audio2card', 'card2pic', 'pic2card'],
});

/* ---------- 2. Tập đọc ---------- */
VN_RIMES.forEach((grp) => {
  addLesson({
    id: `read-${grp.key}`,
    subject: 'read',
    title: grp.title,
    emoji: '🎵',
    desc: grp.items.map((i) => i.char).join(' · '),
    type: 'cards',
    cards: grp.items.map(rimeCard),
    kinds: ['audio2card', 'card2pic', 'pic2card'],
  });
});
VN_BLENDS.forEach((grp) => {
  addLesson({
    id: `read-${grp.key}`,
    subject: 'read',
    title: grp.title,
    emoji: grp.sentences ? '📜' : '🔗',
    desc: grp.sentences ? 'Đọc và hiểu câu ngắn' : grp.items.map((i) => i.char).join(' · '),
    type: 'cards',
    cards: grp.items.map(blendCard),
    kinds: grp.sentences ? ['audio2card', 'card2pic'] : ['audio2card', 'card2pic', 'pic2card'],
  });
});

/* ---------- 3. Toán ---------- */
MATH_LESSONS.forEach((m) => {
  addLesson({
    id: `math-${m.key}`,
    subject: 'math',
    title: m.title,
    emoji: m.emoji,
    desc: m.desc,
    type: 'math',
    gen: m.gen,
    review: !!m.review,
  });
});

/* ---------- 4. Alphabet tiếng Anh ---------- */
chunk(EN_LETTERS, 7).forEach((g, i) => {
  addLesson({
    id: `en-group-${i + 1}`,
    subject: 'en',
    title: `Letters ${g[0].upper} → ${g[g.length - 1].upper}`,
    emoji: '🔡',
    desc: g.map((x) => x.upper).join(' '),
    type: 'cards',
    cards: g.map(enCard),
    kinds: ['audio2card', 'card2pic', 'pic2card'],
  });
});
addLesson({
  id: 'en-review',
  subject: 'en',
  title: 'Ôn tập A → Z',
  emoji: '🏆',
  desc: 'Trộn cả 26 chữ',
  type: 'cards',
  review: true,
  cards: EN_LETTERS.map(enCard),
  kinds: ['audio2card', 'card2pic', 'pic2card'],
});

/* ---------- 5. Từ vựng tiếng Anh ---------- */
EN_TOPICS.forEach((t) => {
  addLesson({
    id: `vocab-${t.key}`,
    subject: 'vocab',
    title: t.title,
    emoji: t.emoji,
    desc: `${t.items.length} từ mới`,
    type: 'cards',
    cards: t.items.map(vocabCard),
    kinds: ['audio2card', 'pic2word', 'word2pic'],
  });
});
addLesson({
  id: 'vocab-review',
  subject: 'vocab',
  title: 'Ôn tập từ vựng',
  emoji: '🏆',
  desc: 'Trộn tất cả chủ đề',
  type: 'cards',
  review: true,
  cards: EN_TOPICS.flatMap((t) => t.items.map(vocabCard)),
  kinds: ['audio2card', 'pic2word', 'word2pic'],
});

export const LESSONS = lessons;

export const LESSON_BY_ID = Object.fromEntries(lessons.map((l) => [l.id, l]));

export function lessonsOf(subject) {
  return lessons.filter((l) => l.subject === subject);
}

/* Toàn bộ card của 1 môn — dùng để bốc đáp án nhiễu và ôn tập */
export function poolOf(subject) {
  return lessonsOf(subject)
    .filter((l) => l.type === 'cards')
    .flatMap((l) => l.cards);
}

/* Tìm bài học chứa 1 item bất kỳ */
export function lessonOfItem(itemId) {
  const card = lessons.find(
    (l) => l.type === 'cards' && l.cards.some((c) => c.id === itemId)
  );
  if (card) return card;
  return LESSON_BY_ID[mathLessonIdOf(itemId)] || null;
}

/* Suy ra bài toán tương ứng với 1 item toán */
function mathLessonIdOf(id) {
  let m;
  if ((m = id.match(/^m-count-(\d+)$/))) return +m[1] <= 10 ? 'math-count-10' : 'math-count-20';
  if (id.startsWith('m-numid-')) return 'math-numid-10';
  if (id.startsWith('m-cmp-')) return 'math-cmp-10';
  if ((m = id.match(/^m-add-(\d+)\+(\d+)$/))) {
    const s = +m[1] + +m[2];
    return s <= 5 ? 'math-add-5' : s <= 10 ? 'math-add-10' : 'math-add-20';
  }
  if ((m = id.match(/^m-sub-(\d+)-(\d+)$/))) {
    const a = +m[1];
    return a <= 5 ? 'math-sub-5' : a <= 10 ? 'math-sub-10' : 'math-sub-20';
  }
  if (id.startsWith('m-miss-')) return 'math-missing';
  if (id.startsWith('m-story-')) return 'math-story';
  return null;
}

/* Nhãn dễ đọc cho 1 item (dùng ở trang phụ huynh) */
export function describeItem(itemId) {
  const lesson = lessonOfItem(itemId);
  if (lesson && lesson.type === 'cards') {
    const c = lesson.cards.find((x) => x.id === itemId);
    if (c) return { label: `${c.emoji} ${c.main}`, lesson };
  }
  let m;
  if ((m = itemId.match(/^m-count-(\d+)$/))) return { label: `🔢 đếm ${m[1]}`, lesson };
  if ((m = itemId.match(/^m-numid-(\d+)$/))) return { label: `👀 số ${m[1]}`, lesson };
  if ((m = itemId.match(/^m-cmp-(\d+)-(\d+)-/))) return { label: `⚖️ ${m[1]} và ${m[2]}`, lesson };
  if ((m = itemId.match(/^m-add-(\d+)\+(\d+)$/))) return { label: `➕ ${m[1]} + ${m[2]}`, lesson };
  if ((m = itemId.match(/^m-sub-(\d+)-(\d+)$/))) return { label: `➖ ${m[1]} − ${m[2]}`, lesson };
  if ((m = itemId.match(/^m-miss-(add|sub)-(\d+)$/))) return { label: `❓ ${m[1] === 'add' ? 'cộng' : 'trừ'} ra ${m[2]}`, lesson };
  if ((m = itemId.match(/^m-story-(add|sub)-(\d+)[+-](\d+)$/))) {
    return { label: `🧩 ${m[2]} ${m[1] === 'add' ? '+' : '−'} ${m[3]}`, lesson };
  }
  return { label: itemId, lesson };
}
