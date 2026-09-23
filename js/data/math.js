/* =============================================================
   TOÁN — bộ sinh câu hỏi cho từng dạng bài
   Mọi generator nhận (rng) và trả về 1 object câu hỏi chuẩn:
   { itemId, promptText, promptEmoji, promptSub, speak, answer, options, input }
   ============================================================= */

const COUNT_EMOJI = ['🍎', '⭐', '🐟', '🍌', '🎈', '🐥', '🍓', '🚗', '🌸', '🐞', '🍪', '⚽'];

/* --- tiện ích --- */
const ri = (rng, a, b) => a + Math.floor(rng() * (b - a + 1)); // random int [a,b]
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Tạo 4 đáp án: 1 đúng + 3 sai gần đúng */
function numberOptions(rng, correct, max) {
  const set = new Set([correct]);
  const cands = [correct + 1, correct - 1, correct + 2, correct - 2, correct + 10, correct + 3];
  for (const c of shuffle(rng, cands)) {
    if (set.size >= 4) break;
    if (c >= 0 && c <= max) set.add(c);
  }
  let n = 0;
  while (set.size < 4 && n++ < 50) {
    const c = ri(rng, 0, max);
    if (c >= 0) set.add(c);
  }
  return shuffle(rng, [...set]).map(String);
}

/* --- 1. Đếm số --- */
function makeCounting(min, max) {
  return (rng) => {
    const n = ri(rng, min, max);
    const e = pick(rng, COUNT_EMOJI);
    return {
      itemId: `m-count-${n}`,
      promptEmoji: e.repeat(n),
      promptText: 'Có bao nhiêu?',
      speak: { text: 'Đếm xem có bao nhiêu', lang: 'vi' },
      answer: String(n),
      options: numberOptions(rng, n, Math.min(20, max + 4)),
      input: 'choice',
    };
  };
}

/* --- 2. Nhận biết mặt số --- */
function makeNumberId(min, max) {
  return (rng) => {
    const n = ri(rng, min, max);
    const e = pick(rng, COUNT_EMOJI);
    return {
      itemId: `m-numid-${n}`,
      promptText: String(n),
      promptSub: 'Chọn nhóm có đúng số lượng này',
      speak: { text: `Số ${n}`, lang: 'vi' },
      answer: e.repeat(n),
      options: shuffle(rng, [
        e.repeat(n),
        e.repeat(Math.max(1, n - 1)),
        e.repeat(n + 1),
        e.repeat(Math.max(1, n + 2)),
      ].filter((v, i, a) => a.indexOf(v) === i)),
      input: 'choice',
      optionStyle: 'emoji',
    };
  };
}

/* --- 3. So sánh --- */
function makeCompare(max) {
  return (rng) => {
    const a = ri(rng, 0, max);
    let b = ri(rng, 0, max);
    if (rng() < 0.2) b = a; // đôi khi bằng nhau
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return {
      itemId: `m-cmp-${Math.min(a, b)}-${Math.max(a, b)}-${ans === '=' ? 'eq' : 'ne'}`,
      promptText: `${a}  ?  ${b}`,
      promptSub: 'Điền dấu thích hợp',
      speak: { text: `So sánh ${a} và ${b}`, lang: 'vi' },
      answer: ans,
      options: ['>', '<', '='],
      input: 'choice',
      optionStyle: 'symbol',
    };
  };
}

/* --- 4. Cộng ---
   Mỗi biến thể sinh số theo công thức riêng, KHÔNG dùng vòng lặp thử–loại,
   nên không bao giờ sinh ra đề lệch phạm vi.                              */

function addQuestion(rng, a, b, maxSum) {
  const sum = a + b;
  return {
    itemId: `m-add-${a}+${b}`,
    promptText: `${a} + ${b} = ?`,
    promptEmoji: sum <= 12 ? '🟡'.repeat(a) + ' ➕ ' + '🔵'.repeat(b) : '',
    speak: { text: `${a} cộng ${b} bằng bao nhiêu`, lang: 'vi' },
    answer: String(sum),
    // giới hạn đáp án nhiễu trong phạm vi bé đang học, không vượt 20
    options: numberOptions(rng, sum, Math.min(20, maxSum + 3)),
    input: 'choice',
  };
}

/* Cộng cơ bản: 0 ≤ a, 0 ≤ b, a + b ≤ maxSum */
function makeAdd(maxSum) {
  return (rng) => {
    const a = ri(rng, 0, maxSum);
    const b = ri(rng, 0, maxSum - a);
    return addQuestion(rng, a, b, maxSum);
  };
}

