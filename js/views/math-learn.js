/* =============================================================
   CHẾ ĐỘ HỌC MÔN TOÁN
   4 phần: Cô dạy bé → Cùng xem từng bước → Tập thử → Bảng tham khảo
   ============================================================= */

import { h, clear } from '../ui.js';
import { MATH_TEACH, buildDemo, PAIRS_10 } from '../data/math-teach.js';
import * as speech from '../speech.js';
import * as sfx from '../sfx.js';

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ---------------- 1. Cô dạy bé ---------------- */
function panelTeach(teach, hue) {
  const readAll = () => {
    speech.speakSeq([
      { text: teach.intro, lang: 'vi' },
      ...teach.steps.map((s) => ({ text: s.replace(/[➕➖🐊✅]/g, ''), lang: 'vi' })),
    ], { gap: 200 });
  };

  return h('div', { class: 'teach-card', style: `--accent:${hue}` },
    h('div', { class: 'teach-head' },
      h('h2', { class: 'teach-title' }, '🎓 Cô dạy bé'),
      h('button', { class: 'btn primary', style: `--accent:${hue}`, onClick: readAll }, '🔊 Đọc cho bé nghe')),
    h('p', { class: 'teach-intro' }, teach.intro),
    h('ol', { class: 'teach-steps' },
      ...teach.steps.map((s) => h('li', {}, s))));
}

/* ---------------- 2. Cùng xem từng bước ---------------- */
function panelDemo(teach, hue) {
  let steps = buildDemo(teach.demo);
  let i = 0;

  const stage = h('div', { class: 'demo-stage' });
  const caption = h('div', { class: 'demo-caption' });
  const dots = h('div', { class: 'dots', style: `--accent:${hue}` });
  const counter = h('div', { class: 'learn-count' });

  const prev = h('button', { class: 'btn', onClick: () => move(-1) }, '⬅️ Lùi');
  const next = h('button', { class: 'btn primary', style: `--accent:${hue}`, onClick: () => move(1) }, 'Bước sau ➡️');

  function draw(speakIt) {
    const s = steps[i];
    clear(stage);
    if (s.rows) {
      s.rows.forEach((r) => {
        stage.append(h('div', { class: 'demo-row' },
          r.label ? h('span', { class: 'demo-label' }, r.label) : null,
          h('span', { class: 'demo-emoji' }, r.emoji)));
      });
    }
    if (s.expr) stage.append(h('div', { class: 'demo-expr' }, s.expr));
    if (s.line) stage.append(h('div', { class: 'demo-line' }, '🔢 ' + s.line));
    caption.textContent = s.caption;
    counter.textContent = `${i + 1}/${steps.length}`;
    clear(dots);
    steps.forEach((_, k) => dots.append(h('i', { class: k === i ? 'on' : '' })));
    prev.disabled = i === 0;
    next.disabled = i === steps.length - 1;
    if (speakIt && s.speak) speech.speak(s.speak, 'vi');
  }

  function move(d) {
    const n = i + d;
    if (n < 0 || n >= steps.length) return;
    i = n;
    sfx.click();
    draw(true);
  }

  /* Xem lại từ đầu với chính ví dụ đang xem */
  const restart = h('button', {
    class: 'chip', onClick: () => { i = 0; draw(true); },
  }, '🔄 Xem lại từ đầu');

  const again = h('button', {
    class: 'chip', onClick: () => {
      steps = buildDemo(teach.demo);
      i = 0;
      draw(true);
    },
  }, '🎲 Ví dụ khác');

  const box = h('div', { class: 'teach-card', style: `--accent:${hue}` },
    h('div', { class: 'teach-head' },
      h('h2', { class: 'teach-title' }, '👀 Cùng xem từng bước'),
      restart, again),
    stage, caption,
    h('div', { class: 'learn-nav', style: 'margin-top:14px;justify-content:center' }, prev, counter, next),
    dots);

  draw(false);
  return box;
}

