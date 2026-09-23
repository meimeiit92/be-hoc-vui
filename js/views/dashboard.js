/* =============================================================
   TRANG PHỤ HUYNH — theo dõi tiến trình
   ============================================================= */

import { h, go, backBtn, modal, clear } from '../ui.js';
import { SUBJECTS, SUBJECT_ORDER, LESSON_BY_ID, describeItem } from '../curriculum.js';
import * as P from '../storage.js';
import * as speech from '../speech.js';
import * as sfx from '../sfx.js';

/* Biểu đồ 7 ngày: 1 chuỗi dữ liệu duy nhất (số câu đúng / ngày).
   Một chuỗi → không cần legend; nhãn số ghi trực tiếp trên cột. */
function chart7(days) {
  const max = Math.max(1, ...days.map((d) => d.correct));
  const grid = h('div', { class: 'chart7' });
  days.forEach((d) => {
    const pct = Math.round((d.correct / max) * 100);
    grid.append(h('div', { class: 'c7-col' },
      h('div', { class: 'c7-val' }, d.correct ? String(d.correct) : '·'),
      h('div', { class: 'c7-track' },
        h('div', {
          class: 'c7-bar' + (d.correct ? '' : ' zero'),
          style: `height:${d.correct ? Math.max(8, pct) : 3}%`,
          title: `${d.day}: ${d.correct}/${d.total} câu đúng`,
        })),
      h('div', { class: 'c7-lab' }, d.label)));
  });
  return grid;
}

function table7(days) {
  const t = h('table', { class: 'tbl' },
    h('thead', {}, h('tr', {},
      h('th', {}, 'Ngày'), h('th', {}, 'Bài'), h('th', {}, 'Đúng'), h('th', {}, 'Tổng'))),
    h('tbody', {}, ...days.map((d) => h('tr', {},
      h('td', {}, d.label + ' · ' + d.day.slice(5)),
      h('td', { class: 'num' }, String(d.lessons)),
      h('td', { class: 'num' }, String(d.correct)),
      h('td', { class: 'num' }, String(d.total))))));
  return t;
}