/* Cộng trong 20 KHÔNG nhớ: (10 + u) + v với u + v ≤ 9 → tổng ≤ 19 */
function makeAdd20NoCarry() {
  return (rng) => {
    const u = ri(rng, 0, 8);
    const v = ri(rng, 1, 9 - u);
    const big = 10 + u;
    // đôi khi đảo thứ tự cho đa dạng: 5 + 12
    return rng() < 0.3 ? addQuestion(rng, v, big, 20) : addQuestion(rng, big, v, 20);
  };
}

/* Cộng CÓ nhớ (qua 10): cả hai số 1 chữ số, tổng 11 → 18 */
function makeAddCarry() {
  return (rng) => {
    const a = ri(rng, 3, 9);
    const b = ri(rng, Math.max(2, 11 - a), 9);
    return addQuestion(rng, a, b, 20);
  };
}

/* --- 5. Trừ --- */

function subQuestion(rng, a, b, maxNum) {
  const d = a - b;
  return {
    itemId: `m-sub-${a}-${b}`,
    promptText: `${a} − ${b} = ?`,
    promptEmoji: a <= 12 ? '🍎'.repeat(d) + '❌'.repeat(b) : '',
    speak: { text: `${a} trừ ${b} bằng bao nhiêu`, lang: 'vi' },
    answer: String(d),
    options: numberOptions(rng, d, maxNum),
    input: 'choice',
  };
}

/* Trừ cơ bản: 1 ≤ a ≤ maxNum, 0 ≤ b ≤ a */
function makeSub(maxNum) {
  return (rng) => {
    const a = ri(rng, 1, maxNum);
    const b = ri(rng, 0, a);
    return subQuestion(rng, a, b, maxNum);
  };
}

/* Trừ trong 20 KHÔNG mượn: (10 + u) − b với b ≤ u → kết quả ≥ 10 */
function makeSub20NoBorrow() {
  return (rng) => {
    const u = ri(rng, 1, 9);
    const b = ri(rng, 1, u);
    return subQuestion(rng, 10 + u, b, 20);
  };
}

/* Trừ CÓ mượn (qua 10): (10 + u) − b với b > u → kết quả 1 → 9 */
function makeSubBorrow() {
  return (rng) => {
    const u = ri(rng, 1, 8);
    const b = ri(rng, u + 1, 9);
    return subQuestion(rng, 10 + u, b, 20);
  };
}

/* --- 6. Trộn cộng trừ --- */
function makeMixed(max) {
  const add = makeAdd(max);
  const sub = makeSub(max);
  return (rng) => (rng() < 0.5 ? add(rng) : sub(rng));
}

/* --- 7. Tìm số còn thiếu --- */
function makeMissing(max) {
  return (rng) => {
    const total = ri(rng, 2, max);
    const a = ri(rng, 1, total - 1);
    const b = total - a;
    const hideFirst = rng() < 0.5;
    const isAdd = rng() < 0.6;
    let text, answer, itemId;
    if (isAdd) {
      text = hideFirst ? `? + ${b} = ${total}` : `${a} + ? = ${total}`;
      answer = hideFirst ? a : b;
      itemId = `m-miss-add-${total}`;
    } else {
      text = hideFirst ? `? − ${a} = ${b}` : `${total} − ? = ${b}`;
      answer = hideFirst ? total : a;
      itemId = `m-miss-sub-${total}`;
    }
    return {
      itemId,
      promptText: text,
      promptSub: 'Số nào còn thiếu?',
      speak: { text: 'Tìm số còn thiếu', lang: 'vi' },
      answer: String(answer),
      options: numberOptions(rng, answer, max),
      input: 'choice',
    };
  };
}

/* --- 8. Toán đố có hình --- */
const STORIES = [
  { e: '🍎', n: 'quả táo', v: 'có' },
  { e: '🐥', n: 'con gà con', v: 'có' },
  { e: '🎈', n: 'bong bóng', v: 'có' },
  { e: '🍬', n: 'cái kẹo', v: 'có' },
  { e: '⭐', n: 'ngôi sao', v: 'có' },
  { e: '🚗', n: 'chiếc xe', v: 'có' },
];