/* ---------------- 3. Tập thử (không tính điểm) ---------------- */
function panelPractice(lesson, hue) {
  const TOTAL = 5;
  let done = 0, ok = 0, locked = false;

  const head = h('div', { class: 'practice-score' });
  const qBox = h('div', { class: 'practice-q' });
  const optBox = h('div', { class: 'opts' });
  const fb = h('div', { class: 'feedback' });

  function drawDone() {
    clear(qBox); clear(optBox); clear(fb);
    qBox.append(h('div', { class: 'demo-expr' }, ok === TOTAL ? '🌟 Đúng hết!' : `Đúng ${ok}/${TOTAL} câu`));
    fb.append(h('div', { class: 'fb-hint' },
      ok >= 4 ? 'Bé nắm bài rồi, làm bài kiểm tra thôi!' : 'Bé xem lại phần "Cùng xem từng bước" rồi tập thử tiếp nhé.'));
    optBox.append(h('button', {
      class: 'btn primary block', style: `--accent:${hue}`,
      onClick: () => { done = 0; ok = 0; drawQ(); },
    }, '🔁 Tập thử lại'));
  }

  function drawQ() {
    if (done >= TOTAL) { head.textContent = `Đã xong ${TOTAL}/${TOTAL} câu`; drawDone(); return; }
    locked = false;
    head.textContent = `Câu ${done + 1}/${TOTAL} · đúng ${ok}`;
    const q = lesson.gen(Math.random);
    clear(qBox); clear(optBox); clear(fb);

    if (q.promptEmoji) qBox.append(h('div', { class: 'demo-emoji sm' }, q.promptEmoji));
    qBox.append(h('div', { class: 'demo-expr' + (q.promptText.length > 18 ? ' small' : '') }, q.promptText));
    if (q.promptSub) qBox.append(h('div', { class: 'demo-caption' }, q.promptSub));

    shuffle(q.options).forEach((o) => {
      const b = h('button', {
        class: 'opt ' + (q.optionStyle === 'symbol' ? 'text-xl' : q.optionStyle === 'emoji' ? '' : 'text-lg'),
        style: `--accent:${hue}`,
        onClick: () => {
          if (locked) return;
          locked = true;
          const right = String(o) === String(q.answer);
          done++;
          if (right) { ok++; sfx.correct(); } else sfx.wrong();
          [...optBox.children].forEach((c) => {
            c.disabled = true;
            if (c.dataset.val === String(q.answer)) c.classList.add('correct');
            else if (c === b) c.classList.add('wrong');
            else c.classList.add('dim');
          });
          clear(fb);
          fb.append(
            h('div', { class: 'fb-emoji' }, right ? '🎉' : '💡'),
            h('div', { class: 'fb-text ' + (right ? 'ok' : 'no') },
              right ? 'Đúng rồi!' : `Đáp án đúng là ${q.answer}`),
            h('button', {
              class: 'btn primary', style: `--accent:${hue};margin-top:6px`, onClick: drawQ,
            }, done >= TOTAL ? 'Xem kết quả' : 'Câu tiếp ➡️'));
          if (!right) speech.speak(`Đáp án đúng là ${q.answer}`, 'vi');
        },
        dataset: { val: String(o) },
      }, h('div', { class: 'o-label' }, String(o)));
      optBox.append(b);
    });

    if (q.speak) speech.speak(q.speak.text, q.speak.lang || 'vi');
  }

  const box = h('div', { class: 'teach-card', style: `--accent:${hue}` },
    h('div', { class: 'teach-head' },
      h('h2', { class: 'teach-title' }, '✏️ Tập thử'),
      h('span', { class: 'chip' }, 'không tính điểm'),
      h('button', {
        class: 'chip', onClick: () => { done = 0; ok = 0; drawQ(); },
      }, '🔄 Làm lại')),
    h('div', { class: 'panel-note' }, 'Bé làm sai cũng không sao — phần này chỉ để tập tay.'),
    head, qBox, optBox, fb);

  drawQ();
  return box;
}

/* ---------------- 4. Bảng tham khảo ---------------- */
function panelNumberLine(hue) {
  const line = h('div', { class: 'numline' });
  for (let n = 0; n <= 20; n++) {
    line.append(h('button', {
      class: 'numline-n' + (n === 10 || n === 20 ? ' mark' : ''),
      onClick: () => speech.speak(String(n), 'vi'),
    }, String(n)));
  }
  return h('div', { class: 'teach-card', style: `--accent:${hue}` },
    h('h2', { class: 'teach-title' }, '🔢 Tia số 0 → 20'),
    h('div', { class: 'panel-note' }, 'Bấm vào số để nghe đọc. Cộng thì đi sang phải, trừ thì đi sang trái.'),
    line);
}

function panelPairs10(hue) {
  const grid = h('div', { class: 'pair-grid' });
  PAIRS_10.forEach(([a, b]) => {
    grid.append(h('button', {
      class: 'pair', onClick: () => speech.speak(`${a} cộng ${b} bằng mười`, 'vi'),
    }, `${a} + ${b} = 10`));
  });
  return h('div', { class: 'teach-card', style: `--accent:${hue}` },
    h('h2', { class: 'teach-title' }, '🤝 Các cặp số bằng 10'),
    h('div', { class: 'panel-note' }, 'Học thuộc bảng này là bé tính nhẩm nhanh hơn hẳn. Bấm để nghe đọc.'),
    grid);
}

/* ---------------- View chính ---------------- */
export function renderMathLearn(root, lesson, subj) {
  const key = lesson.id.replace(/^math-/, '');
  const teach = MATH_TEACH[key];
  const hue = subj.hue;

  if (!teach) {
    root.append(h('div', { class: 'note' }, 'Bài này chưa có phần giảng, bé làm bài kiểm tra luôn nhé.'));
    return;
  }

  root.append(panelTeach(teach, hue));
  root.append(panelDemo(teach, hue));
  root.append(panelPractice(lesson, hue));
  root.append(teach.extra === 'ban10' ? panelPairs10(hue) : panelNumberLine(hue));
}