export function renderDashboard(root, rerender) {
  const s = P.state();
  const overall = P.overallProgress();
  const days = P.last7Days();
  const weak = P.weakItems(14);
  const plan = P.dailyPlan();

  const totalQ = s.history.reduce((a, x) => a + x.total, 0);
  const totalOk = s.history.reduce((a, x) => a + x.correct, 0);
  const acc = totalQ ? Math.round((totalOk / totalQ) * 100) : 0;
  const week = days.reduce((a, d) => a + d.correct, 0);

  root.append(backBtn('Trang chủ', '#/'));
  root.append(h('div', { class: 'page-head' },
    h('div', { class: 'page-emoji' }, '👨‍👩‍👧'),
    h('div', { style: 'flex:1;min-width:200px' },
      h('h1', { class: 'page-title' }, 'Theo dõi việc học của ' + s.profile.name),
      h('div', { class: 'page-sub' },
        `Đã làm ${s.history.length} lượt kiểm tra · ${totalQ} câu hỏi`))));

  /* ---------- KPI ---------- */
  root.append(h('div', { class: 'dash-grid' },
    h('div', { class: 'panel' }, h('div', { class: 'kpi' }, '⭐ ' + s.stars), h('div', { class: 'kpi-l' }, 'Tổng sao thưởng')),
    h('div', { class: 'panel' }, h('div', { class: 'kpi' }, '🔥 ' + s.streak.count), h('div', { class: 'kpi-l' }, 'Ngày học liên tiếp')),
    h('div', { class: 'panel' }, h('div', { class: 'kpi' }, overall.passed + '/' + overall.total), h('div', { class: 'kpi-l' }, 'Bài đã qua (≥70%)')),
    h('div', { class: 'panel' }, h('div', { class: 'kpi' }, acc + '%'), h('div', { class: 'kpi-l' }, 'Tỉ lệ trả lời đúng'))));

  /* ---------- Tiến độ từng môn ---------- */
  const meters = h('div', { class: 'meter-row' });
  SUBJECT_ORDER.forEach((k) => {
    const subj = SUBJECTS[k];
    const pr = P.subjectProgress(k);
    meters.append(h('div', { style: `--accent:${subj.hue}` },
      h('div', { class: 'meter-line' },
        h('span', { class: 'meter-dot' }),
        h('span', { class: 'meter-name' }, subj.emoji + ' ' + subj.title),
        h('span', { class: 'meter-val' }, `${pr.passed}/${pr.lessons} bài`),
        h('span', { class: 'meter-val' }, `${pr.itemPct}% thuộc`)),
      h('div', { class: 'meter-track', style: 'margin-top:6px' },
        h('i', { style: `width:${Math.max(pr.itemPct, 1)}%` }))));
  });

  /* ---------- Biểu đồ 7 ngày + bảng ---------- */
  const chartBox = h('div', {}, chart7(days));
  let showTable = false;
  const toggle = h('button', {
    class: 'chip', onClick: () => {
      showTable = !showTable;
      clear(chartBox);
      chartBox.append(showTable ? table7(days) : chart7(days));
      toggle.textContent = showTable ? '📊 Xem biểu đồ' : '🔢 Xem dạng bảng';
    },
  }, '🔢 Xem dạng bảng');

  root.append(h('div', { class: 'section', style: 'display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))' },
    h('div', { class: 'panel' },
      h('h3', {}, 'Tiến độ theo môn'),
      h('div', { class: 'panel-note' }, 'Phần trăm nội dung bé đã thuộc (đúng 3 lần liên tiếp)'),
      meters),
    h('div', { class: 'panel' },
      h('div', { style: 'display:flex;align-items:center;gap:10px;flex-wrap:wrap' },
        h('div', { style: 'flex:1' },
          h('h3', {}, 'Số câu trả lời đúng — 7 ngày gần nhất'),
          h('div', { class: 'panel-note' }, `Tuần này: ${week} câu đúng`)),
        toggle),
      chartBox)));

  /* ---------- Chỗ bé còn yếu ---------- */
  const weakPanel = h('div', { class: 'panel' },
    h('h3', {}, 'Bé còn hay sai ở đây'),
    h('div', { class: 'panel_note panel-note' },
      weak.length ? 'Những nội dung này sẽ tự động xuất hiện nhiều hơn trong bài kiểm tra tới.'
        : 'Chưa có dữ liệu — bé cần làm vài bài kiểm tra trước.'));
  if (weak.length) {
    const grid = h('div', { class: 'weak-grid' });
    weak.forEach((w) => {
      const d = describeItem(w.id);
      const target = d.lesson || w.lesson;
      grid.append(h('button', {
        class: 'weak-chip',
        title: target ? `Mở bài: ${target.title}` : '',
        onClick: () => target && go(`#/hoc/${encodeURIComponent(target.id)}`),
      }, d.label, h('span', { style: 'opacity:.7;font-weight:700' }, `${w.it.ok}/${w.it.seen}`)));
    });
    weakPanel.append(grid);
  }

  /* ---------- Gợi ý hôm nay ---------- */
  const planPanel = h('div', { class: 'panel' },
    h('h3', {}, 'Bài tập gợi ý cho hôm nay'),
    h('div', { class: 'panel-note' }, `Hệ thống chọn ${s.goal} bài dựa trên chỗ bé còn yếu và tiến độ từng môn`),
    h('div', { style: 'display:grid;gap:10px' },
      ...plan.map(({ lesson, reason, tag }) => h('button', {
        class: 'lesson-row', style: `--accent:${SUBJECTS[lesson.subject].hue}`,
        onClick: () => go(`#/hoc/${encodeURIComponent(lesson.id)}`),
      },
        h('div', { class: 'lesson-num' }, lesson.emoji),
        h('div', { class: 'lesson-info' },
          h('div', { class: 'lesson-name' }, lesson.title),
          h('div', { class: 'lesson-desc wrap' }, reason)),
        h('span', { class: 'tag' }, tag)))));

  root.append(h('div', { class: 'section', style: 'display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))' },
    weakPanel, planPanel));

  /* ---------- Lịch sử ---------- */
  const hist = s.history.slice(-12).reverse();
  root.append(h('div', { class: 'section' },
    h('div', { class: 'panel' },
      h('h3', {}, 'Lịch sử 12 lượt kiểm tra gần nhất'),
      h('div', { class: 'panel-note' }, hist.length ? '' : 'Chưa có lượt nào.'),
      hist.length ? h('table', { class: 'tbl' },
        h('thead', {}, h('tr', {},
          h('th', {}, 'Thời gian'), h('th', {}, 'Bài'), h('th', {}, 'Môn'),
          h('th', {}, 'Điểm'), h('th', {}, 'Sao'))),
        h('tbody', {}, ...hist.map((x) => {
          const l = LESSON_BY_ID[x.lessonId];
          const d = new Date(x.at);
          return h('tr', {},
            h('td', {}, `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`),
            h('td', {}, l ? l.title : x.lessonId),
            h('td', {}, SUBJECTS[x.subject] ? SUBJECTS[x.subject].short : '—'),
            h('td', { class: 'num' }, `${x.correct}/${x.total}`),
            h('td', { class: 'num' }, '⭐'.repeat(x.stars) || '—'));
        }))) : null)));

  /* ---------- Cài đặt ---------- */
  const voiceInfo = speech.supported()
    ? `Giọng tiếng Việt: ${speech.hasVoice('vi') ? '✅ có' : '❌ chưa có'} · Giọng tiếng Anh: ${speech.hasVoice('en') ? '✅ có' : '❌ chưa có'}`
    : 'Trình duyệt này không hỗ trợ đọc thành tiếng.';

  const sw = (label, get, set) => {
    const b = h('button', { class: 'chip', onClick: () => { set(!get()); b.textContent = `${label}: ${get() ? 'Bật' : 'Tắt'}`; } },
      `${label}: ${get() ? 'Bật' : 'Tắt'}`);
    return b;
  };

  const fileInput = h('input', { type: 'file', accept: '.json', style: 'display:none' });
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (!f) return;
    try {
      P.importJSON(await f.text());
      alert('Đã nhập dữ liệu thành công.');
      rerender();
    } catch (e) {
      alert('Không đọc được tệp: ' + e.message);
    }
  });

  root.append(h('div', { class: 'section' },
    h('div', { class: 'panel' },
      h('h3', {}, 'Cài đặt & dữ liệu'),
      h('div', { class: 'panel-note' }, voiceInfo + (P.isMemoryOnly() ? ' · ⚠️ Tiến trình chỉ lưu tạm (trình duyệt chặn localStorage)' : ' · Tiến trình được lưu trên máy này')),
      h('div', { class: 'btn-row' },
        sw('🔊 Giọng đọc', speech.isEnabled, speech.setEnabled),
        sw('🎵 Âm thanh', sfx.isEnabled, sfx.setEnabled),
        h('button', {
          class: 'chip', onClick: () => {
            const blob = new Blob([P.exportJSON()], { type: 'application/json' });
            const a = h('a', { href: URL.createObjectURL(blob), download: `tien-trinh-${P.today()}.json` });
            document.body.append(a); a.click(); a.remove();
          },
        }, '💾 Xuất tiến trình'),
        h('button', { class: 'chip', onClick: () => fileInput.click() }, '📂 Nhập tiến trình'),
        fileInput,
        h('button', {
          class: 'chip', style: 'color:var(--bad)', onClick: () => {
            modal('Xoá toàn bộ tiến trình?',
              h('p', { style: 'margin:0;font-size:14px;line-height:1.5' },
                'Toàn bộ điểm, sao và lịch sử học của bé sẽ bị xoá và không lấy lại được. Bố mẹ nên bấm “Xuất tiến trình” trước khi xoá.'),
              [{ label: 'Xoá hết', primary: true, onClick: () => { P.resetAll(); rerender(); } }]);
          },
        }, '🗑️ Xoá tiến trình')))));
}
