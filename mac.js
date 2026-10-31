/* ============================================================
   Joseph Mtaku — desktop portfolio
   Plain JavaScript, no dependencies.
   Sections: helpers, content, look (theme), windows, apps,
             menus, dock, desktop, spotlight, start-up.
   ============================================================ */
(() => {
'use strict';

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('jm:' + k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('jm:' + k, v); } catch (e) {} },
};
const session = {
  get(k) { try { return sessionStorage.getItem('jm:' + k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem('jm:' + k, v); } catch (e) {} },
  clear() { try { sessionStorage.clear(); } catch (e) {} },
};
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileMQ = matchMedia('(max-width: 760px)');
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = isMac ? '⌘' : 'Ctrl ';
const MB = 28; // menu bar height
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- content: read from content.js (edit THAT file, not this one) ---------- */
const SITE = window.SITE || { profile: {}, projects: [], skills: [] };
const P = SITE.profile;
const EMAIL = P.email, PHONE = P.phone, GITHUB = P.github;
const PROJECTS = SITE.projects.map(p => Object.assign({}, p, {
  demo: p.video ? p.id : null,
  links: (p.links || []).map(l => [l.label, l.href, !!l.primary]),
}));
const CLIPS = PROJECTS.filter(p => p.video).map(p => ({ id: p.id, title: p.name, sub: p.video.tagline || '', file: p.video.file, poster: p.video.poster }));
const SKILLS = {};
SITE.skills.forEach(g => { SKILLS[g.key] = { title: g.title, sub: g.sub, chips: g.items || [], items: (g.items || []).map(i => i.name), notes: g.notes }; });

/* ---------- original icons (no third-party artwork) ---------- */
const G = {
  folder: '<svg viewBox="0 0 64 64"><path d="M10 20a5 5 0 0 1 5-5h12l6 7h16a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z" fill="#fff" opacity=".55"/><path d="M10 28a5 5 0 0 1 5-5h34a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z" fill="#fff"/></svg>',
  person: '<svg viewBox="0 0 64 64"><circle cx="32" cy="23" r="10" fill="#fff"/><path d="M13 53c1-11 9-17 19-17s18 6 19 17z" fill="#fff"/></svg>',
  term:   '<svg viewBox="0 0 64 64"><path d="M16 20l16 12-16 12" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 46h14" style="stroke:var(--accent)" stroke-width="6" stroke-linecap="round"/></svg>',
  play:   '<svg viewBox="0 0 64 64"><rect x="10" y="16" width="44" height="32" rx="7" fill="#fff"/><path d="M28 24l12 8-12 8z" fill="#b3104a"/></svg>',
  mail:   '<svg viewBox="0 0 64 64"><rect x="10" y="17" width="44" height="31" rx="6" fill="#fff"/><path d="M13 22l19 14 19-14" fill="none" stroke="#08907c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sliders:'<svg viewBox="0 0 64 64"><g stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M14 22h36M14 32h36M14 42h36"/></g><g fill="#fff" stroke="#5c5c64" stroke-width="3"><circle cx="24" cy="22" r="5"/><circle cx="40" cy="32" r="5"/><circle cx="28" cy="42" r="5"/></g></svg>',
  compass:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="4"/><path d="M40 24l-5 11-11 5 5-11z" fill="#fff"/></svg>',
  trash:  '<svg viewBox="0 0 64 64"><path d="M20 22h24l-2 28a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="#fff" opacity=".92"/><path d="M16 22h32M27 22v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>',
  folderBig: '<svg viewBox="0 0 64 64" width="58" height="58"><defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fd0ff"/><stop offset="1" stop-color="#0a8cff"/></linearGradient></defs><path d="M6 17a5 5 0 0 1 5-5h14l6 7h22a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#2aa7ff"/><path d="M6 26a5 5 0 0 1 5-5h42a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#fg)"/></svg>',
  doc: '<svg viewBox="0 0 64 64" width="50" height="58"><path d="M12 6h28l14 14v34a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill="#fff"/><path d="M40 6v10a4 4 0 0 0 4 4h10z" fill="#d6dae2"/><g stroke="#9aa3b2" stroke-width="3" stroke-linecap="round"><path d="M16 30h32M16 38h32M16 46h20"/></g></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>',
  moon: '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor"/></svg>',
};
const SI = {
  all: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1.2"/><rect x="9" y="2" width="5" height="5" rx="1.2"/><rect x="2" y="9" width="5" height="5" rx="1.2"/><rect x="9" y="9" width="5" height="5" rx="1.2"/></svg>',
  mobile: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 1.5h6A1.5 1.5 0 0 1 12.5 3v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 13V3A1.5 1.5 0 0 1 5 1.5zM8 13a.8.8 0 1 0 0-1.6A.8.8 0 0 0 8 13z"/></svg>',
  fullstack: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2l6 3-6 3-6-3z"/><path d="M2 8l6 3 6-3M2 11l6 3 6-3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  web: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2 8h12M8 2c2.2 2 2.2 10 0 12M8 2c-2.2 2-2.2 10 0 12" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
  backend: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2.5" width="12" height="4.5" rx="1.3"/><rect x="2" y="9" width="12" height="4.5" rx="1.3"/></svg>',
  salesforce: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 12.5a3 3 0 0 1-.3-6 4 4 0 0 1 7.6 1 2.6 2.6 0 0 1-.3 5z"/></svg>',
};

const APPS = {
  projects: { name: 'Projects', title: 'Projects', glyph: G.folder, tile: 'linear-gradient(160deg,#4fc8ff,#0a74ff)', w: 1040, h: 610, minW: 560, minH: 360, dx: 40, dy: 10 },
  about:    { name: 'About', title: 'About Joseph', glyph: G.person, tile: 'linear-gradient(160deg,#ffb54d,#ff5e3a)', w: 780, h: 580, minW: 460, minH: 340, dx: -80, dy: -6 },
  skills:   { name: 'Skills', title: 'Skills', glyph: G.compass, tile: 'linear-gradient(160deg,#6fd0ff,#2f6bff)', w: 1000, h: 620, minW: 520, minH: 360, dx: 30, dy: 10 },
  terminal: { name: 'Terminal', title: 'joseph: terminal', glyph: G.term, tile: 'linear-gradient(160deg,#3a3a42,#121215)', w: 700, h: 470, minW: 420, minH: 280, dx: 60, dy: 30 },
  demos:    { name: 'Demos', title: 'Demos', glyph: G.play, tile: 'linear-gradient(160deg,#ff6b95,#b3104a)', w: 880, h: 500, minW: 520, minH: 340, dx: 0, dy: 20 },
  contact:  { name: 'Contact', title: 'New message', glyph: G.mail, tile: 'linear-gradient(160deg,#3de6b8,#08907c)', w: 780, h: 500, minW: 480, minH: 360, dx: -30, dy: 20 },
  settings: { name: 'Settings', title: 'Settings', glyph: G.sliders, tile: 'linear-gradient(160deg,#b9b9c0,#5c5c64)', w: 580, h: 540, minW: 440, minH: 360, dx: 20, dy: 0 },
};
const DOCK = ['projects', 'about', 'skills', 'terminal', 'demos', 'contact', '|', 'settings', 'trash'];

/* ============================================================
   Look: theme, wallpaper, accent
   ============================================================ */
const root = document.documentElement;
const ACCENTS = [['Blue', '#00AEFF'], ['Violet', '#8B7CFF'], ['Green', '#30D158'], ['Orange', '#FF9F0A'], ['Pink', '#FF5C7A']];
const WALLS = [['dusk', 'Dusk'], ['meadow', 'Meadow'], ['ember', 'Ember']];
let themePref = store.get('theme', 'dark');
const darkMQ = matchMedia('(prefers-color-scheme: dark)');

function resolvedTheme() { return themePref === 'auto' ? (darkMQ.matches ? 'dark' : 'light') : themePref; }
function applyTheme() {
  root.dataset.theme = resolvedTheme();
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = resolvedTheme() === 'dark' ? '#0b1230' : '#dfeaff';
  const b = $('#mbTheme');
  if (b) b.innerHTML = resolvedTheme() === 'dark' ? G.sun : G.moon;
  document.dispatchEvent(new CustomEvent('look'));
}
function setTheme(p) { themePref = p; store.set('theme', p); applyTheme(); }
function setWall(w) { root.dataset.wall = w; store.set('wall', w); document.dispatchEvent(new CustomEvent('look')); }
function setAccent(hex) { root.style.setProperty('--accent', hex); store.set('accent', hex); document.dispatchEvent(new CustomEvent('look')); }
darkMQ.addEventListener && darkMQ.addEventListener('change', () => { if (themePref === 'auto') applyTheme(); });

/* ============================================================
   Toasts and notification
   ============================================================ */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 2700);
}
function copyText(text, msg) {
  const done = () => toast(msg || 'Copied');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
  else fallback();
  function fallback() {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done();
  }
}
function showNotification() {
  if (session.get('notified')) return;
  session.set('notified', '1');
  const host = $('#notif');
  const n = document.createElement('button');
  n.className = 'notif'; n.type = 'button';
  n.innerHTML = `<span class="n-ico"><span class="dock-tile" style="background:${APPS.contact.tile}">${APPS.contact.glyph}</span></span>
    <span><span class="n-app">Contact</span><b>Say hello</b><span>I'm open to roles, collaborations, and interesting projects.</span></span>`;
  host.appendChild(n);
  const dismiss = () => { n.classList.add('out'); setTimeout(() => n.remove(), 400); };
  n.addEventListener('click', () => { dismiss(); openApp('contact'); });
  setTimeout(dismiss, 9000);
}

