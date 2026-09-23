/* =============================================================
   UI — tiện ích dựng DOM
   ============================================================= */

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.setAttribute('style', v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v);
  }
  for (const c of children.flat(4)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export function starRow(n, max = 3, cls = 'stars') {
  return h('span', { class: cls, 'aria-label': `${n} trên ${max} sao` },
    ...Array.from({ length: max }, (_, i) =>
      h('span', { class: i < n ? '' : 'off' }, '⭐')));
}

export function go(hash) {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = hash;
}

export function backBtn(label = 'Quay lại', hash = '#/') {
  return h('button', { class: 'back-btn', onClick: () => go(hash) }, '⬅️ ', label);
}

/* ---------- confetti ---------- */
export function confetti(count = 60) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wrap = h('div', { class: 'confetti' });
  const colors = ['#E8553D', '#2F7DD1', '#3E9B57', '#8B5CF6', '#E0A82E', '#FF8FAB'];
  for (let i = 0; i < count; i++) {
    wrap.append(h('i', {
      style: `left:${Math.random() * 100}%;background:${colors[i % colors.length]};
              animation-duration:${1.6 + Math.random() * 1.6}s;animation-delay:${Math.random() * .5}s;`,
    }));
  }
  document.body.append(wrap);
  setTimeout(() => wrap.remove(), 4200);
}

/* ---------- modal ---------- */
export function modal(title, body, actions = []) {
  const bg = h('div', { class: 'modal-bg', onClick: (e) => { if (e.target === bg) bg.remove(); } });
  const box = h('div', { class: 'modal' },
    h('h3', {}, title),
    body,
    h('div', { class: 'btn-row', style: 'margin-top:8px;justify-content:flex-end' },
      ...actions.map((a) =>
        h('button', {
          class: 'btn' + (a.primary ? ' primary' : ''),
          style: a.primary ? '--accent:var(--math)' : '',
          onClick: () => { const r = a.onClick && a.onClick(); if (r !== false) bg.remove(); },
        }, a.label)),
      h('button', { class: 'btn', onClick: () => bg.remove() }, 'Đóng')));
  bg.append(box);
  document.body.append(bg);
  return bg;
}

export const PRAISE_OK = [
  { e: '🎉', t: 'Đúng rồi!' }, { e: '🌟', t: 'Giỏi quá!' }, { e: '👏', t: 'Tuyệt vời!' },
  { e: '🥳', t: 'Chính xác!' }, { e: '💪', t: 'Bé thật giỏi!' }, { e: '🦄', t: 'Xuất sắc!' },
];
export const PRAISE_NO = [
  { e: '🤔', t: 'Chưa đúng nhé' }, { e: '💡', t: 'Thử lại lần sau nha' }, { e: '🙂', t: 'Gần đúng rồi!' },
];

export const rndOf = (a) => a[Math.floor(Math.random() * a.length)];
