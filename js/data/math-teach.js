/* =============================================================
   NỘI DUNG DẠY TOÁN
   Mỗi bài có: lời giảng, các bước làm, và một demo minh hoạ
   chia thành nhiều bước (bé bấm "Bước sau" để xem tiếp).

   Bước demo có dạng:
   { expr, rows: [{label, emoji}], line: '8 → 9 → 10', caption, speak }
   ============================================================= */

const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];

const FRUIT = ['🍎', '🍓', '🍌', '⭐', '🎈', '🐥', '🍪', '⚽'];

/* ---------- các bộ demo ---------- */

function demoCount() {
  const n = ri(4, 9);
  const e = pick(FRUIT);
  const steps = [{
    rows: [{ emoji: e.repeat(n) }],
    caption: 'Có một nhóm đồ vật. Mình cùng đếm nhé!',
    speak: 'Có một nhóm đồ vật. Mình cùng đếm nhé',
  }];
  const words = ['một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];
  for (let i = 1; i <= n; i++) {
    steps.push({
      rows: [{ emoji: e.repeat(i) + '⬜'.repeat(n - i) }],
      expr: String(i),
      caption: `Chỉ vào hình thứ ${i} và đọc: ${words[i - 1]}`,
      speak: words[i - 1],
    });
  }
  steps.push({
    rows: [{ emoji: e.repeat(n) }],
    expr: `Có ${n}`,
    caption: `Số đếm cuối cùng là ${n}, vậy có tất cả ${n} cái.`,
    speak: `Có tất cả ${n}`,
  });
  return steps;
}

function demoAdd() {
  const a = ri(2, 5);
  const b = ri(2, 5);
  const A = '🟡', B = '🔵';
  return [
    {
      rows: [{ label: 'Có sẵn', emoji: A.repeat(a) }],
      expr: `${a}`,
      caption: `Ban đầu bé có ${a} cái.`,
      speak: `Ban đầu bé có ${a} cái`,
    },
    {
      rows: [{ label: 'Có sẵn', emoji: A.repeat(a) }, { label: 'Thêm vào', emoji: B.repeat(b) }],
      expr: `${a} + ${b} = ?`,
      caption: `Mẹ cho thêm ${b} cái nữa. Dấu ➕ nghĩa là "gộp lại".`,
      speak: `Mẹ cho thêm ${b} cái nữa. Dấu cộng nghĩa là gộp lại`,
    },
    {
      rows: [{ label: 'Gộp lại', emoji: A.repeat(a) + B.repeat(b) }],
      caption: 'Gộp hai nhóm vào một chỗ rồi đếm hết từ đầu.',
      speak: 'Gộp hai nhóm vào một chỗ rồi đếm hết từ đầu',
    },
    {
      rows: [{ label: 'Đếm', emoji: A.repeat(a) + B.repeat(b) }],
      line: Array.from({ length: b + 1 }, (_, i) => a + i).join(' → '),
      expr: `${a} + ${b} = ${a + b}`,
      caption: `Đếm được ${a + b}. Vậy ${a} + ${b} = ${a + b}.`,
      speak: `${a} cộng ${b} bằng ${a + b}`,
    },
  ];
}

function demoSub() {
  const a = ri(5, 9);
  const b = ri(2, a - 1);
  const E = '🍎';
  return [
    {
      rows: [{ label: 'Có sẵn', emoji: E.repeat(a) }],
      expr: `${a}`,
      caption: `Ban đầu bé có ${a} quả.`,
      speak: `Ban đầu bé có ${a} quả`,
    },
    {
      rows: [{ label: 'Cho bạn', emoji: E.repeat(a - b) + '❌'.repeat(b) }],
      expr: `${a} − ${b} = ?`,
      caption: `Bé cho bạn ${b} quả — gạch bỏ ${b} quả. Dấu ➖ nghĩa là "bớt đi".`,
      speak: `Bé cho bạn ${b} quả. Dấu trừ nghĩa là bớt đi`,
    },
    {
      rows: [{ label: 'Còn lại', emoji: E.repeat(a - b) || '🈳' }],
      caption: 'Đếm những quả chưa bị gạch — đó là số còn lại.',
      speak: 'Đếm những quả chưa bị gạch, đó là số còn lại',
    },
    {
      rows: [{ label: 'Còn lại', emoji: E.repeat(a - b) || '🈳' }],
      line: Array.from({ length: b + 1 }, (_, i) => a - i).join(' → '),
      expr: `${a} − ${b} = ${a - b}`,
      caption: `Còn ${a - b} quả. Vậy ${a} − ${b} = ${a - b}.`,
      speak: `${a} trừ ${b} bằng ${a - b}`,
    },
  ];
}

function demoCompare() {
  let a = ri(2, 9), b = ri(2, 9);
  if (a === b) b = a === 9 ? 4 : a + 1;
  const big = Math.max(a, b), small = Math.min(a, b);
  const sign = a > b ? '>' : '<';
  return [
    {
      rows: [{ label: 'Nhóm A', emoji: '🔴'.repeat(a) }, { label: 'Nhóm B', emoji: '🔵'.repeat(b) }],
      expr: `${a} ? ${b}`,
      caption: 'Hai nhóm này, nhóm nào nhiều hơn?',
      speak: 'Hai nhóm này, nhóm nào nhiều hơn',
    },
    {
      rows: [{ label: 'Nhóm A', emoji: '🔴'.repeat(a) }, { label: 'Nhóm B', emoji: '🔵'.repeat(b) }],
      caption: `Xếp thành hàng rồi so từng cặp. Nhóm ${a > b ? 'A' : 'B'} còn dư ${big - small} cái → nhóm đó nhiều hơn.`,
      speak: `Nhóm ${a > b ? 'A' : 'B'} nhiều hơn`,
    },
    {
      expr: `${a} ${sign} ${b}`,
      caption: `🐊 Miệng cá sấu luôn quay về phía số LỚN. Số lớn là ${big}, nên viết ${a} ${sign} ${b}.`,
      speak: `${a} ${sign === '>' ? 'lớn hơn' : 'bé hơn'} ${b}`,
    },
    {
      expr: `${small} < ${big}`,
      caption: `Đọc: "${small} bé hơn ${big}" và "${big} lớn hơn ${small}". Nếu hai nhóm bằng nhau thì dùng dấu =.`,
      speak: `${small} bé hơn ${big}`,
    },
  ];
}

function demoMake10() {
  const a = ri(6, 9);
  const b = ri(11 - a, 9); // đảm bảo tổng > 10
  const need = 10 - a;
  const rest = b - need;
  return [
    {
      expr: `${a} + ${b} = ?`,
      caption: 'Tổng lớn hơn 10 rồi. Mình dùng mẹo "làm cho tròn 10" nhé!',
      speak: `${a} cộng ${b}. Mình dùng mẹo làm cho tròn mười`,
    },
    {
      rows: [{ label: `${a} cần thêm`, emoji: '🟡'.repeat(a) + '⬜'.repeat(need) }],
      expr: `${a} + ${need} = 10`,
      caption: `Số ${a} cần thêm ${need} nữa là tròn 10.`,
      speak: `${a} cần thêm ${need} nữa là tròn mười`,
    },
    {
      rows: [{ label: `Tách ${b}`, emoji: '🔵'.repeat(need) + ' ✂️ ' + '🟢'.repeat(rest) }],
      expr: `${b} = ${need} + ${rest}`,
      caption: `Nên tách ${b} thành ${need} và ${rest}.`,
      speak: `Tách ${b} thành ${need} và ${rest}`,
    },
    {
      rows: [{ label: 'Tròn 10', emoji: '🟡'.repeat(a) + '🔵'.repeat(need) }],
      expr: `${a} + ${need} = 10`,
      caption: `Lấy ${need} cho vào ${a} → được tròn 10.`,
      speak: `${a} cộng ${need} bằng mười`,
    },
    {
      rows: [{ label: 'Còn lại', emoji: '🟢'.repeat(rest) }],
      expr: `10 + ${rest} = ${a + b}`,
      caption: `Còn ${rest} cái nữa: 10 + ${rest} = ${a + b}.`,
      speak: `Mười cộng ${rest} bằng ${a + b}`,
    },
    {
      expr: `${a} + ${b} = ${a + b}`,
      caption: `Vậy ${a} + ${b} = ${a + b}. Mẹo này dùng mãi được nhé!`,
      speak: `${a} cộng ${b} bằng ${a + b}`,
    },
  ];
}

function demoBreak10() {
  const a = ri(11, 18);
  const unit = a - 10;
  const b = ri(unit + 1, 9); // phải mượn
  const rest = b - unit;
  return [
    {
      expr: `${a} − ${b} = ?`,
      caption: `Hàng đơn vị của ${a} là ${unit}, bé hơn ${b} nên không trừ trực tiếp được. Mình trừ về 10 trước!`,
      speak: `${a} trừ ${b}. Mình trừ về mười trước`,
    },
    {
      expr: `${b} = ${unit} + ${rest}`,
      rows: [{ label: `Tách ${b}`, emoji: '🔴'.repeat(unit) + ' ✂️ ' + '🟠'.repeat(rest) }],
      caption: `Tách ${b} thành ${unit} và ${rest}.`,
      speak: `Tách ${b} thành ${unit} và ${rest}`,
    },
    {
      expr: `${a} − ${unit} = 10`,
      caption: `Trừ ${unit} trước để về tròn 10.`,
      speak: `${a} trừ ${unit} bằng mười`,
    },
    {
      expr: `10 − ${rest} = ${a - b}`,
      line: Array.from({ length: rest + 1 }, (_, i) => 10 - i).join(' → '),
      caption: `Rồi trừ tiếp ${rest}: 10 − ${rest} = ${a - b}.`,
      speak: `Mười trừ ${rest} bằng ${a - b}`,
    },
    {
      expr: `${a} − ${b} = ${a - b}`,
      caption: `Vậy ${a} − ${b} = ${a - b}.`,
      speak: `${a} trừ ${b} bằng ${a - b}`,
    },
  ];
}

function demoMissing() {
  const total = ri(5, 10);
  const a = ri(1, total - 1);
  const b = total - a;
  return [
    {
      expr: `${a} + ? = ${total}`,
      rows: [{ label: 'Tất cả', emoji: '🟣'.repeat(total) }],
      caption: `Có tất cả ${total} cái, trong đó đã biết ${a} cái. Hỏi còn thiếu mấy cái?`,
      speak: `Có tất cả ${total}, đã biết ${a}, còn thiếu mấy`,
    },
    {
      rows: [{ label: 'Đã biết', emoji: '🟣'.repeat(a) }, { label: 'Còn thiếu', emoji: '⬜'.repeat(b) }],
      caption: `Che ${a} cái đã biết lại, đếm những ô trống còn lại.`,
      speak: 'Đếm những ô trống còn lại',
    },
    {
      expr: `${total} − ${a} = ${b}`,
      caption: `Muốn tìm phần còn thiếu thì lấy tổng TRỪ phần đã biết: ${total} − ${a} = ${b}.`,
      speak: `${total} trừ ${a} bằng ${b}`,
    },
    {
      expr: `${a} + ${b} = ${total}`,
      caption: `Thử lại: ${a} + ${b} = ${total} ✅ Đúng rồi!`,
      speak: `${a} cộng ${b} bằng ${total}. Đúng rồi`,
    },
  ];
}

function demoStory() {
  const isAdd = Math.random() < 0.5;
  const e = pick(['🍬', '🎈', '🐥']);
  if (isAdd) {
    const a = ri(3, 6), b = ri(2, 4);
    return [
      {
        rows: [{ emoji: e.repeat(a) }],
        caption: `Đọc kỹ đề: "Bé có ${a} cái, mẹ cho THÊM ${b} cái. Bé có tất cả bao nhiêu?"`,
        speak: `Bé có ${a} cái, mẹ cho thêm ${b} cái. Bé có tất cả bao nhiêu`,
      },
      {
        expr: '➕',
        caption: 'Từ khoá "THÊM", "tất cả", "cả hai" → làm phép CỘNG.',
        speak: 'Thấy chữ thêm hoặc tất cả thì làm phép cộng',
      },
      {
        rows: [{ label: 'Gộp lại', emoji: e.repeat(a + b) }],
        expr: `${a} + ${b} = ${a + b}`,
        caption: `Vậy bé có tất cả ${a + b} cái.`,
        speak: `Bé có tất cả ${a + b} cái`,
      },
    ];
  }
  const a = ri(6, 9), b = ri(2, a - 2);
  return [
    {
      rows: [{ emoji: e.repeat(a) }],
      caption: `Đọc kỹ đề: "Bé có ${a} cái, bé CHO bạn ${b} cái. Bé còn lại bao nhiêu?"`,
      speak: `Bé có ${a} cái, cho bạn ${b} cái. Bé còn lại bao nhiêu`,
    },
    {
      expr: '➖',
      caption: 'Từ khoá "CHO", "còn lại", "bớt", "ăn mất" → làm phép TRỪ.',
      speak: 'Thấy chữ cho bạn hoặc còn lại thì làm phép trừ',
    },
    {
      rows: [{ label: 'Còn lại', emoji: e.repeat(a - b) + '❌'.repeat(b) }],
      expr: `${a} − ${b} = ${a - b}`,
      caption: `Vậy bé còn lại ${a - b} cái.`,
      speak: `Bé còn lại ${a - b} cái`,
    },
  ];
}

const DEMOS = {
  count: demoCount,
  add: demoAdd,
  sub: demoSub,
  compare: demoCompare,
  make10: demoMake10,
  break10: demoBreak10,
  missing: demoMissing,
  story: demoStory,
  mix: () => (Math.random() < 0.5 ? demoAdd() : demoSub()),
};

export function buildDemo(kind) {
  return (DEMOS[kind] || demoAdd)();
}

/* =============================================================
   Lời giảng cho từng bài
   ============================================================= */
export const MATH_TEACH = {
  'count-10': {
    demo: 'count',
    intro: 'Đếm là chỉ vào từng đồ vật và đọc số theo thứ tự. Số đọc CUỐI CÙNG chính là số lượng.',
    steps: ['Chỉ tay vào từng hình, không bỏ sót, không đếm lại.', 'Đọc to: một, hai, ba, bốn, năm…', 'Số cuối cùng là câu trả lời.'],
    extra: 'tia',
  },
  'numid-10': {
    demo: 'count',
    intro: 'Mỗi con số có một hình dáng riêng. Nhìn thấy số 5 là bé biết ngay phải lấy 5 cái.',
    steps: ['Nhìn kỹ mặt số.', 'Đếm ra đúng bấy nhiêu đồ vật.', 'Đếm lại một lần cho chắc.'],
    extra: 'tia',
  },
  'count-20': {
    demo: 'count',
    intro: 'Sau 10 là 11, 12, 13… Cách đọc rất dễ: "mười" rồi thêm số đơn vị phía sau.',
    steps: ['Đếm tới 10 trước.', 'Rồi đọc tiếp: mười một, mười hai, mười ba…', 'Đến 20 là "hai mươi".'],
    extra: 'tia',
  },
  'cmp-10': {
    demo: 'compare',
    intro: 'So sánh là xem bên nào nhiều hơn. Dấu > là "lớn hơn", < là "bé hơn", = là "bằng nhau".',
    steps: ['Đếm số lượng mỗi bên.', 'Bên nào nhiều hơn thì số đó lớn hơn.', '🐊 Miệng cá sấu luôn quay về phía số LỚN.'],
    extra: 'tia',
  },
  'add-5': {
    demo: 'add',
    intro: 'Cộng là GỘP hai nhóm lại rồi đếm tất cả.',
    steps: ['Đếm nhóm thứ nhất.', 'Gộp thêm nhóm thứ hai.', 'Đếm hết từ đầu → đó là kết quả.'],
    extra: 'tia',
  },
  'sub-5': {
    demo: 'sub',
    intro: 'Trừ là BỚT ĐI. Có sẵn mấy cái, cho đi mấy cái, xem còn lại mấy cái.',
    steps: ['Đếm số ban đầu.', 'Gạch bỏ số bị cho đi.', 'Đếm những cái còn lại.'],
    extra: 'tia',
  },
  'add-10': {
    demo: 'add',
    intro: 'Vẫn là gộp lại như cũ, nhưng số to hơn. Bé nên học thuộc các cặp cộng lại bằng 10 — sau này tính rất nhanh.',
    steps: ['Nhớ số lớn trong đầu.', 'Đếm thêm số nhỏ: 7… 8, 9, 10.', 'Hoặc nhớ luôn cặp số quen thuộc.'],
    extra: 'ban10',
  },
  'sub-10': {
    demo: 'sub',
    intro: 'Trừ trong 10. Bé có thể đếm lùi trên tia số cho dễ.',
    steps: ['Bắt đầu từ số lớn.', 'Đếm lùi đúng số cần trừ: 9… 8, 7, 6.', 'Chỗ dừng lại là kết quả.'],
    extra: 'tia',
  },
  'mix-10': {
    demo: 'mix',
    intro: 'Bài này trộn cả cộng và trừ. Việc quan trọng nhất là NHÌN KỸ DẤU trước khi tính.',
    steps: ['Nhìn dấu: ➕ là gộp lại, ➖ là bớt đi.', 'Tính theo đúng dấu đó.', 'Kiểm tra lại một lần.'],
    extra: 'tia',
  },
  'add-20': {
    demo: 'add',
    intro: 'Cộng với số lớn hơn 10. Mẹo: giữ số hàng chục, chỉ cộng phần đơn vị.',
    steps: ['Ví dụ 12 + 5: giữ nguyên "1 chục".', 'Cộng phần đơn vị: 2 + 5 = 7.', 'Ghép lại: 17.'],
    extra: 'tia',
  },
  'sub-20': {
    demo: 'sub',
    intro: 'Trừ với số lớn hơn 10, phần đơn vị vẫn đủ để trừ.',
    steps: ['Ví dụ 17 − 5: giữ nguyên "1 chục".', 'Trừ phần đơn vị: 7 − 5 = 2.', 'Ghép lại: 12.'],
    extra: 'tia',
  },
  'add-carry': {
    demo: 'make10',
    intro: 'Khi tổng vượt quá 10, dùng mẹo "LÀM CHO TRÒN 10" — cách này người lớn cũng dùng để tính nhẩm.',
    steps: ['Xem số lớn còn thiếu mấy nữa là tròn 10.', 'Tách số nhỏ ra để cho vừa đủ.', 'Rồi cộng phần còn lại vào 10.'],
    extra: 'ban10',
  },
  'sub-borrow': {
    demo: 'break10',
    intro: 'Khi phần đơn vị không đủ để trừ, mình TRỪ VỀ 10 trước rồi trừ tiếp phần còn lại.',
    steps: ['Trừ để về đúng số 10.', 'Còn thiếu bao nhiêu thì trừ tiếp từ 10.', 'Kết quả luôn nhỏ hơn 10.'],
    extra: 'ban10',
  },
  missing: {
    demo: 'missing',
    intro: 'Ô trống là số bí mật. Muốn tìm một phần thì lấy TỔNG trừ đi phần đã biết.',
    steps: ['Tìm xem tổng là bao nhiêu.', 'Lấy tổng trừ phần đã biết.', 'Thay số vừa tìm vào để thử lại.'],
    extra: 'tia',
  },
  story: {
    demo: 'story',
    intro: 'Toán đố là câu chuyện. Bé tìm TỪ KHOÁ để biết nên cộng hay trừ.',
    steps: ['"thêm", "tất cả", "cả hai" → phép CỘNG ➕', '"cho", "còn lại", "bớt", "ăn mất" → phép TRỪ ➖', 'Tính rồi đọc lại đề xem có hợp lý không.'],
    extra: 'tia',
  },
  'mix-20': {
    demo: 'mix',
    intro: 'Bài ôn tập tổng hợp mọi phép cộng trừ trong 20. Bé cứ bình tĩnh, nhìn dấu rồi tính.',
    steps: ['Nhìn dấu trước tiên.', 'Số nhỏ thì đếm, số lớn thì dùng mẹo tròn 10.', 'Làm chậm mà đúng hơn là nhanh mà sai.'],
    extra: 'ban10',
  },
};

/* Các cặp số cộng lại bằng 10 — bảng tham khảo rất hữu ích */
export const PAIRS_10 = [
  [1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2], [9, 1],
];