function makeWordProblem(max) {
  return (rng) => {
    const s = pick(rng, STORIES);
    const isAdd = rng() < 0.5;
    if (isAdd) {
      const a = ri(rng, 1, 9);
      const b = ri(rng, 1, Math.min(9, max - a));
      return {
        itemId: `m-story-add-${a}+${b}`,
        promptEmoji: s.e.repeat(a) + ' ➕ ' + s.e.repeat(b),
        promptText: `Bé ${s.v} ${a} ${s.n}, mẹ cho thêm ${b} ${s.n}. Bé có tất cả bao nhiêu?`,
        speak: { text: `Bé có ${a} ${s.n}, mẹ cho thêm ${b} ${s.n}. Bé có tất cả bao nhiêu?`, lang: 'vi' },
        answer: String(a + b),
        options: numberOptions(rng, a + b, Math.min(20, max + 3)),
        input: 'choice',
      };
    }
    const a = ri(rng, 3, Math.min(12, max));
    const b = ri(rng, 1, a - 1);
    return {
      itemId: `m-story-sub-${a}-${b}`,
      promptEmoji: s.e.repeat(a - b) + '❌'.repeat(b),
      promptText: `Bé ${s.v} ${a} ${s.n}, bé cho bạn ${b} ${s.n}. Bé còn lại bao nhiêu?`,
      speak: { text: `Bé có ${a} ${s.n}, cho bạn ${b} ${s.n}. Bé còn lại bao nhiêu?`, lang: 'vi' },
      answer: String(a - b),
      options: numberOptions(rng, a - b, max),
      input: 'choice',
    };
  };
}

/* =============================================================
   Danh sách bài toán, xếp theo thứ tự học
   ============================================================= */
export const MATH_LESSONS = [
  { key: 'count-10',  title: 'Đếm số 1 → 10',        emoji: '🔢', desc: 'Đếm và nhận biết số lượng', gen: makeCounting(1, 10) },
  { key: 'numid-10',  title: 'Nhận biết số 1 → 10',  emoji: '👀', desc: 'Nhìn số, chọn đúng số lượng', gen: makeNumberId(1, 10) },
  { key: 'count-20',  title: 'Đếm số 11 → 20',       emoji: '🧮', desc: 'Đếm tiếp từ 11 đến 20', gen: makeCounting(11, 20) },
  { key: 'cmp-10',    title: 'So sánh trong 10',     emoji: '⚖️', desc: 'Lớn hơn, bé hơn, bằng nhau', gen: makeCompare(10) },
  { key: 'add-5',     title: 'Cộng trong 5',         emoji: '➕', desc: 'Phép cộng có kết quả ≤ 5', gen: makeAdd(5) },
  { key: 'sub-5',     title: 'Trừ trong 5',          emoji: '➖', desc: 'Phép trừ với số ≤ 5', gen: makeSub(5) },
  { key: 'add-10',    title: 'Cộng trong 10',        emoji: '➕', desc: 'Phép cộng có kết quả ≤ 10', gen: makeAdd(10) },
  { key: 'sub-10',    title: 'Trừ trong 10',         emoji: '➖', desc: 'Phép trừ với số ≤ 10', gen: makeSub(10) },
  { key: 'mix-10',    title: 'Cộng trừ trong 10',    emoji: '🔀', desc: 'Trộn cộng và trừ', gen: makeMixed(10) },
  { key: 'add-20',    title: 'Cộng trong 20',        emoji: '➕', desc: 'Cộng không nhớ: 12 + 5, 14 + 3…', gen: makeAdd20NoCarry() },
  { key: 'sub-20',    title: 'Trừ trong 20',         emoji: '➖', desc: 'Trừ không mượn: 17 − 5, 19 − 6…', gen: makeSub20NoBorrow() },
  { key: 'add-carry', title: 'Cộng qua 10',          emoji: '🚀', desc: 'Cộng có nhớ: 8 + 5, 7 + 6…', gen: makeAddCarry() },
  { key: 'sub-borrow',title: 'Trừ qua 10',           emoji: '🪄', desc: 'Trừ có mượn: 13 − 5, 15 − 8…', gen: makeSubBorrow() },
  { key: 'missing',   title: 'Tìm số còn thiếu',     emoji: '❓', desc: '? + 3 = 7', gen: makeMissing(20) },
  { key: 'story',     title: 'Toán đố có hình',      emoji: '🧩', desc: 'Bài toán bằng lời có hình minh hoạ', gen: makeWordProblem(20) },
  { key: 'mix-20',    title: 'Ôn tập cộng trừ 20',   emoji: '🏆', desc: 'Tổng hợp mọi phép trong 20', gen: makeMixed(20), review: true },
];