/* ============================================================
   Windows
   ============================================================ */
const wins = new Map();
let zTop = 20, focused = null;
const winLayer = () => $('#windows');

function startGeometry(app) {
  const vw = innerWidth, vh = innerHeight;
  const w = Math.min(app.w, vw - 32), h = Math.min(app.h, vh - MB - 110);
  const n = wins.size % 5;
  let left = Math.round((vw - w) / 2 + app.dx + n * 22 - 44);
  let top = Math.round(MB + (vh - MB - 96 - h) / 2 + app.dy + n * 20 - 30);
  left = Math.max(8, Math.min(left, vw - w - 8));
  top = Math.max(MB + 8, top);
  return { left, top, w, h };
}

function createWindow(id, args) {
  const app = APPS[id];
  const g = startGeometry(app);
  const el = document.createElement('section');
  el.className = 'win opening';
  el.dataset.app = id;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', app.title);
  el.style.cssText = `left:${g.left}px;top:${g.top}px;width:${g.w}px;height:${g.h}px;z-index:${++zTop}`;
  el.innerHTML = `
    <header class="win-bar">
      <div class="lights">
        <button class="light close" type="button" aria-label="Close window"><svg viewBox="0 0 8 8"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5"/></svg></button>
        <button class="light min" type="button" aria-label="Minimise window"><svg viewBox="0 0 8 8"><path d="M1.5 4h5"/></svg></button>
        <button class="light zoom" type="button" aria-label="Zoom window"><svg viewBox="0 0 8 8"><path d="M2 6l4-4M3 2h3v3"/></svg></button>
      </div>
      <div class="win-title">${esc(app.title)}</div>
      <div class="win-tools"></div>
    </header>
    <div class="win-body"></div>
    <i class="rs rs-r" data-dir="r"></i><i class="rs rs-b" data-dir="b"></i><i class="rs rs-br" data-dir="br"></i>`;
  winLayer().appendChild(el);

  const w = {
    id, el, app, minimized: false, maxed: false, prev: null,
    body: $('.win-body', el), tools: $('.win-tools', el), titleEl: $('.win-title', el),
    setTitle(t) { this.titleEl.textContent = t; el.setAttribute('aria-label', t); },
    onArgs: null,
  };
  wins.set(id, w);
  wireChrome(w);
  BUILD[id](w, args || {});
  focusWin(w, true);
  setTimeout(() => el.classList.remove('opening'), 320);
  renderDock();
  return w;
}

function wireChrome(w) {
  const el = w.el, bar = $('.win-bar', el);
  el.addEventListener('pointerdown', () => focusWin(w), true);
  $('.close', el).addEventListener('click', () => closeWin(w));
  $('.min', el).addEventListener('click', () => minimizeWin(w));
  $('.zoom', el).addEventListener('click', () => zoomWin(w));
  bar.addEventListener('dblclick', e => { if (!e.target.closest('button,input,.win-tools')) zoomWin(w); });

  // drag
  bar.addEventListener('pointerdown', e => {
    if (e.target.closest('button,input,a,.win-tools') || mobileMQ.matches || w.maxed || e.button > 0) return;
    const sx = e.clientX, sy = e.clientY, l0 = el.offsetLeft, t0 = el.offsetTop;
    bar.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    const move = ev => {
      let nx = l0 + ev.clientX - sx, ny = t0 + ev.clientY - sy;
      ny = Math.max(MB, Math.min(ny, innerHeight - 60));
      nx = Math.max(120 - el.offsetWidth, Math.min(nx, innerWidth - 120));
      el.style.left = nx + 'px'; el.style.top = ny + 'px';
    };
    const up = () => {
      el.classList.remove('dragging');
      bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); bar.removeEventListener('pointercancel', up);
    };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up); bar.addEventListener('pointercancel', up);
  });

  // resize
  $$('.rs', el).forEach(h => h.addEventListener('pointerdown', e => {
    if (mobileMQ.matches || w.maxed) return;
    e.preventDefault(); e.stopPropagation(); focusWin(w);
    const dir = h.dataset.dir, sx = e.clientX, sy = e.clientY, w0 = el.offsetWidth, h0 = el.offsetHeight;
    h.setPointerCapture(e.pointerId); el.classList.add('resizing');
    const move = ev => {
      if (dir.includes('r')) el.style.width = Math.max(w.app.minW, Math.min(w0 + ev.clientX - sx, innerWidth - el.offsetLeft - 4)) + 'px';
      if (dir.includes('b')) el.style.height = Math.max(w.app.minH, Math.min(h0 + ev.clientY - sy, innerHeight - el.offsetTop - 4)) + 'px';
    };
    const up = () => { el.classList.remove('resizing'); h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up); };
    h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
  }));
}

