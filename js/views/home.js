/* =============================================================
   TRANG CHỦ
   ============================================================= */

import { h, go, starRow, modal } from '../ui.js';
import { SUBJECTS, SUBJECT_ORDER } from '../curriculum.js';
import * as P from '../storage.js';
import * as speech from '../speech.js';

const AVATARS = ['🐻', '🐰', '🐱', '🐼', '🦊', '🐧', '🦁', '🐨', '🐯', '🦄', '🐥', '🐸'];

function profileModal(rerender) {
  const s = P.state();
  let avatar = s.profile.avatar;
  const nameInput = h('input', { value: s.profile.name, maxlength: '20', placeholder: 'Tên của bé' });
  const goalInput = h('input', { type: 'number', min: '1', max: '8', value: String(s.goal) });
  const pick = h('div', { class: 'avatar-pick' });
  AVATARS.forEach((a) => {
    const b = h('button', { class: a === avatar ? 'on' : '', onClick: () => {
      avatar = a;
      [...pick.children].forEach((c) => c.classList.toggle('on', c.textContent === a));
    } }, a);
    pick.append(b);
  });

  modal('Thông tin của bé',
    h('div', {},
      h('div', { class: 'field' }, h('label', {}, 'Tên bé'), nameInput),
      h('div', { class: 'field' }, h('label', {}, 'Chọn con vật bé thích'), pick),
      h('div', { class: 'field' },
        h('label', {}, 'Số bài học mỗi ngày (1–8)'), goalInput)),
    [{
      label: 'Lưu', primary: true, onClick: () => {
        P.setProfile(nameInput.value.trim() || 'Bé', avatar);
        P.setGoal(parseInt(goalInput.value, 10) || 3);
        rerender();
      },
    }]);
}

export function renderHome(root, rerender) {
  const s = P.state();
  const overall = P.overallProgress();
  const plan = P.dailyPlan();
  const done = new Set(P.doneToday());

  /* ---------- Hero ---------- */
  const hero = h('div', { class: 'hero' },
    h('button', {
      class: 'hero-avatar', title: 'Đổi tên & hình đại diện',
      onClick: () => profileModal(rerender),
    }, s.profile.avatar),
    h('div', { class: 'hero-text' },
      h('div', { class: 'hero-hi' }, 'Xin chào'),
      h('div', { class: 'hero-name' }, s.profile.name, ' ơi!'),
      h('div', { class: 'hero-sub' },
        overall.passed === 0
          ? 'Hôm nay mình bắt đầu học nhé 🎒'
          : `Bé đã hoàn thành ${overall.passed}/${overall.total} bài — cố lên!`)),
    h('div', { class: 'stat-row' },
      h('div', { class: 'stat' }, h('div', { class: 'stat-v' }, '⭐ ' + s.stars), h('div', { class: 'stat-l' }, 'Sao thưởng')),
      h('div', { class: 'stat' }, h('div', { class: 'stat-v' }, '🔥 ' + s.streak.count), h('div', { class: 'stat-l' }, 'Ngày liên tiếp')),
      h('div', { class: 'stat' }, h('div', { class: 'stat-v' }, overall.pct + '%'), h('div', { class: 'stat-l' }, 'Tiến độ chung'))));

  /* ---------- Kế hoạch hôm nay ---------- */
  const planGrid = h('div', { class: 'plan-grid' });
  plan.forEach(({ lesson, reason, tag }) => {
    const subj = SUBJECTS[lesson.subject];
    const isDone = done.has(lesson.id);
    planGrid.append(h('button', {
      class: 'plan-card', style: `--accent:${subj.hue}`,
      onClick: () => go(`#/hoc/${encodeURIComponent(lesson.id)}`),
    },
      h('div', { class: 'plan-emoji' }, lesson.emoji),
      h('div', { class: 'plan-body' },
        h('div', { class: 'plan-title' }, lesson.title),
        h('div', { class: 'plan-meta' }, subj.emoji + ' ' + subj.short, ' · ', h('span', { class: 'tag' }, tag)),
        isDone
          ? h('div', { class: 'plan-done' }, '✅ Hôm nay đã học xong — bấm để học lại')
          : h('div', { class: 'plan-reason' }, reason))));
  });

  const planSection = h('section', { class: 'section' },
    h('div', { class: 'section-head' },
      h('h2', { class: 'section-title' }, '🎯 Hôm nay học gì?'),
      h('span', { class: 'section-note' },
        `${plan.filter((p) => done.has(p.lesson.id)).length}/${plan.length} bài đã xong`),
      h('span', { class: 'topbar-spacer' }),
      h('button', {
        class: 'chip', title: 'Chọn bài khác',
        onClick: () => { P.refreshPlan(); rerender(); },
      }, '🔄 Đổi bài')),
    planGrid);

  /* ---------- Các môn học ---------- */
  const subjGrid = h('div', { class: 'subj-grid' });
  SUBJECT_ORDER.forEach((k) => {
    const subj = SUBJECTS[k];
    const pr = P.subjectProgress(k);
    subjGrid.append(h('button', {
      class: 'subj-card', style: `--accent:${subj.hue}`,
      onClick: () => go(`#/mon/${k}`),
    },
      h('div', { class: 'subj-emoji' }, subj.emoji),
      h('div', { class: 'subj-title' }, subj.title),
      h('div', { class: 'subj-meta' }, `${pr.passed}/${pr.lessons} bài · ${pr.lessonPct}%`),
      h('div', { class: 'bar' }, h('i', { style: `width:${pr.lessonPct}%` }))));
  });

  const subjSection = h('section', { class: 'section' },
    h('div', { class: 'section-head' }, h('h2', { class: 'section-title' }, '📚 Chọn môn học')),
    subjGrid);

  /* ---------- Cảnh báo giọng đọc ---------- */
  const warns = [];
  if (P.isMemoryOnly()) {
    warns.push('⚠️ Trình duyệt đang chặn bộ nhớ nên tiến trình chỉ lưu tạm trong phiên này. Hãy mở trang bằng Chrome/Safari thông thường (không dùng chế độ ẩn danh) để lưu lâu dài.');
  }
  if (speech.supported() && !speech.hasVoice('vi')) {
    warns.push('🔈 Máy này chưa có giọng đọc tiếng Việt nên phần phát âm tiếng Việt có thể không chuẩn. Phần tiếng Anh vẫn đọc tốt. Cách thêm giọng Việt: Windows → Settings › Time & language › Speech; iPad/iPhone → Cài đặt › Trợ năng › Nội dung đọc.');
  }

  root.append(hero,
    ...warns.map((t) => h('div', { class: 'note' }, t)),
    planSection, subjSection,
    h('div', { class: 'section', style: 'text-align:center' },
      h('button', { class: 'btn', onClick: () => go('#/phuhuynh') }, '👨‍👩‍👧 Trang dành cho bố mẹ')));
}
