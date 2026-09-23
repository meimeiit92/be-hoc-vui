/* =============================================================
   CHẾ ĐỘ HỌC — thẻ lật (chữ ↔ hình) hoặc màn hình dạy Toán
   ============================================================= */

import { h, go, clear, backBtn } from '../ui.js';
import { SUBJECTS, LESSON_BY_ID } from '../curriculum.js';
import * as speech from '../speech.js';
import * as sfx from '../sfx.js';
import * as P from '../storage.js';
import { renderMathLearn } from './math-learn.js';

/* ---------- Học bài dạng thẻ ---------- */
function renderCards(root, lesson, subj) {
  let idx = 0;
  let flipped = false;

  const card = h('div', { class: 'flash', style: `--accent:${subj.hue}`, tabindex: '0' });
  const count = h('div', { class: 'learn-count' });
  const dots = h('div', { class: 'dots' });

  function speakCard(c) {
    const parts = [c.speak];
    if (c.speakHint && c.speakHint.text !== c.speak.text) parts.push(c.speakHint);
    speech.speakSeq(parts.map((p) => ({ text: p.text, lang: p.lang })));
  }

  function draw() {
    const c = lesson.cards[idx];
    clear(card);
    if (!flipped) {
      card.append(
        h('div', {},
          h('div', { class: 'flash-main' + (c.main.length > 6 ? ' small' : '') }, c.main),
          c.sub ? h('div', { class: 'flash-sub' }, c.sub) : null),
        h('div', { class: 'flash-tap' }, '👆 Bấm vào thẻ để xem hình'));
    } else {
      card.append(
        h('div', {},
          h('div', { class: 'flash-emoji' }, c.emoji),
          h('div', { class: 'flash-hint' }, c.hint),
          c.hintVi ? h('div', { class: 'flash-hint-vi' }, c.hintVi) : null),
        h('div', { class: 'flash-tap' }, '👆 Bấm để quay lại chữ'));
    }
    count.textContent = `${idx + 1}/${lesson.cards.length}`;
    clear(dots);
    lesson.cards.forEach((_, i) => dots.append(h('i', { class: i === idx ? 'on' : '' })));
    dots.style.setProperty('--accent', subj.hue);
  }

  card.addEventListener('click', () => {
    flipped = !flipped;
    sfx.click();
    draw();
    if (flipped) speech.speak(lesson.cards[idx].speakHint?.text || lesson.cards[idx].hint,
      lesson.cards[idx].speakHint?.lang || 'vi');
  });

  const move = (d) => {
    idx = (idx + d + lesson.cards.length) % lesson.cards.length;
    flipped = false;
    draw();
    speakCard(lesson.cards[idx]);
  };

  const nav = h('div', { class: 'learn-nav' },
    h('button', { class: 'btn', onClick: () => move(-1) }, '⬅️'),
    h('button', {
      class: 'btn primary', style: `--accent:${subj.hue}`,
      onClick: () => speakCard(lesson.cards[idx]),
    }, '🔊 Nghe lại'),
    count,
    h('button', { class: 'btn', onClick: () => move(1) }, '➡️'));

  document.addEventListener('keydown', onKey);
  function onKey(e) {
    if (!document.body.contains(card)) { document.removeEventListener('keydown', onKey); return; }
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === ' ') { e.preventDefault(); card.click(); }
  }

  root.append(h('div', { class: 'learn-wrap' }, card, nav, dots));
  draw();
  setTimeout(() => speakCard(lesson.cards[0]), 400);
}

/* ---------- View chính ---------- */
export function renderLearn(root, lessonId) {
  const lesson = LESSON_BY_ID[lessonId];
  if (!lesson) { go('#/'); return; }
  const subj = SUBJECTS[lesson.subject];
  const st = P.lessonStat(lesson.id);

  root.append(backBtn(subj.short, `#/mon/${lesson.subject}`));
  root.append(h('div', { class: 'page-head' },
    h('div', { class: 'page-emoji' }, lesson.emoji),
    h('div', { style: 'flex:1;min-width:180px' },
      h('h1', { class: 'page-title' }, lesson.title),
      h('div', { class: 'page-sub' },
        h('span', { class: 'tag', style: 'margin-right:6px' }, '📚 phần học'),
        lesson.desc,
        st ? ` · đã học ${st.attempts} lần · điểm cao nhất ${Math.round(st.best * 100)}%` : '')),
    h('button', {
      class: 'btn primary big', style: `--accent:${subj.hue}`,
      onClick: () => go(`#/test/${encodeURIComponent(lesson.id)}`),
    }, '📝 Làm bài kiểm tra')));

  if (lesson.type === 'math') renderMathLearn(root, lesson, subj);
  else renderCards(root, lesson, subj);

  root.append(h('div', { class: 'section' },
    h('div', { class: 'btn-row', style: 'justify-content:center' },
      h('button', {
        class: 'btn', onClick: () => go(`#/hoc/${encodeURIComponent(lesson.id)}`),
      }, '🔄 Học lại bài này'),
      h('button', {
        class: 'btn primary big', style: `--accent:${subj.hue}`,
        onClick: () => go(`#/test/${encodeURIComponent(lesson.id)}`),
      }, 'Bé học xong rồi — Làm bài kiểm tra 📝'))));
}