function focusWin(w, silent) {
  if (w.minimized) return;
  if (focused !== w) {
    w.el.style.zIndex = ++zTop;
    wins.forEach(x => x.el.classList.toggle('active', x === w));
    focused = w;
    renderMenubar(); renderDock();
  }
}
function topWindow() {
  let best = null;
  wins.forEach(w => { if (!w.minimized && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w; });
  return best;
}
function closeWin(w) {
  if (!wins.has(w.id)) return;
  wins.delete(w.id);
  w.el.classList.add('closing');
  setTimeout(() => w.el.remove(), reduce ? 0 : 180);
  if (focused === w) { focused = null; const t = topWindow(); if (t) focusWin(t); }
  renderMenubar(); renderDock();
}
function minimizeWin(w) {
  if (w.minimized) return;
  const icon = dockEl(w.id);
  if (icon && !reduce) {
    const ir = icon.getBoundingClientRect(), wr = w.el.getBoundingClientRect();
    const dx = ir.left + ir.width / 2 - (wr.left + wr.width / 2), dy = ir.top + ir.height / 2 - (wr.top + wr.height / 2);
    w.el.style.transformOrigin = 'center center';
    w.el.classList.add('minimizing');
    requestAnimationFrame(() => { w.el.style.transform = `translate(${dx}px, ${dy}px) scale(.06)`; w.el.style.opacity = '0'; });
  }
  setTimeout(() => { w.el.style.visibility = 'hidden'; w.el.classList.remove('minimizing'); }, reduce ? 0 : 410);
  w.minimized = true; w.el.classList.remove('active');
  if (focused === w) { focused = null; const t = topWindow(); if (t) focusWin(t); }
  renderMenubar(); renderDock();
}
function restoreWin(w) {
  if (!w.minimized) { focusWin(w); return; }
  w.el.style.visibility = '';
  w.el.classList.add('minimizing');
  void w.el.offsetWidth;
  w.el.style.transform = ''; w.el.style.opacity = '';
  setTimeout(() => { w.el.classList.remove('minimizing'); w.el.style.transformOrigin = ''; }, reduce ? 0 : 410);
  w.minimized = false;
  focused = null; focusWin(w);
}
function zoomWin(w) {
  const el = w.el;
  if (mobileMQ.matches) return;
  el.classList.add('zooming'); setTimeout(() => el.classList.remove('zooming'), 320);
  if (w.maxed) {
    Object.assign(el.style, w.prev); w.maxed = false;
  } else {
    w.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
    el.style.left = '6px'; el.style.top = (MB + 4) + 'px';
    el.style.width = 'calc(100% - 12px)'; el.style.height = `calc(100% - ${MB + 4}px - 96px)`;
    w.maxed = true;
  }
}
function openApp(id, args) {
  if (!APPS[id]) return null;
  let w = wins.get(id);
  if (w) {
    if (w.minimized) restoreWin(w); else { focused = null; focusWin(w); }
    if (w.onArgs && args) w.onArgs(args);
    return w;
  }
  const d = dockEl(id);
  if (d && !reduce) { d.classList.add('bounce'); setTimeout(() => d.classList.remove('bounce'), 1150); }
  return createWindow(id, args);
}
addEventListener('resize', () => {
  wins.forEach(w => {
    if (w.maxed || mobileMQ.matches) return;
    const el = w.el;
    el.style.left = Math.max(8 - 0, Math.min(el.offsetLeft, innerWidth - 140)) + 'px';
    el.style.top = Math.max(MB, Math.min(el.offsetTop, innerHeight - 80)) + 'px';
  });
});

/* ============================================================
   Apps
   ============================================================ */
const BUILD = {};

/* ---- About ---- */
BUILD.about = (w) => {
  w.body.innerHTML = `
    <article class="about">
      <img class="about-photo" src="${esc(P.photo)}" alt="Portrait of ${esc(P.name)}" width="208" height="208">
      <div>
        <h2>${esc(P.name)}</h2>
        <p class="role">${esc(P.role)}</p>
        <p>${esc(P.bio)}</p>
        <div class="acts">
          <button class="btn btn-primary" type="button" data-go="projects">View projects</button>
          <button class="btn btn-plain" type="button" data-go="contact">Say hello</button>
          <button class="btn btn-plain" type="button" data-go="skills">See skills</button>
        </div>
        <dl>
          <dt>Role</dt><dd>${esc(P.role)}</dd>
          <dt>Focus</dt><dd>${esc(P.focus)}</dd>
          <dt>Languages</dt><dd>${SKILLS.languages.items.join(', ')}</dd>
          <dt>Builds with</dt><dd>${esc(P.buildsWith)}</dd>
          <dt>Projects</dt><dd>${PROJECTS.length} shown, with live sites, code and demo videos</dd>
          <dt>Status</dt><dd>${esc(P.status)}</dd>
        </dl>
      </div>
    </article>`;
  $$('[data-go]', w.body).forEach(b => b.addEventListener('click', () => openApp(b.dataset.go)));
};

/* ---- Projects ---- */
BUILD.projects = (w, args) => {
  const FILTERS = [['all', 'All projects'], ['mobile', 'Mobile'], ['fullstack', 'Full-stack'], ['web', 'Web'], ['backend', 'Backend and APIs'], ['salesforce', 'Salesforce']];
  const st = { filter: 'all', q: '', view: store.get('pview', 'grid'), sel: null, info: false };
  const visible = () => PROJECTS.filter(p =>
    (st.filter === 'all' || p.tags.includes(st.filter)) &&
    (!st.q || (p.title + ' ' + p.badges.join(' ') + ' ' + p.desc + ' ' + p.role).toLowerCase().includes(st.q.toLowerCase())));
  const count = f => PROJECTS.filter(p => f === 'all' || p.tags.includes(f)).length;

  w.tools.innerHTML = `
    <div class="seg" role="group" aria-label="View">
      <button type="button" data-view="grid" aria-label="Icon view" title="Icon view"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg></button>
      <button type="button" data-view="list" aria-label="List view" title="List view"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="2" y="3" width="12" height="2" rx="1"/><rect x="2" y="7" width="12" height="2" rx="1"/><rect x="2" y="11" width="12" height="2" rx="1"/></svg></button>
    </div>
    <label class="search">${G.search}<input type="search" placeholder="Search" aria-label="Search projects" autocomplete="off"></label>`;
  w.body.innerHTML = `
    <div class="finder">
      <aside class="f-side" aria-label="Project groups"></aside>
      <section class="f-main" aria-label="Projects"><div class="f-chips"></div><div class="f-content"></div></section>
      <aside class="f-info" aria-live="polite"></aside>
    </div>`;
  const finder = $('.finder', w.body), side = $('.f-side', w.body), main = $('.f-content', w.body), info = $('.f-info', w.body), chips = $('.f-chips', w.body);
  const input = $('input', w.tools);

  function renderSide() {
    side.innerHTML = '<h4>Groups</h4>' + FILTERS.map(([k, label]) =>
      `<button type="button" data-f="${k}" aria-current="${st.filter === k}">${SI[k === 'all' ? 'all' : k]}<span>${label}</span><span class="count">${count(k)}</span></button>`).join('');
    chips.innerHTML = FILTERS.map(([k, label]) => `<button type="button" data-f="${k}" aria-current="${st.filter === k}">${label}</button>`).join('');
  }
  function renderMain() {
    const list = visible();
    if (!list.length) { main.innerHTML = `<div class="f-empty">No projects match "${esc(st.q)}".</div>`; return; }
    if (st.view === 'grid') {
      main.innerHTML = '<div class="f-grid">' + list.map(p =>
        `<button class="f-item" type="button" data-id="${p.id}" aria-pressed="${st.sel === p.id}"><span class="f-thumb"><img src="${p.thumbSmall || p.thumb}" alt="" loading="lazy" decoding="async">${p.demo ? '<span class="vbadge" title="Has demo video"><svg viewBox="0 0 24 24" width="11" height="11"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>Demo</span>' : ''}</span><span class="f-name">${esc(p.name)}</span></button>`).join('') + '</div>';
    } else {
      main.innerHTML = '<div class="f-list"><div class="f-row head"><span>Name</span><span class="rr">Role</span><span>Status</span></div>' + list.map(p =>
        `<button class="f-row" type="button" data-id="${p.id}" aria-pressed="${st.sel === p.id}"><span class="rt"><img src="${p.thumbSmall || p.thumb}" alt="" loading="lazy" decoding="async"><span>${esc(p.name)}</span></span><span class="rr">${esc(p.role)}</span><span>${esc(p.status)}</span></button>`).join('') + '</div>';
    }
  }
  function renderInfo() {
    const p = PROJECTS.find(x => x.id === st.sel);
    if (!p) { info.innerHTML = '<div class="f-empty">Select a project to see details.</div>'; return; }
    const links = p.links.map(([l, h]) => `<a class="btn btn-plain" href="${h}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join('');
    info.innerHTML = `
      <button class="f-back" type="button">‹ Projects</button>
      <div class="prev${p.demo ? ' has-video' : ''}">${p.demo ? `<button class="prev-play" type="button" data-play="${p.demo}" aria-label="Play ${esc(p.name)} demo"><img src="${CLIPS.find(c => c.id === p.demo).poster}" alt=""><span class="pp"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span class="pl">Play demo</span></button>` : `<img src="${p.thumb}" alt="${esc(p.title)} preview" decoding="async">`}</div>
      <h2>${esc(p.title)}</h2>
      <dl><dt>Role</dt><dd>${esc(p.role)}</dd><dt>Status</dt><dd>${esc(p.status)}</dd></dl>
      <p>${esc(p.desc)}</p>
      <div class="pills">${p.badges.map(b => `<span class="pill">${esc(b)}</span>`).join('')}</div>
      <div class="acts">${p.demo ? `<button class="btn btn-primary" type="button" data-demo="${p.demo}">Open in Demos</button>` : ''}${links}</div>`;
    info.scrollTop = 0;
  }
  function select(id, showInfo) {
    st.sel = id; if (showInfo) st.info = true;
    finder.classList.toggle('show-info', st.info);
    renderMain(); renderInfo();
  }
  function ensureSelection() {
    const list = visible();
    if (!list.find(p => p.id === st.sel)) st.sel = mobileMQ.matches ? null : (list[0] ? list[0].id : null);
  }
  function setView(v) {
    st.view = v; store.set('pview', v);
    $$('[data-view]', w.tools).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    renderMain();
  }
  function refresh() { ensureSelection(); renderSide(); renderMain(); renderInfo(); }

  w.tools.addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
  input.addEventListener('input', () => { st.q = input.value.trim(); refresh(); });
  const onFilter = e => { const b = e.target.closest('[data-f]'); if (!b) return; st.filter = b.dataset.f; refresh(); };
  side.addEventListener('click', onFilter); chips.addEventListener('click', onFilter);
  main.addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (b) select(b.dataset.id, true); });
  main.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const ids = visible().map(p => p.id); let i = ids.indexOf(st.sel);
    i = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? Math.min(ids.length - 1, i + 1) : Math.max(0, i - 1);
    e.preventDefault(); select(ids[i], false);
    const t = $(`[data-id="${ids[i]}"]`, main); if (t) t.focus();
  });
  info.addEventListener('click', e => {
    if (e.target.closest('.f-back')) { st.info = false; finder.classList.remove('show-info'); return; }
    const pl = e.target.closest('[data-play]');
    if (pl) {
      const c = CLIPS.find(x => x.id === pl.dataset.play), box = pl.parentElement;
      box.innerHTML = `<video controls autoplay playsinline poster="${c.poster}" src="${c.file}"></video>`;
      const v = $('video', box); v.play().catch(() => {}); return;
    }
    const d = e.target.closest('[data-demo]'); if (d) openApp('demos', { clip: d.dataset.demo });
  });

  w.onArgs = a => {
    if (a.select) { st.filter = 'all'; st.q = ''; input.value = ''; renderSide(); select(a.select, true); const t = $(`[data-id="${a.select}"]`, main); if (t) t.scrollIntoView({ block: 'nearest' }); if (a.play) { const pb = $('[data-play]', info); if (pb) pb.click(); } }
  };
  setView(st.view); refresh();
  if (args.select) w.onArgs(args);
};

/* ---- Skills (browser window showing every skill) ---- */
BUILD.skills = (w, args) => {
  const ORDER = [['languages', 6], ['frameworks', 6], ['databases', 6], ['backend', 6], ['salesforce', 12], ['professional', 4], ['pm', 4], ['tooling', 4]];
  const chip = c => `<span class="sk-chip">${c.icon ? `<img class="sk-ico${c.mono ? ' mono' : ''}" src="assets/icons/${esc(c.icon)}.svg" alt="" width="18" height="18">` : '<i></i>'}${esc(c.name)}</span>`;
  const card = ([k, span]) => {
    const s = SKILLS[k]; if (!s) return '';
    return `<article class="sk-card span-${span}" id="sk-${k}"><h2>${esc(s.title)}</h2>` +
      (s.sub ? `<p class="sk-sub">${esc(s.sub)}</p>` : '') +
      (s.chips.length ? `<div class="sk-chips">${s.chips.map(chip).join('')}</div>` : '') +
      (s.notes ? `<ul>${s.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : '') + '</article>';
  };
  w.tools.innerHTML = '';
  w.body.innerHTML = `
    <div class="browser">
      <div class="br-bar">
        <div class="br-nav"><button type="button" disabled aria-label="Back">‹</button><button type="button" disabled aria-label="Forward">›</button></div>
        <div class="br-url"><svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="currentColor"/><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>josephmtaku.dev/skills</span></div>
        <button class="br-open" type="button" data-go="terminal" title="Open Terminal">${'>_'}</button>
      </div>
      <div class="br-page">
        <header class="br-head"><h1>Skills</h1><p>Here is a breakdown of my technical and non technical skills.</p></header>
        <section class="sk-grid">${ORDER.map(card).join('')}</section>
        <footer class="br-foot">© 2025 Joseph Mtaku</footer>
      </div>
    </div>`;
  $('[data-go]', w.body).addEventListener('click', () => openApp('terminal'));
  const page = $('.br-page', w.body);
  const focusSkill = k => { const c = $('#sk-' + k, w.body); if (!c) return; page.scrollTo({ top: c.offsetTop - 12, behavior: reduce ? 'auto' : 'smooth' }); c.classList.add('hl'); setTimeout(() => c.classList.remove('hl'), 1600); };
  w.onArgs = a => { if (a.focus) focusSkill(a.focus); };
  if (args.focus) setTimeout(() => focusSkill(args.focus), 350);
};

/* ---- Terminal ---- */
BUILD.terminal = (w, args) => {
  w.body.innerHTML = `
    <div class="term" aria-label="Terminal">
      <div class="out" aria-live="polite"></div>
      <div class="term-row"><span class="pr"><b>joseph</b>@portfolio <i>~</i> %</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type a command"></div>
    </div>`;
  const term = $('.term', w.body), out = $('.out', w.body), input = $('input', w.body);
  const history = []; let hi = 0, busy = false;
  const PROMPT = '<span class="pr"><b>joseph</b>@portfolio <i>~</i> %</span> ';

  const line = (html = '') => { const d = document.createElement('div'); d.className = 'ln'; d.innerHTML = html; out.appendChild(d); term.scrollTop = term.scrollHeight; return d; };
  const tags = items => items.map(i => `<span class="tag">${esc(i)}</span>`).join('');

  function printSkill(key) {
    const s = SKILLS[key];
    line(`<span class="t-acc t-b">${esc(s.title)}</span>`);
    if (s.items) line(tags(s.items));
    if (s.notes) s.notes.forEach(n => line(`<span class="t-dim">  -</span> ${esc(n)}`));
    line();
  }
  const COMMANDS = {
    help() {
      line('<span class="t-b">Commands</span>');
      [['skills [group]', 'List skills, or one group'], ['projects', 'List projects'], ['open <name>', 'Open a project or an app'], ['whoami', 'A short introduction'],
       ['contact', 'How to reach me'], ['neofetch', 'System summary'], ['theme <mode>', 'light, dark or auto'], ['clear', 'Clear the screen']]
        .forEach(([c, d]) => line(`  <span class="t-acc">${esc(c.padEnd(16))}</span><span class="t-dim">${esc(d)}</span>`));
      line('');
      line(`<span class="t-dim">Groups: ${Object.keys(SKILLS).join(', ')}</span>`);
      line(`<span class="t-dim">Apps: ${Object.keys(APPS).join(', ')}</span>`);
      line('');
    },
    skills(arg) {
      if (arg) {
        const key = Object.keys(SKILLS).find(k => k === arg || SKILLS[k].title.toLowerCase().startsWith(arg));
        if (!key) { line(`<span class="t-warn">No group called "${esc(arg)}".</span> Try: ${Object.keys(SKILLS).join(', ')}`); return; }
        printSkill(key); return;
      }
      Object.keys(SKILLS).forEach(printSkill);
    },
    projects() {
      PROJECTS.forEach((p, i) => line(`  <span class="t-dim">${String(i + 1).padStart(2, ' ')}</span>  <span class="t-b">${esc(p.name)}</span> <span class="t-dim">${esc(p.role)}, ${esc(p.status.toLowerCase())}</span>`));
      line('<span class="t-dim">Type "open <name>" to see one in Projects.</span>'); line();
    },
    open(arg) {
      if (!arg) { line('<span class="t-warn">Usage:</span> open &lt;project or app&gt;'); return; }
      if (APPS[arg]) { openApp(arg); line(`<span class="t-ok">Opening ${esc(APPS[arg].name)}</span>`); return; }
      const n = parseInt(arg, 10);
      const p = (!isNaN(n) && PROJECTS[n - 1]) || PROJECTS.find(x => (x.name + ' ' + x.id).toLowerCase().includes(arg));
      if (!p) { line(`<span class="t-warn">Nothing called "${esc(arg)}".</span> Try "projects" or "help".`); return; }
      openApp('projects', { select: p.id }); line(`<span class="t-ok">Opening ${esc(p.name)}</span>`);
    },
    whoami() { line(esc(P.name) + ', ' + esc(P.role) + '.'); line('<span class="t-dim">' + esc(P.status) + '.</span>'); line(); },
    contact() {
      line(`  <span class="t-dim">email </span> <a class="t-acc" href="mailto:${EMAIL}">${EMAIL}</a>`);
      line(`  <span class="t-dim">phone </span> ${PHONE}`);
      line(`  <span class="t-dim">github</span> <a class="t-acc" href="${GITHUB}" target="_blank" rel="noopener noreferrer">${P.githubLabel}</a>`); line();
    },
    neofetch() {
      const art = ['      ██╗   ', '      ██║   ', '      ██║   ', ' ██   ██║   ', ' ╚█████╔╝   ', '  ╚════╝    '];
      const rows = [
        '<span class="t-acc t-b">joseph</span>@<span class="t-acc t-b">portfolio</span>', '<span class="t-dim">----------------</span>',
        `<span class="t-acc">Role     </span> ${P.role}`, `<span class="t-acc">Languages</span> ${SKILLS.languages.items.join(', ')}`,
        `<span class="t-acc">Builds on</span> ${P.buildsWith}`, `<span class="t-acc">Projects </span> ${PROJECTS.length}`, `<span class="t-acc">Status   </span> <span class="t-ok">Open to roles and collaborations</span>`];
      rows.forEach((r, i) => line(`<span class="t-acc">${art[i] || '            '}</span> ${r}`)); line();
    },
    theme(arg) {
      if (!['light', 'dark', 'auto'].includes(arg)) { line('<span class="t-warn">Usage:</span> theme light | dark | auto'); return; }
      setTheme(arg); line(`<span class="t-ok">Appearance set to ${arg}</span>`);
    },
    clear() { out.innerHTML = ''; },
    sudo() { line('<span class="t-warn">joseph is not in the sudoers file.</span> Try "contact" instead.'); },
  };
  COMMANDS.ls = COMMANDS.projects; COMMANDS.about = () => { openApp('about'); line('<span class="t-ok">Opening About</span>'); };

  function run(text) {
    line(PROMPT + esc(text));
    const t = text.trim(); if (!t) return;
    history.push(t); hi = history.length;
    const [cmd, ...rest] = t.split(/\s+/); const arg = rest.join(' ').toLowerCase();
    const fn = COMMANDS[cmd.toLowerCase()];
    if (fn) fn(arg); else line(`<span class="t-warn">zsh: command not found: ${esc(cmd)}</span> <span class="t-dim">(type "help")</span>`);
    term.scrollTop = term.scrollHeight;
  }
  async function typeAndRun(cmd) {
    busy = true; input.value = '';
    for (const ch of cmd) { input.value += ch; if (!reduce) await wait(34 + Math.random() * 40); }
    await wait(reduce ? 0 : 160); input.value = ''; run(cmd); busy = false;
  }

  input.addEventListener('keydown', e => {
    if (busy) { e.preventDefault(); return; }
    if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = history[hi]; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < history.length - 1) { hi++; input.value = history[hi]; } else { hi = history.length; input.value = ''; } }
    else if (e.key === 'Tab') {
      e.preventDefault(); const v = input.value.toLowerCase(); if (!v || v.includes(' ')) return;
      const m = Object.keys(COMMANDS).filter(c => c.startsWith(v)); if (m.length === 1) input.value = m[0] + ' ';
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); out.innerHTML = ''; }
  });
  term.addEventListener('click', () => { if (!String(getSelection())) input.focus(); });

  w.onArgs = a => { if (a.run && !busy) typeAndRun(a.run); };
  line('<span class="t-dim">joseph-portfolio 1.0  Type "help" for commands.</span>'); line();
  typeAndRun(args.run || 'neofetch').then(() => input.focus());
};

