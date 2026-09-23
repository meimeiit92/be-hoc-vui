/* =============================================================
   STORAGE — lưu tiến trình học vào localStorage
   Có fallback sang bộ nhớ tạm nếu trình duyệt chặn storage.
   ============================================================= */

import { LESSONS, LESSON_BY_ID, SUBJECT_ORDER, lessonsOf, lessonOfItem } from './curriculum.js';

const KEY = 'behocvui.progress.v1';
const MASTERY_STREAK = 3; // trả lời đúng liên tiếp 3 lần = thuộc

let memoryOnly = false;
let cache = null;

function blank() {
  return {
    version: 1,
    profile: { name: 'Bé', avatar: '🐻' },
    stars: 0,
    streak: { count: 0, last: null },
    lessons: {},
    items: {},
    history: [],
    plan: { day: null, ids: [] },
    goal: 3,
    createdAt: new Date().toISOString(),
  };
}

export function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function dayOffset(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function read() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...blank(), ...JSON.parse(raw) } : blank();
  } catch (e) {
    memoryOnly = true;
    cache = blank();
  }
  return cache;
}

function write() {
  if (memoryOnly) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch (e) {
    memoryOnly = true;
  }
}

export const isMemoryOnly = () => memoryOnly;

export function state() {
  return read();
}

export function setProfile(name, avatar) {
  const s = read();
  if (name) s.profile.name = name;
  if (avatar) s.profile.avatar = avatar;
  write();
}

export function setGoal(n) {
  const s = read();
  s.goal = Math.max(1, Math.min(8, n | 0));
  s.plan = { day: null, ids: [] };
  write();
}

/* ---------- ghi nhận từng câu trả lời ---------- */
export function recordAnswer(itemId, correct) {
  if (!itemId) return;
  const s = read();
  const it = (s.items[itemId] ||= { seen: 0, ok: 0, wrong: 0, streak: 0, lastAt: null });
  it.seen++;
  if (correct) {
    it.ok++;
    it.streak++;
  } else {
    it.wrong++;
    it.streak = 0;
  }
  it.lastAt = new Date().toISOString();
}

/* ---------- kết thúc 1 bài ---------- */
export function finishLesson(lessonId, correct, total) {
  const s = read();
  const lesson = LESSON_BY_ID[lessonId];
  const ratio = total ? correct / total : 0;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;

  const rec = (s.lessons[lessonId] ||= { attempts: 0, best: 0, last: 0, stars: 0, doneAt: null });
  rec.attempts++;
  rec.last = ratio;
  rec.best = Math.max(rec.best, ratio);
  const gained = Math.max(0, stars - rec.stars);
  rec.stars = Math.max(rec.stars, stars);
  rec.doneAt = new Date().toISOString();

  s.stars += gained + correct; // sao thưởng: mỗi câu đúng 1 sao + sao thành tích
  s.history.push({
    day: today(),
    at: new Date().toISOString(),
    lessonId,
    subject: lesson ? lesson.subject : '?',
    correct,
    total,
    stars,
  });
  if (s.history.length > 400) s.history = s.history.slice(-400);

  // chuỗi ngày học
  const t = today();
  if (s.streak.last !== t) {
    s.streak.count = s.streak.last === dayOffset(-1) ? s.streak.count + 1 : 1;
    s.streak.last = t;
  }

  write();
  return { stars, ratio, gained: gained + correct, totalStars: s.stars, streak: s.streak.count };
}

/* ---------- mức độ thuộc ---------- */
export function mastery(itemId) {
  const it = read().items[itemId];
  if (!it || !it.seen) return 0;
  return Math.min(1, it.streak / MASTERY_STREAK);
}

export function isMastered(itemId) {
  return mastery(itemId) >= 1;
}

export function itemStat(itemId) {
  return read().items[itemId] || null;
}

export function lessonStat(lessonId) {
  return read().lessons[lessonId] || null;
}

/* Bài đã "qua" khi làm đúng ≥ 70% ít nhất 1 lần */
export function isPassed(lessonId) {
  const r = read().lessons[lessonId];
  return !!r && r.best >= 0.7;
}

/* ---------- tiến độ theo môn ---------- */
export function subjectProgress(subject) {
  const ls = lessonsOf(subject);
  const passed = ls.filter((l) => isPassed(l.id)).length;
  const cards = ls.filter((l) => l.type === 'cards').flatMap((l) => l.cards);
  const uniq = [...new Set(cards.map((c) => c.id))];
  const mastered = uniq.filter(isMastered).length;
  return {
    subject,
    lessons: ls.length,
    passed,
    lessonPct: ls.length ? Math.round((passed / ls.length) * 100) : 0,
    items: uniq.length,
    mastered,
    itemPct: uniq.length ? Math.round((mastered / uniq.length) * 100) : 0,
  };
}

export function overallProgress() {
  const parts = SUBJECT_ORDER.map(subjectProgress);
  const passed = parts.reduce((a, p) => a + p.passed, 0);
  const total = parts.reduce((a, p) => a + p.lessons, 0);
  return { parts, passed, total, pct: total ? Math.round((passed / total) * 100) : 0 };
}

