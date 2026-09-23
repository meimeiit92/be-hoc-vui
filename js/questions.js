/* =============================================================
   QUESTIONS — sinh đề kiểm tra cho từng bài
   Trả về mảng câu hỏi chuẩn hoá:
   {
     itemId, kind, question,
     prompt: { type, text, sub, emoji, speak },
     options: [{ id, label, sub, emoji, style }],
     answerId, input
   }
   ============================================================= */

import { poolOf } from './curriculum.js';
import { mastery, itemStat } from './storage.js';

/* ---------- random ---------- */
const rnd = Math.random;
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- chọn item theo mức độ cần luyện ---------- */
function weightOf(cardId) {
  const st = itemStat(cardId);
  if (!st || !st.seen) return 2.2; // chưa gặp
  const m = mastery(cardId);
  if (m >= 1) return 0.6; // đã thuộc
  const acc = st.ok / st.seen;
  return 1.4 + (1 - acc) * 2.6 + (1 - m) * 1.2; // càng sai càng hay ra
}

function weightedSample(cards, count) {
  const out = [];
  const pool = cards.slice();

  // Nếu bài ít thẻ → phủ hết trước
  if (pool.length <= count) {
    out.push(...shuffle(pool));
  }

  let guard = 0;
  while (out.length < count && guard++ < count * 60) {
    const total = pool.reduce((a, c) => a + weightOf(c.id), 0);
    let r = rnd() * total;
    let chosen = pool[0];
    for (const c of pool) {
      r -= weightOf(c.id);
      if (r <= 0) { chosen = c; break; }
    }
    // tránh lặp liền nhau
    if (out.length && out[out.length - 1].id === chosen.id && pool.length > 1) continue;
    out.push(chosen);
  }
  return out.slice(0, count);
}

/* ---------- lấy đáp án nhiễu ---------- */
function distractors(card, lesson, n, keyFn) {
  const key = keyFn(card);
  const local = lesson.cards.filter((c) => keyFn(c) !== key);
  const global = poolOf(lesson.subject).filter((c) => keyFn(c) !== key);
  const seen = new Set([key]);
  const out = [];
  for (const c of [...shuffle(local), ...shuffle(global)]) {
    const k = keyFn(c);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
    if (out.length >= n) break;
  }
  return out;
}

/* ---------- các dạng câu hỏi cho thẻ ---------- */
const KIND_BUILDERS = {
  /* Nghe âm → chọn chữ */
  audio2card(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.main);
    const opts = shuffle([card, ...ds]).map((c) => ({
      id: c.id, label: c.main, style: c.main.length > 10 ? 'text-sm' : 'text-lg',
    }));
    return {
      kind: 'audio2card',
      question: 'Nghe rồi chọn đáp án đúng',
      prompt: { type: 'audio', speak: card.speak, emoji: '🔊' },
      options: opts,
      answerId: card.id,
    };
  },

  /* Thấy chữ → chọn hình đúng */
  card2pic(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.emoji + c.hint);
    const opts = shuffle([card, ...ds]).map((c) => ({
      id: c.id, emoji: c.emoji, label: c.hint, style: 'pic',
    }));
    return {
      kind: 'card2pic',
      question: 'Chọn hình đúng với chữ này',
      prompt: { type: 'text', text: card.main, sub: card.sub, speak: card.speak },
      options: opts,
      answerId: card.id,
    };
  },

  /* Thấy hình + từ → chọn chữ / vần */
  pic2card(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.main);
    const opts = shuffle([card, ...ds]).map((c) => ({ id: c.id, label: c.main, style: 'text-lg' }));
    return {
      kind: 'pic2card',
      question: lesson.subject === 'read' ? 'Từ này có vần nào?' : 'Từ này ứng với chữ nào?',
      prompt: { type: 'emoji', emoji: card.emoji, text: card.hint, speak: card.speakHint || card.speak },
      options: opts,
      answerId: card.id,
    };
  },

  /* Dấu thanh: thấy tiếng → chọn tên dấu */
  card2name(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.sub);
    const opts = shuffle([card, ...ds]).map((c) => ({ id: c.id, label: c.sub, style: 'text-md' }));
    return {
      kind: 'card2name',
      question: 'Tiếng này mang dấu gì?',
      prompt: { type: 'text', text: card.main, speak: card.speak },
      options: opts,
      answerId: card.id,
    };
  },

  /* Dấu thanh: nghe tên dấu → chọn tiếng */
  name2card(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.main);
    const opts = shuffle([card, ...ds]).map((c) => ({ id: c.id, label: c.main, style: 'text-lg' }));
    return {
      kind: 'name2card',
      question: `Tiếng nào mang ${card.sub}?`,
      prompt: { type: 'text', text: card.sub, speak: { text: card.sub, lang: 'vi' } },
      options: opts,
      answerId: card.id,
    };
  },

  /* Từ vựng: thấy hình → chọn từ tiếng Anh */
  pic2word(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.main);
    const opts = shuffle([card, ...ds]).map((c) => ({ id: c.id, label: c.main, style: 'text-md' }));
    return {
      kind: 'pic2word',
      question: 'This is a…?',
      prompt: { type: 'emoji', emoji: card.emoji, sub: card.sub },
      options: opts,
      answerId: card.id,
    };
  },

  /* Từ vựng: thấy từ tiếng Anh → chọn hình */
  word2pic(card, lesson) {
    const ds = distractors(card, lesson, 3, (c) => c.emoji);
    const opts = shuffle([card, ...ds]).map((c) => ({ id: c.id, emoji: c.emoji, style: 'pic' }));
    return {
      kind: 'word2pic',
      question: 'Chọn hình đúng',
      prompt: { type: 'text', text: card.main, speak: card.speak },
      options: opts,
      answerId: card.id,
    };
  },
};

/* ---------- toán ---------- */
function mathQuestion(lesson) {
  const q = lesson.gen(Math.random);
  return {
    itemId: q.itemId,
    kind: 'math',
    question: q.promptSub || 'Tính nhẩm rồi chọn đáp án',
    prompt: {
      type: q.promptEmoji ? 'math-emoji' : 'math',
      text: q.promptText,
      emoji: q.promptEmoji || '',
      speak: q.speak,
    },
    options: shuffle(q.options).map((o) => ({
      id: `opt-${o}`,
      label: o,
      style: q.optionStyle === 'emoji' ? 'pic' : q.optionStyle === 'symbol' ? 'text-xl' : 'text-lg',
    })),
    answerId: `opt-${q.answer}`,
    input: q.input || 'choice',
  };
}

/* =============================================================
   API chính
   ============================================================= */
export function buildQuiz(lesson, count = 10) {
  if (lesson.type === 'math') {
    const seen = new Set();
    const qs = [];
    let guard = 0;
    while (qs.length < count && guard++ < count * 30) {
      const q = mathQuestion(lesson);
      const sig = q.prompt.text + '|' + q.itemId;
      if (seen.has(sig)) continue;
      seen.add(sig);
      qs.push(q);
    }
    return qs;
  }

  const cards = weightedSample(lesson.cards, count);
  const kinds = lesson.kinds && lesson.kinds.length ? lesson.kinds : ['audio2card', 'card2pic'];
  return cards.map((card, i) => {
    // xoay vòng các dạng để bài test đa dạng
    const kind = kinds[i % kinds.length];
    const build = KIND_BUILDERS[kind] || KIND_BUILDERS.audio2card;
    const q = build(card, lesson);
    return { itemId: card.id, input: 'choice', ...q };
  });
}

export const QUESTION_COUNT = 10;