/* ---- Demos ---- */
BUILD.demos = (w, args) => {
  w.body.innerHTML = `
    <div class="player">
      <div class="p-stage"><video controls playsinline preload="none"></video></div>
      <aside class="p-list"><h4>Demo videos</h4>${CLIPS.map(c =>
        `<button class="p-clip" type="button" data-clip="${c.id}"><img src="${c.poster}" alt="" loading="lazy"><span>${esc(c.title)}<br><small>${esc(c.sub)}</small></span></button>`).join('')}</aside>
    </div>`;
  const video = $('video', w.body);
  function choose(id, play) {
    const c = CLIPS.find(x => x.id === id) || CLIPS[0];
    video.pause(); video.poster = c.poster; video.src = c.file; video.load();
    $$('.p-clip', w.body).forEach(b => b.setAttribute('aria-current', String(b.dataset.clip === c.id)));
    w.setTitle(c.title + ' demo');
    if (play) video.play().catch(() => {});
  }
  $('.p-list', w.body).addEventListener('click', e => { const b = e.target.closest('[data-clip]'); if (b) choose(b.dataset.clip, true); });
  w.onArgs = a => { if (a.clip) choose(a.clip, true); };
  choose(args.clip, !!args.clip);
};

/* ---- Contact ---- */
BUILD.contact = (w) => {
  w.tools.innerHTML = '<button class="btn btn-primary" type="button" id="mSend">Send</button>';
  w.body.innerHTML = `
    <div class="mail">
      <form class="m-compose" autocomplete="off">
        <div class="m-row"><label>To</label><span class="fixed">${esc(P.name)} &lt;${EMAIL}&gt;</span></div>
        <div class="m-row"><label for="mSub">Subject</label><input id="mSub" type="text" value="Hello Joseph" placeholder="Subject"></div>
        <textarea class="m-body" id="mBody" placeholder="Tell me about the role or project, and the best way to reach you." aria-label="Message"></textarea>
      </form>
      <aside class="m-side">
        <div><h3>Let's talk</h3><p>I'm open to roles, collaborations, and interesting projects. Write a message here and it opens in your mail app, or use the details below.</p></div>
        <div class="m-card"><small>Email</small><div class="row"><span class="v">${EMAIL}</span><button type="button" data-copy="${EMAIL}" data-msg="Email copied">Copy</button></div></div>
        <div class="m-card"><small>Phone</small><div class="row"><a class="v" href="tel:${P.phoneLink}" style="text-decoration:none">${PHONE}</a><button type="button" data-copy="${PHONE}" data-msg="Phone number copied">Copy</button></div></div>
        <div class="m-card"><small>GitHub</small><div class="row"><span class="v">${esc(P.githubLabel)}</span><a class="cp" href="${GITHUB}" target="_blank" rel="noopener noreferrer">Open</a></div></div>
      </aside>
    </div>`;
  const send = () => {
    const s = $('#mSub', w.body).value, b = $('#mBody', w.body).value;
    toast('Opening your mail app');
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`;
  };
  $('#mSend', w.tools).addEventListener('click', send);
  $$('[data-copy]', w.body).forEach(b => b.addEventListener('click', () => copyText(b.dataset.copy, b.dataset.msg)));
  setTimeout(() => { const t = $('#mBody', w.body); if (t && !mobileMQ.matches) t.focus(); }, 280);
};

/* ---- Settings ---- */
BUILD.settings = (w) => {
  const draw = () => {
    w.body.innerHTML = `
      <div class="settings">
        <section><h3>Appearance</h3>
          <div class="opt-row" role="radiogroup" aria-label="Appearance">${[['light', 'Light'], ['dark', 'Dark'], ['auto', 'Auto']].map(([k, l]) =>
            `<button class="opt" type="button" role="radio" aria-checked="${themePref === k}" data-theme-opt="${k}"><span class="sw sw-${k}"></span><span>${l}</span></button>`).join('')}</div>
        </section>
        <section><h3>Wallpaper</h3>
          <div class="opt-row" role="radiogroup" aria-label="Wallpaper">${WALLS.map(([k, l]) =>
            `<button class="opt" type="button" role="radio" aria-checked="${root.dataset.wall === k}" data-wall-opt="${k}"><span class="sw sw-wall" style="background:radial-gradient(60% 80% at 15% 90%,var(--p1),transparent 65%),radial-gradient(55% 70% at 85% 10%,var(--p2),transparent 65%),var(--p0)" data-p="${k}"></span><span>${l}</span></button>`).join('')}</div>
        </section>
        <section><h3>Accent colour</h3>
          <div class="dots" role="radiogroup" aria-label="Accent colour">${ACCENTS.map(([l, c]) =>
            `<button class="dot-opt" type="button" role="radio" aria-label="${l}" aria-checked="${getComputedStyle(root).getPropertyValue('--accent').trim().toLowerCase() === c.toLowerCase()}" data-accent="${c}" style="background:${c}"></button>`).join('')}</div>
        </section>
      </div>`;
    // wallpaper previews use the current appearance's palette
    const pal = { dusk: ['#0a8fd6', '#6b4eff', '#080d24'], meadow: ['#1f9d6b', '#0fa3b1', '#06190f'], ember: ['#e0457b', '#ff8a3d', '#1a0a12'] };
    const palL = { dusk: ['#7cc7ff', '#c4b5ff', '#dfeaff'], meadow: ['#9ee0b9', '#9fdce6', '#e6f6ea'], ember: ['#ffb3c8', '#ffd1a1', '#fff0ea'] };
    $$('[data-p]', w.body).forEach(s => { const p = (root.dataset.theme === 'dark' ? pal : palL)[s.dataset.p]; s.style.setProperty('--p1', p[0]); s.style.setProperty('--p2', p[1]); s.style.setProperty('--p0', p[2]); });
  };
  w.body.addEventListener('click', e => {
    const t = e.target.closest('[data-theme-opt]'), a = e.target.closest('[data-accent]'), k = e.target.closest('[data-wall-opt]');
    if (t) setTheme(t.dataset.themeOpt); if (a) setAccent(a.dataset.accent); if (k) setWall(k.dataset.wallOpt);
  });
  const redraw = () => { if (wins.get('settings') === w) draw(); };
  document.addEventListener('look', redraw);
  draw();
};

/* ============================================================
   Menus (menu bar + right-click)
   ============================================================ */
const layer = () => $('#menu-layer');
let openBtn = null;
function closeMenus() { layer().innerHTML = ''; if (openBtn) { openBtn.setAttribute('aria-expanded', 'false'); openBtn = null; } }
function showMenu(items, x, y, btn) {
  closeMenus();
  const m = document.createElement('div'); m.className = 'menu'; m.setAttribute('role', 'menu');
  items.forEach(it => {
    if (it.sep) { m.appendChild(document.createElement('hr')); return; }
    if (it.heading) { const h = document.createElement('div'); h.className = 'm-label'; h.textContent = it.heading; m.appendChild(h); return; }
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem');
    b.innerHTML = `<span><span class="check">${it.check ? '✓' : ''}</span>${esc(it.label)}</span><span class="kbd">${it.kbd || ''}</span>`;
    if (it.disabled) b.disabled = true;
    b.addEventListener('click', () => { closeMenus(); it.run && it.run(); });
    m.appendChild(b);
  });
  layer().appendChild(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.max(6, Math.min(x, innerWidth - r.width - 6)) + 'px';
  m.style.top = Math.max(MB, Math.min(y, innerHeight - r.height - 6)) + 'px';
  if (btn) { btn.setAttribute('aria-expanded', 'true'); openBtn = btn; }
}
document.addEventListener('pointerdown', e => { if (!e.target.closest('.menu') && !e.target.closest('.mb-item')) closeMenus(); });

function menuDefs() {
  const f = focused;
  const appName = f ? f.app.name : 'Desktop';
  return {
    J: [
      { label: 'About Joseph', run: () => openApp('about') },
      { sep: 1 },
      { label: 'Settings…', run: () => openApp('settings') },
      { label: 'Classic portfolio', run: () => { location.href = 'HomePage.html'; } },
      { sep: 1 },
      { label: 'Lock screen', run: lockScreen },
      { label: 'Restart…', run: () => { session.clear(); location.reload(); } },
    ],
    app: f ? [
      { label: `About ${appName}`, run: () => openApp('about') },
      { sep: 1 },
      { label: `Hide ${appName}`, run: () => minimizeWin(f) },
      { label: `Quit ${appName}`, run: () => closeWin(f) },
    ] : [
      { label: 'About Joseph', run: () => openApp('about') },
      { label: 'Settings…', run: () => openApp('settings') },
    ],
    File: [
      { label: 'New message…', run: () => openApp('contact') },
      { label: 'Open projects', run: () => openApp('projects') },
      { sep: 1 },
      { label: 'Close window', disabled: !f, run: () => f && closeWin(f) },
    ],
    Edit: [
      { label: 'Copy', kbd: MOD + 'C', run: () => document.execCommand('copy') },
      { label: 'Select all', kbd: MOD + 'A', run: () => document.execCommand('selectAll') },
    ],
    View: [
      { heading: 'Appearance' },
      { label: 'Light', check: themePref === 'light', run: () => setTheme('light') },
      { label: 'Dark', check: themePref === 'dark', run: () => setTheme('dark') },
      { label: 'Auto', check: themePref === 'auto', run: () => setTheme('auto') },
      { sep: 1 },
      { label: 'Zoom window', disabled: !f, run: () => f && zoomWin(f) },
    ],
    Window: [
      { label: 'Minimise', disabled: !f, run: () => f && minimizeWin(f) },
      { label: 'Zoom', disabled: !f, run: () => f && zoomWin(f) },
      { sep: 1 },
      ...(wins.size ? Array.from(wins.values()).map(w => ({ label: w.app.title, check: w === f, run: () => restoreWin(w) })) : [{ label: 'No open windows', disabled: true }]),
    ],
    Help: [
      { label: 'Search…', kbd: MOD + 'K', run: openSpotlight },
      { label: 'Email Joseph', run: () => { location.href = 'mailto:' + EMAIL; } },
      { label: 'GitHub profile', run: () => window.open(GITHUB, '_blank', 'noopener') },
    ],
  };
}
function renderMenubar() {
  const host = $('#mbLeft'); if (!host) return;
  closeMenus();
  const defs = menuDefs(), appName = focused ? focused.app.name : 'Desktop';
  host.innerHTML = '';
  const add = (label, key, cls, html) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mb-item ' + (cls || ''); b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = html || esc(label); b.dataset.menu = key;
    const open = () => { const r = b.getBoundingClientRect(); showMenu(menuDefs()[key], r.left, r.bottom + 2, b); };
    b.addEventListener('click', () => { if (openBtn === b) closeMenus(); else open(); });
    b.addEventListener('pointerenter', () => { if (openBtn && openBtn !== b) open(); });
    host.appendChild(b);
  };
  add('', 'J', 'keep', '<span class="mb-mark" aria-hidden="true">J</span><span class="sr" style="position:absolute;left:-9999px">Joseph menu</span>');
  add(appName, 'app', 'app keep');
  ['File', 'Edit', 'View', 'Window', 'Help'].forEach(n => add(n, n));
}

/* ============================================================
   Dock
   ============================================================ */
const dockEl = id => $(`.dock-item[data-app="${id}"]`);
function renderDock() {
  const dock = $('#dock'); if (!dock) return;
  if (!dock.children.length) {
    dock.innerHTML = DOCK.map(id => {
      if (id === '|') return '<div class="dock-sep" role="separator"></div>';
      if (id === 'trash') return `<button class="dock-item" type="button" data-app="trash" aria-label="Trash"><span class="dock-tip">Trash</span><span class="dock-tile" style="background:linear-gradient(160deg,rgba(255,255,255,.4),rgba(255,255,255,.14))">${G.trash}</span></button>`;
      const a = APPS[id];
      return `<button class="dock-item" type="button" data-app="${id}" aria-label="${a.name}"><span class="dock-tip">${a.name}</span><span class="dock-tile" style="background:${a.tile}">${a.glyph}</span><span class="dock-dot"></span></button>`;
    }).join('');
    dock.addEventListener('click', e => {
      const b = e.target.closest('.dock-item'); if (!b) return;
      const id = b.dataset.app;
      if (id === 'trash') { b.classList.add('bounce'); setTimeout(() => b.classList.remove('bounce'), 700); toast('The Trash is empty. Every project made it in.'); return; }
      openApp(id);
    });
    // magnification
    const items = () => $$('.dock-item', dock);
    dock.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || reduce || mobileMQ.matches) return;
      dock.classList.remove('calm');
      items().forEach(it => {
        const r = it.getBoundingClientRect(), c = r.left + r.width / 2, d = Math.abs(e.clientX - c);
        const bump = 0.5 * (1 + Math.cos(Math.min(1, d / 140) * Math.PI));
        it.style.setProperty('--w', (54 * (1 + 0.62 * bump)).toFixed(1) + 'px');
      });
    });
    dock.addEventListener('pointerleave', () => { dock.classList.add('calm'); items().forEach(it => it.style.removeProperty('--w')); });
  }
  $$('.dock-item', dock).forEach(it => {
    const w = wins.get(it.dataset.app);
    it.classList.toggle('running', !!w);
    it.classList.toggle('hidden-win', !!(w && w.minimized));
  });
}

/* ============================================================
   Desktop files + right-click
   ============================================================ */
function renderDesktopIcons() {
  const host = $('#desk-icons');
  const files = [
    { name: 'Projects', art: G.folderBig, run: () => openApp('projects') },
    { name: 'About Joseph', art: G.doc, run: () => openApp('about') },
    { name: 'FloodBuddy demo', art: `<span class="di-film"><img src="assets/floodbuddy-poster.jpg" alt=""></span>`, run: () => openApp('projects', { select: 'floodbuddy', play: true }) },
    { name: 'GrabIT demo', art: `<span class="di-film"><img src="assets/grabit-poster.jpg" alt=""></span>`, run: () => openApp('projects', { select: 'grabit', play: true }) },
  ];
  host.innerHTML = '';
  files.forEach(f => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'desk-icon';
    b.innerHTML = `<span class="di-art">${f.art}</span><span class="di-name">${esc(f.name)}</span>`;
    let touch = false;
    b.addEventListener('pointerdown', e => { touch = e.pointerType === 'touch'; });
    b.addEventListener('click', e => {
      if (e.detail >= 2 || e.detail === 0 || touch) { f.run(); return; }
      $$('.desk-icon', host).forEach(x => x.classList.remove('sel')); b.classList.add('sel');
    });
    host.appendChild(b);
  });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.desk-icon')) $$('.desk-icon', host).forEach(x => x.classList.remove('sel')); });
}
function wireContextMenu() {
  $('#desktop').addEventListener('contextmenu', e => {
    if (e.target.closest('.win, #dock-wrap, #menubar')) return;
    e.preventDefault();
    showMenu([
      { label: 'Open projects', run: () => openApp('projects') },
      { label: 'About Joseph', run: () => openApp('about') },
      { sep: 1 },
      { label: 'Change wallpaper…', run: () => openApp('settings') },
      { label: resolvedTheme() === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance', run: () => setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark') },
      { sep: 1 },
      { label: 'Search…', kbd: MOD + 'K', run: openSpotlight },
    ], e.clientX, e.clientY);
  });
}

/* ============================================================
   Spotlight
   ============================================================ */
let spIndex = [], spShown = [], spSel = 0, spReturn = null;
function buildIndex() {
  const idx = [];
  Object.keys(APPS).forEach(id => idx.push({ group: 'Apps', title: APPS[id].name, sub: APPS[id].title, kw: id, icon: `<span style="display:grid;place-items:center;width:100%;height:100%;background:${APPS[id].tile}">${APPS[id].glyph}</span>`, run: () => openApp(id) }));
  PROJECTS.forEach(p => idx.push({ group: 'Projects', title: p.name, sub: p.role + ', ' + p.status.toLowerCase(), kw: p.title + ' ' + p.badges.join(' ') + ' ' + p.tags.join(' '), icon: `<img src="${p.thumbSmall || p.thumb}" alt="">`, run: () => openApp('projects', { select: p.id }) }));
  Object.keys(SKILLS).forEach(k => (SKILLS[k].items || []).forEach(item => idx.push({ group: 'Skills', title: item, sub: SKILLS[k].title, kw: k, icon: G.term.replace('var(--accent)', '#00AEFF'), run: () => openApp('skills', { focus: k }) })));
  idx.push({ group: 'Contact', title: 'Email Joseph', sub: EMAIL, kw: 'mail hire message contact', icon: G.mail.replace('#fff', '#08907c').replace('#08907c" stroke', '#fff" stroke'), run: () => openApp('contact') });
  idx.push({ group: 'Contact', title: 'Copy phone number', sub: PHONE, kw: 'call phone mobile number', icon: G.mail, run: () => copyText(PHONE, 'Phone number copied') });
  idx.push({ group: 'Contact', title: 'GitHub profile', sub: P.githubLabel, kw: 'code repositories git', icon: G.folder, run: () => window.open(GITHUB, '_blank', 'noopener') });
  return idx;
}
function score(item, q) {
  const t = item.title.toLowerCase(), k = (item.kw || '').toLowerCase(), s = (item.sub || '').toLowerCase();
  if (t.startsWith(q)) return 4;
  if (t.split(/[\s\-/]+/).some(x => x.startsWith(q))) return 3;
  if (t.includes(q)) return 2;
  if (k.includes(q) || s.includes(q)) return 1;
  return 0;
}
function renderSpotlight() {
  const q = $('#spInput').value.trim().toLowerCase(), res = $('#spResults');
  let list;
  if (!q) list = ['projects', 'about', 'contact'].map(id => spIndex.find(i => i.group === 'Apps' && i.kw === id)).concat(spIndex.filter(i => i.group === 'Projects').slice(-2).reverse());
  else list = spIndex.map(i => ({ i, s: score(i, q) })).filter(x => x.s).sort((a, b) => b.s - a.s).slice(0, 9).map(x => x.i);
  spShown = list; spSel = Math.min(spSel, Math.max(0, list.length - 1));
  if (!list.length) { res.innerHTML = `<li class="sp-none">No results for "${esc(q)}".</li>`; return; }
  let html = '', last = '';
  list.forEach((it, n) => {
    if (it.group !== last) { html += `<li class="sp-group" role="presentation">${q ? it.group : (n < 3 ? 'Suggested' : 'Recent projects')}</li>`; last = it.group; if (!q && n === 3) last = 'x'; }
    html += `<li class="sp-item" role="option" data-n="${n}" aria-selected="${n === spSel}"><span class="sp-ico">${it.icon}</span><span class="sp-t">${esc(it.title)}<small>${esc(it.sub || '')}</small></span><span class="sp-k">${it.group === 'Apps' ? 'Open' : ''}</span></li>`;
  });
  res.innerHTML = html;
}
function openSpotlight() {
  closeMenus();
  if (!spIndex.length) spIndex = buildIndex();
  spReturn = document.activeElement;
  $('#spotlight').hidden = false; const i = $('#spInput'); i.value = ''; spSel = 0; renderSpotlight(); i.focus();
}
function closeSpotlight() { $('#spotlight').hidden = true; if (spReturn && spReturn.focus) try { spReturn.focus(); } catch (e) {} }
function runSpotlight(n) { const it = spShown[n]; if (!it) return; closeSpotlight(); it.run(); }
function wireSpotlight() {
  const input = $('#spInput'), res = $('#spResults');
  input.addEventListener('input', () => { spSel = 0; renderSpotlight(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); spSel = Math.min(spShown.length - 1, spSel + 1); renderSpotlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); spSel = Math.max(0, spSel - 1); renderSpotlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); runSpotlight(spSel); }
  });
  res.addEventListener('click', e => { const li = e.target.closest('.sp-item'); if (li) runSpotlight(+li.dataset.n); });
  res.addEventListener('pointermove', e => { const li = e.target.closest('.sp-item'); if (li && +li.dataset.n !== spSel) { spSel = +li.dataset.n; $$('.sp-item', res).forEach(x => x.setAttribute('aria-selected', String(+x.dataset.n === spSel))); } });
  $('#spotlight').addEventListener('pointerdown', e => { if (e.target.id === 'spotlight') closeSpotlight(); });
  $('#mbSearch').addEventListener('click', openSpotlight);
}

/* ============================================================
   Clock
   ============================================================ */
function tick() {
  const d = new Date();
  const mb = $('#mbClock');
  if (mb) mb.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(d) + '  ' + new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d);
  const lc = $('#loginClock'), ld = $('#loginDate');
  if (lc) lc.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
  if (ld) ld.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
}

/* ============================================================
   Start-up, lock screen, entering the desktop
   ============================================================ */
let unlocking = false, desktopReady = false;
function enterDesktop(quiet) {
  const desk = $('#desktop');
  desk.hidden = false;
  if (!quiet && !reduce) { desk.classList.add('entering'); setTimeout(() => desk.classList.remove('entering'), 1300); }
  if (!desktopReady) {
    desktopReady = true;
    $('#mbTheme').addEventListener('click', () => setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark'));
    renderMenubar(); renderDock(); renderDesktopIcons(); wireContextMenu(); wireSpotlight(); applyTheme();
  }
  const target = (location.hash || '').replace('#', '').toLowerCase();
  const first = APPS[target] ? target : 'about';
  setTimeout(() => { openApp(first); if (first === 'about' && !mobileMQ.matches) setTimeout(() => { if (!wins.has('projects') && wins.size === 1) { /* keep the first screen calm */ } }, 0); }, quiet || reduce ? 0 : 420);
  setTimeout(showNotification, quiet ? 6000 : 7500);
}
async function unlock() {
  if (unlocking) return; unlocking = true;
  const btn = $('#loginBtn'), dots = $('#loginDots'), login = $('#login');
  btn.classList.add('typing');
  if (!reduce) { for (let i = 1; i <= 8; i++) { dots.textContent = '•'.repeat(i); await wait(42); } await wait(120); }
  session.set('unlocked', '1');
  login.classList.add('leaving');
  enterDesktop(false);
  setTimeout(() => { login.hidden = true; unlocking = false; }, reduce ? 0 : 600);
}
function lockScreen() {
  const login = $('#login'), btn = $('#loginBtn');
  closeMenus(); btn.classList.remove('typing'); $('#loginDots').textContent = '';
  login.hidden = false; void login.offsetWidth; login.classList.remove('leaving'); unlocking = false; btn.focus();
}

function start() {
  const av = $('.login-avatar'), ln = $('.login-name'), lr = $('.login-role');
  if (av && P.photo) av.src = P.photo; if (ln && P.name) ln.textContent = P.name; if (lr && P.role) lr.textContent = P.role;
  tick(); setInterval(tick, 10000);
  const boot = $('#boot'), login = $('#login');
  $('#loginBtn').addEventListener('click', unlock);
  const skip = session.get('unlocked') === '1' || /[?&]skip\b/.test(location.search);
  if (skip) { boot.remove(); login.hidden = true; applyTheme(); enterDesktop(true); return; }
  applyTheme();
  const toLogin = () => { if (!boot.classList.contains('gone')) { boot.classList.add('gone'); login.hidden = false; $('#loginBtn').focus({ preventScroll: true }); } };
  boot.addEventListener('pointerdown', toLogin);
  setTimeout(toLogin, reduce ? 150 : 1750);
}

/* ---------- global keys ---------- */
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!$('#desktop').hidden) ($('#spotlight').hidden ? openSpotlight() : closeSpotlight()); }
  else if (e.key === 'Escape') { if (!$('#spotlight').hidden) closeSpotlight(); closeMenus(); }
});

start();
})();
