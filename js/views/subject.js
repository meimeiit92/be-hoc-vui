/* =============================================================
   TRANG MỘT MÔN HỌC — danh sách bài
   ============================================================= */

import { h, go, starRow, backBtn } from '../ui.js';
import { SUBJECTS, lessonsOf } from '../curriculum.js';
import * as P from '../storage.js';

export function renderSubject(root, subjectKey) {
  const subj = SUBJECTS[subjectKey];
  if (!subj) { go('#/'); return; }

  const ls = lessonsOf(subjectKey);
  const pr = P.subjectProgress(subjectKey);
  const next = P.nextLessonOf(subjectKey);

  root.append(backBtn('Trang chủ', '#/'));

  root.append(h('div', { class: 'page-head', style: `--accent:${subj.hue}` },
    h('div', { class: 'page-emoji' }, subj.emoji),
    h('div', { style: 'flex:1;min-width:180px' },
      h('h1', { class: 'page-title' }, subj.title),
      h('div', { class: 'page-sub' },
        `${pr.passed}/${pr.lessons} bài đã qua · ${pr.mastered}/${pr.items} nội dung đã thuộc`)),
    h('button', {
      class: 'btn primary', style: `--accent:${subj.hue}`,
      onClick: () => go(`#/hoc/${encodeURIComponent(next.id)}`),
    }, '▶️ Học tiếp')));

  root.append(h('div', { class: 'bar', style: `--accent:${subj.hue};margin-bottom:20px;height:14px` },
    h('i', { style: `width:${pr.lessonPct}%` })));

  const list = h('div', { class: 'lesson-list' });
  ls.forEach((l, i) => {
    const st = P.lessonStat(l.id);
    const passed = P.isPassed(l.id);
    list.append(h('button', {
      class: 'lesson-row' + (passed ? ' passed' : ''),
      style: `--accent:${subj.hue}`,
      onClick: () => go(`#/hoc/${encodeURIComponent(l.id)}`),
    },
      h('div', { class: 'lesson-num' }, passed ? '✓' : String(i + 1)),
      h('div', { class: 'lesson-info' },
        h('div', { class: 'lesson-name' }, l.emoji + ' ' + l.title),
        h('div', { class: 'lesson-desc' },
          st ? `${l.desc} · đã học ${st.attempts} lần · điểm cao nhất ${Math.round(st.best * 100)}%` : l.desc)),
      starRow(st ? st.stars : 0),
      l.id === next.id && !passed ? h('span', { class: 'tag' }, 'nên học')
        : passed ? h('span', { class: 'tag' }, '🔄 học lại') : null));
  });

  root.append(list);
}
