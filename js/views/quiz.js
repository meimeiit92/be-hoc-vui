/* =============================================================
   BÀI KIỂM TRA
   ============================================================= */

import { h, go, clear, confetti, starRow, PRAISE_OK, PRAISE_NO, rndOf } from '../ui.js';
import { SUBJECTS, LESSON_BY_ID } from '../curriculum.js';
import { buildQuiz, QUESTION_COUNT } from '../questions.js';
import * as speech from '../speech.js';
import * as sfx from '../sfx.js';
import * as P from '../storage.js';

export function renderQuiz(root, lessonId) {
  const lesson = LESSON_BY_ID[lessonId];
  if (!lesson) { go('#/'); return; }
  const subj = SUBJECTS[lesson.subject];

  const questions = buildQuiz(lesson, QUESTION_COUNT);
  let i = 0;
  let correct = 0;
  let locked = false;
  const misses = [];

  const bar = h('i', { style: 'width:0%' });
  const scoreEl = h('div', { class: 'quiz-score' }, '⭐ 0');
  const stage = h('div', {});
  const fb = h('div', { class: 'feedback' });

  const top = h('div', { class: 'quiz-top', style: `--accent:${subj.hue}` },
    h('button', {
      class: 'icon-btn', title: 'Thoát', 'aria-label': 'Thoát bài kiểm tra',
      onClick: () => { speech.stop(); go(`#/mon/${lesson.subject}`); },
    }, '✕'),
    h('div', { class: 'progress' }, bar),
    scoreEl);

  root.append(top,
    h('div', { class: 'page-sub', style: 'margin-bottom:10px' },
      `${lesson.emoji} ${lesson.title} — ${subj.short}`),
    stage, fb);

  /* ---------- vẽ 1 câu hỏi ---------- */
  function drawQuestion() {
    locked = false;
    clear(fb);
    const q = questions[i];
    bar.style.width = `${(i / questions.length) * 100}%`;

    const promptNode = (() => {
      if (q.prompt.type === 'audio') {
        const btn = h('button', {
          class: 'speaker pulse', style: `--accent:${subj.hue}`, 'aria-label': 'Nghe lại',
          onClick: () => speech.speak(q.prompt.speak.text, q.prompt.speak.lang),
        }, '🔊');
        setTimeout(() => speech.speak(q.prompt.speak.text, q.prompt.speak.lang), 320);
        return h('div', {}, btn, h('div', { class: 'q-sub' }, 'Bấm loa để nghe lại'));
      }
      if (q.prompt.type === 'emoji') {
        return h('div', {},
          h('div', { class: 'q-emoji' }, q.prompt.emoji),
          q.prompt.text ? h('div', { class: 'q-main small' }, q.prompt.text) : null,
          q.prompt.sub ? h('div', { class: 'q-sub' }, q.prompt.sub) : null);
      }
      if (q.prompt.type === 'math-emoji') {
        return h('div', {},
          h('div', { class: 'q-emoji row' }, q.prompt.emoji),
          h('div', { class: 'q-main' + (q.prompt.text.length > 18 ? ' small' : '') }, q.prompt.text));
      }
      return h('div', {},
        h('div', { class: 'q-main' + (q.prompt.text.length > 12 ? ' small' : '') }, q.prompt.text),
        q.prompt.sub ? h('div', { class: 'q-sub' }, q.prompt.sub) : null);
    })();

    const qCard = h('div', { class: 'q-card', style: `--accent:${subj.hue}` },
      h('div', { class: 'q-label' }, `Câu ${i + 1}/${questions.length} — ${q.question}`),
      promptNode);

    if (q.prompt.type !== 'audio' && q.prompt.speak) {
      qCard.style.cursor = 'pointer';
      qCard.addEventListener('click', () => speech.speak(q.prompt.speak.text, q.prompt.speak.lang));
    }

    const opts = h('div', { class: 'opts' + (q.options.length === 3 ? ' three' : '') });
    q.options.forEach((o) => {
      const b = h('button', {
        class: 'opt ' + (o.style && o.style !== 'pic' ? o.style : ''),
        style: `--accent:${subj.hue}`,
        onClick: () => answer(o, b, opts),
      },
        o.emoji ? h('div', { class: 'o-emoji' }, o.emoji) : null,
        o.label ? h('div', { class: 'o-label' }, o.label) : null,
        o.sub ? h('div', { class: 'o-sub' }, o.sub) : null);
      opts.append(b);
    });

    clear(stage);
    stage.append(qCard, opts);
  }

  /* ---------- xử lý trả lời ---------- */
  function answer(opt, btn, optsWrap) {
    if (locked) return;
    locked = true;
    const q = questions[i];
    const ok = opt.id === q.answerId;

    P.recordAnswer(q.itemId, ok);
    if (ok) { correct++; sfx.correct(); } else { sfx.wrong(); }
    scoreEl.textContent = '⭐ ' + correct;

    [...optsWrap.children].forEach((c, idx) => {
      c.disabled = true;
      const o = q.options[idx];
      if (o.id === q.answerId) c.classList.add('correct');
      else if (c === btn) c.classList.add('wrong');
      else c.classList.add('dim');
    });

    const praise = ok ? rndOf(PRAISE_OK) : rndOf(PRAISE_NO);
    const right = q.options.find((o) => o.id === q.answerId);
    clear(fb);
    fb.append(
      h('div', { class: 'fb-emoji' }, praise.e),
      h('div', { class: 'fb-text ' + (ok ? 'ok' : 'no') }, praise.t),
      !ok ? h('div', { class: 'fb-hint' },
        'Đáp án đúng là: ' + (right.label || right.emoji || '')) : null);

    if (!ok) misses.push({ itemId: q.itemId, label: right.label || right.emoji || '?' });

    // đọc lại đáp án đúng để bé nhớ
    if (!ok && q.prompt.speak) setTimeout(() => speech.speak(q.prompt.speak.text, q.prompt.speak.lang), 500);

    setTimeout(() => {
      i++;
      if (i >= questions.length) showResult();
      else drawQuestion();
    }, ok ? 1000 : 2200);
  }

  /* ---------- kết quả ---------- */
  function showResult() {
    bar.style.width = '100%';
    const res = P.finishLesson(lesson.id, correct, questions.length);
    const pct = Math.round(res.ratio * 100);
    window.dispatchEvent(new CustomEvent('progress-changed'));

    if (res.stars === 3) { sfx.win(); confetti(90); }
    else if (res.stars >= 1) { sfx.star(); confetti(40); }

    const emoji = res.stars === 3 ? '🏆' : res.stars === 2 ? '🎉' : res.stars === 1 ? '👍' : '💪';
    const title = res.stars === 3 ? 'Hoàn hảo!' : res.stars === 2 ? 'Bé làm tốt lắm!' :
      res.stars === 1 ? 'Bé đã cố gắng!' : 'Mình ôn lại nhé';

    const uniqueMisses = [];
    misses.forEach((m) => { if (!uniqueMisses.find((x) => x.label === m.label)) uniqueMisses.push(m); });

    const next = P.nextLessonOf(lesson.subject);

    clear(stage); clear(fb);
    stage.append(h('div', { class: 'result', style: `--accent:${subj.hue}` },
      h('div', { class: 'result-emoji' }, emoji),
      h('div', { class: 'result-title' }, title),
      h('div', { class: 'result-stars' }, starRow(res.stars, 3)),
      h('div', { class: 'result-score' }, `Đúng ${correct}/${questions.length} câu (${pct}%)`),
      h('div', { class: 'result-note' },
        `+${res.gained} sao · Tổng ${res.totalStars} sao · Chuỗi ${res.streak} ngày 🔥`),
      uniqueMisses.length
        ? h('div', {},
          h('div', { class: 'result-note' }, 'Cần luyện thêm:'),
          h('div', { class: 'miss-list' }, ...uniqueMisses.map((m) => h('span', { class: 'miss' }, m.label))))
        : h('div', { class: 'result-note' }, 'Bé không sai câu nào 🌟'),
      h('div', { class: 'btn-row', style: 'justify-content:center;margin-top:20px' },
        h('button', {
          class: 'btn primary', style: `--accent:${subj.hue}`,
          onClick: () => go(`#/test/${encodeURIComponent(lesson.id)}`),
        }, '🔁 Làm lại'),
        h('button', {
          class: 'btn',
          onClick: () => go(`#/hoc/${encodeURIComponent(lesson.id)}`),
        }, '📖 Học lại bài này'),
        next && next.id !== lesson.id
          ? h('button', {
            class: 'btn',
            onClick: () => go(`#/hoc/${encodeURIComponent(next.id)}`),
          }, '➡️ Bài tiếp theo')
          : null,
        h('button', { class: 'btn', onClick: () => go('#/') }, '🏠 Trang chủ'))));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  drawQuestion();
}
