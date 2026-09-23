/* =============================================================
   APP — router chính
   ============================================================= */

import { h, clear, go } from './ui.js';
import * as P from './storage.js';
import * as speech from './speech.js';
import * as sfx from './sfx.js';
import { renderHome } from './views/home.js';
import { renderSubject } from './views/subject.js';
import { renderLearn } from './views/learn.js';
import { renderQuiz } from './views/quiz.js';
import { renderDashboard } from './views/dashboard.js';

const app = document.getElementById('app');
const barSlot = document.getElementById('topbar');

/* ---------- thanh trên ---------- */
function topbar() {
  const s = P.state();
  const soundBtn = h('button', {
    class: 'icon-btn', title: 'Bật/tắt âm thanh', 'aria-label': 'Bật hoặc tắt âm thanh',
  }, speech.isEnabled() ? '🔊' : '🔇');
  soundBtn.addEventListener('click', () => {
    const on = !speech.isEnabled();
    speech.setEnabled(on);
    sfx.setEnabled(on);
    soundBtn.textContent = on ? '🔊' : '🔇';
  });

  return h('div', { class: 'topbar' },
    h('button', {
      class: 'brand', onClick: () => go('#/'), style: 'cursor:pointer',
    },
      h('span', { class: 'brand-logo' }, '🎓'),
      h('span', {}, 'Bé Học Vui')),
    h('span', { class: 'topbar-spacer' }),
    h('span', { class: 'chip gold' }, '⭐ ', String(s.stars)),
    h('span', { class: 'chip' }, '🔥 ', String(s.streak.count)),
    soundBtn,
    h('button', {
      class: 'icon-btn', title: 'Trang phụ huynh', 'aria-label': 'Trang phụ huynh',
      onClick: () => go('#/phuhuynh'),
    }, '👨‍👩‍👧'));
}

/* ---------- router ---------- */
function route() {
  speech.stop();
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  const [page, arg] = [parts[0] || '', parts[1] ? decodeURIComponent(parts.slice(1).join('/')) : ''];

  clear(barSlot);
  barSlot.append(topbar());
  clear(app);
  window.scrollTo({ top: 0 });

  try {
    switch (page) {
      case '':        renderHome(app, route); break;
      case 'mon':     renderSubject(app, arg); break;
      case 'hoc':     renderLearn(app, arg); break;
      case 'test':    renderQuiz(app, arg); break;
      case 'phuhuynh':renderDashboard(app, route); break;
      default:        go('#/');
    }
  } catch (err) {
    console.error(err);
    app.append(h('div', { class: 'note' },
      '😥 Có lỗi xảy ra khi mở trang này. ',
      h('button', { class: 'btn', style: 'margin-top:8px', onClick: () => go('#/') }, 'Về trang chủ')));
  }
}

window.addEventListener('hashchange', route);

/* cập nhật số sao trên thanh trên khi bé vừa làm xong bài */
window.addEventListener('progress-changed', () => {
  clear(barSlot);
  barSlot.append(topbar());
});

/* mở khoá âm thanh sau tương tác đầu tiên (yêu cầu của iOS/Safari) */
const unlock = () => { sfx.click(); window.removeEventListener('pointerdown', unlock); };
window.addEventListener('pointerdown', unlock);

route();
