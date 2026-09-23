/* Kiểm tra bộ sinh đề toán: mỗi bài phải sinh đề ĐÚNG PHẠM VI của bài đó.
   Chạy: node test-math-range.mjs   (không cần trình duyệt)                */
import { MATH_LESSONS } from './js/data/math.js';

const N = 4000; // số đề sinh thử cho mỗi bài
const errs = [];
const fail = (key, msg, q) => errs.push(`[${key}] ${msg} — đề: "${q.promptText || q.promptEmoji}" đáp án ${q.answer}`);

/* luật kiểm tra riêng cho từng bài */
const RULES = {
  'count-10': (q, k) => { const n = +q.itemId.split('-')[2]; if (n < 1 || n > 10) fail(k, `đếm ${n} ngoài 1–10`, q); },
  'numid-10': (q, k) => { const n = +q.itemId.split('-')[2]; if (n < 1 || n > 10) fail(k, `số ${n} ngoài 1–10`, q); },
  'count-20': (q, k) => { const n = +q.itemId.split('-')[2]; if (n < 11 || n > 20) fail(k, `đếm ${n} ngoài 11–20`, q); },
  'cmp-10': (q, k) => {
    const [a, b] = q.promptText.split('?').map((s) => +s.trim());
    if (a > 10 || b > 10 || a < 0 || b < 0) fail(k, `so sánh ${a} và ${b} vượt 10`, q);
    const right = a > b ? '>' : a < b ? '<' : '=';
    if (q.answer !== right) fail(k, `dấu sai, phải là ${right}`, q);
  },
  'add-5': (q, k) => chkAdd(q, k, { maxSum: 5 }),
  'sub-5': (q, k) => chkSub(q, k, { maxA: 5 }),
  'add-10': (q, k) => chkAdd(q, k, { maxSum: 10 }),
  'sub-10': (q, k) => chkSub(q, k, { maxA: 10 }),
  'mix-10': (q, k) => (q.promptText.includes('+') ? chkAdd(q, k, { maxSum: 10 }) : chkSub(q, k, { maxA: 10 })),
  'add-20': (q, k) => chkAdd(q, k, { maxSum: 20, noCarry: true }),
  'sub-20': (q, k) => chkSub(q, k, { maxA: 20, minResult: 10 }),
  'add-carry': (q, k) => chkAdd(q, k, { maxSum: 18, minSum: 11, maxTerm: 9, minTerm: 1 }),
  'sub-borrow': (q, k) => chkSub(q, k, { maxA: 18, minA: 11, maxResult: 9, minResult: 1 }),
  missing: (q, k) => {
    const nums = q.promptText.match(/\d+/g).map(Number);
    if (nums.some((n) => n > 20)) fail(k, 'có số vượt 20', q);
    if (+q.answer < 0 || +q.answer > 20) fail(k, 'đáp án ngoài 0–20', q);
  },
  story: (q, k) => {
    const isAdd = q.itemId.includes('add');
    const [a, b] = q.itemId.replace('m-story-add-', '').replace('m-story-sub-', '').split(/[+-]/).map(Number);
    const right = isAdd ? a + b : a - b;
    if (String(right) !== q.answer) fail(k, `kết quả phải là ${right}`, q);
    if (right > 20 || right < 0) fail(k, 'kết quả ngoài 0–20', q);
    if (a > 20 || b > 20) fail(k, 'số hạng vượt 20', q);
  },
  'mix-20': (q, k) => (q.promptText.includes('+') ? chkAdd(q, k, { maxSum: 20 }) : chkSub(q, k, { maxA: 20 })),
};

function chkAdd(q, k, o) {
  const m = q.promptText.match(/^(\d+) \+ (\d+) = \?$/);
  if (!m) return fail(k, 'không phải phép cộng', q);
  const a = +m[1], b = +m[2], sum = a + b;
  if (String(sum) !== q.answer) fail(k, `đáp án phải là ${sum}`, q);
  if (o.maxSum !== undefined && sum > o.maxSum) fail(k, `tổng ${sum} vượt ${o.maxSum}`, q);
  if (o.minSum !== undefined && sum < o.minSum) fail(k, `tổng ${sum} nhỏ hơn ${o.minSum}`, q);
  if (o.maxTerm !== undefined && (a > o.maxTerm || b > o.maxTerm)) fail(k, `số hạng vượt ${o.maxTerm}`, q);
  if (o.minTerm !== undefined && (a < o.minTerm || b < o.minTerm)) fail(k, `số hạng nhỏ hơn ${o.minTerm}`, q);
  if (o.noCarry && (a % 10) + (b % 10) > 9) fail(k, `có nhớ (${a % 10}+${b % 10}>9) nhưng bài này là không nhớ`, q);
}

function chkSub(q, k, o) {
  const m = q.promptText.match(/^(\d+) − (\d+) = \?$/);
  if (!m) return fail(k, 'không phải phép trừ', q);
  const a = +m[1], b = +m[2], d = a - b;
  if (String(d) !== q.answer) fail(k, `đáp án phải là ${d}`, q);
  if (d < 0) fail(k, 'kết quả âm', q);
  if (o.maxA !== undefined && a > o.maxA) fail(k, `số bị trừ ${a} vượt ${o.maxA}`, q);
  if (o.minA !== undefined && a < o.minA) fail(k, `số bị trừ ${a} nhỏ hơn ${o.minA}`, q);
  if (o.maxResult !== undefined && d > o.maxResult) fail(k, `kết quả ${d} vượt ${o.maxResult}`, q);
  if (o.minResult !== undefined && d < o.minResult) fail(k, `kết quả ${d} nhỏ hơn ${o.minResult}`, q);
}

/* luật chung cho mọi đề */
function chkCommon(q, k) {
  if (!q.options || q.options.length < 3) fail(k, `chỉ có ${q.options?.length} đáp án`, q);
  if (new Set(q.options.map(String)).size !== q.options.length) fail(k, 'đáp án bị trùng', q);
  if (!q.options.map(String).includes(String(q.answer))) fail(k, 'đáp án đúng không nằm trong các lựa chọn', q);
  if (q.options.some((o) => String(o).startsWith('-'))) fail(k, 'có lựa chọn là số âm', q);
  if (q.options.some((o) => /^\d+$/.test(String(o)) && +o > 20)) fail(k, `có lựa chọn vượt 20 (${q.options.join(',')})`, q);
  if (!q.itemId) fail(k, 'thiếu itemId', q);
  if (!q.promptText && !q.promptEmoji) fail(k, 'đề trống', q);
}

console.log(`Sinh thử ${N} đề cho mỗi bài toán…\n`);
for (const lesson of MATH_LESSONS) {
  const seen = new Set();
  for (let i = 0; i < N; i++) {
    const q = lesson.gen(Math.random);
    chkCommon(q, lesson.key);
    (RULES[lesson.key] || (() => {}))(q, lesson.key);
    seen.add(q.promptText || q.itemId);
  }
  console.log(`  ${lesson.key.padEnd(12)} ${String(seen.size).padStart(4)} đề khác nhau`);
}

console.log(`\nLỖI: ${errs.length}`);
[...new Set(errs)].slice(0, 20).forEach((e) => console.log(' -', e));
process.exit(errs.length ? 1 : 0);