/* ---------- item bé còn yếu ---------- */
export function weakItems(limit = 12, subject = null) {
  const s = read();
  const out = [];
  for (const [id, it] of Object.entries(s.items)) {
    if (!it.seen) continue;
    const m = Math.min(1, it.streak / MASTERY_STREAK);
    if (m >= 1) continue;
    const lesson = lessonOfItem(id);
    if (subject && (!lesson || lesson.subject !== subject)) continue;
    const acc = it.ok / it.seen;
    out.push({ id, it, lesson, score: it.wrong * 2 + (1 - acc) * 3 + (1 - m) });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}

/* ---------- bài tiếp theo của 1 môn ---------- */
export function nextLessonOf(subject) {
  const ls = lessonsOf(subject);
  return ls.find((l) => !isPassed(l.id)) || ls.find((l) => l.review) || ls[ls.length - 1];
}

/* ---------- 7 ngày gần nhất ---------- */
export function last7Days() {
  const s = read();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = dayOffset(-i);
    const hs = s.history.filter((h) => h.day === d);
    days.push({
      day: d,
      label: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(d + 'T00:00:00').getDay()],
      lessons: hs.length,
      correct: hs.reduce((a, h) => a + h.correct, 0),
      total: hs.reduce((a, h) => a + h.total, 0),
    });
  }
  return days;
}

export function doneToday() {
  const s = read();
  const t = today();
  return [...new Set(s.history.filter((h) => h.day === t).map((h) => h.lessonId))];
}

/* =============================================================
   GỢI Ý BÀI HỌC — kế hoạch hôm nay
   Ưu tiên: (1) ôn chỗ còn yếu → (2) học tiếp bài mới → (3) ôn tập tổng hợp
   ============================================================= */
export function dailyPlan() {
  const s = read();
  const t = today();
  if (s.plan.day === t && s.plan.ids.length) {
    return s.plan.ids
      .map((x) => ({ lesson: LESSON_BY_ID[x.id], reason: x.reason, tag: x.tag }))
      .filter((x) => x.lesson);
  }

  const picks = [];
  const used = new Set();
  const push = (lesson, reason, tag) => {
    if (!lesson || used.has(lesson.id)) return;
    used.add(lesson.id);
    picks.push({ lesson, reason, tag });
  };

  // 0) ngày đầu tiên — lộ trình khởi động cố định
  if (!s.history.length) {
    push(nextLessonOf('vn'), 'Bắt đầu từ bảng chữ cái tiếng Việt nhé', 'bài đầu tiên');
    push(nextLessonOf('math'), 'Học đếm số trước khi cộng trừ', 'bài đầu tiên');
    push(nextLessonOf('en'), 'Làm quen chữ cái tiếng Anh', 'bài đầu tiên');
    for (const k of ['vocab', 'read']) {
      if (picks.length >= s.goal) break;
      push(nextLessonOf(k), 'Thêm một bài cho vui', 'bài mới');
    }
    const first = picks.slice(0, s.goal);
    s.plan = { day: t, ids: first.map((p) => ({ id: p.lesson.id, reason: p.reason, tag: p.tag })) };
    write();
    return first;
  }

  // 1) ôn lại nơi bé còn yếu nhất
  const weak = weakItems(30);
  const weakLessons = [];
  for (const w of weak) {
    if (w.lesson && !weakLessons.find((l) => l.id === w.lesson.id)) weakLessons.push(w.lesson);
  }
  if (weakLessons[0]) push(weakLessons[0], 'Bé còn hay sai ở bài này — ôn lại nhé', 'ôn tập');

  // 2) tiếp tục môn đang học dở (môn có nhiều bài đã qua nhất nhưng chưa xong)
  const inProgress = SUBJECT_ORDER
    .map((k) => ({ k, p: subjectProgress(k) }))
    .filter((x) => x.p.passed > 0 && x.p.passed < x.p.lessons)
    .sort((a, b) => b.p.passed - a.p.passed);
  if (inProgress[0]) push(nextLessonOf(inProgress[0].k), 'Học tiếp phần bé đang dở', 'bài mới');

  // 3) bài mới ở môn ít được học nhất (theo thứ tự khuyến nghị khi bằng điểm)
  const PLAN_ORDER = ['vn', 'math', 'en', 'read', 'vocab'];
  const leastTouched = PLAN_ORDER
    .map((k, i) => ({ k, i, p: subjectProgress(k) }))
    .sort((a, b) => a.p.lessonPct - b.p.lessonPct || a.i - b.i);
  for (const x of leastTouched) {
    if (picks.length >= s.goal) break;
    push(nextLessonOf(x.k),
      x.p.passed === 0 ? 'Môn này bé chưa học — thử xem sao' : 'Đổi món cho vui',
      'bài mới');
  }

  // 4) nếu vẫn thiếu → bài ôn tập
  for (const l of LESSONS.filter((l) => l.review)) {
    if (picks.length >= s.goal) break;
    push(l, 'Ôn tập tổng hợp', 'ôn tập');
  }
  // 5) cuối cùng: bất kỳ bài chưa qua
  for (const l of LESSONS) {
    if (picks.length >= s.goal) break;
    if (!isPassed(l.id)) push(l, 'Thử sức bài mới', 'bài mới');
  }

  const plan = picks.slice(0, s.goal);
  s.plan = { day: t, ids: plan.map((p) => ({ id: p.lesson.id, reason: p.reason, tag: p.tag })) };
  write();
  return plan;
}

export function refreshPlan() {
  const s = read();
  s.plan = { day: null, ids: [] };
  write();
  return dailyPlan();
}

/* ---------- xuất / nhập / xoá ---------- */
export function exportJSON() {
  return JSON.stringify(read(), null, 2);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object') throw new Error('Dữ liệu không hợp lệ');
  cache = { ...blank(), ...data };
  write();
  return true;
}

export function resetAll() {
  cache = blank();
  write();
}
