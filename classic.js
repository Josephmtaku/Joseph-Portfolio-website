/* classic.js — builds the classic pages from content.js. You normally don't need to edit this. */
(function () {
  'use strict';
  var S = window.SITE;
  if (!S) { console.error('content.js did not load'); return; }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var get = function (path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, S); };

  /* simple bindings: data-bind="profile.bio" fills text, data-href / data-src fill attributes */
  document.querySelectorAll('[data-bind]').forEach(function (el) { var v = get(el.getAttribute('data-bind')); if (v != null) el.textContent = v; });
  document.querySelectorAll('[data-href]').forEach(function (el) { var v = get(el.getAttribute('data-href')); if (v != null) el.setAttribute('href', (el.getAttribute('data-prefix') || '') + v); });
  document.querySelectorAll('[data-src]').forEach(function (el) { var v = get(el.getAttribute('data-src')); if (v != null) el.setAttribute('src', v); });

  var badges = function (b) { return '<div class="badge-row">' + b.map(function (x) { return '<span class="badge">' + esc(x) + '</span>'; }).join('') + '</div>'; };
  var meta = function (p) { return '<div class="meta-row"><span>Role: ' + esc(p.role) + '</span><span>Status: ' + esc(p.status) + '</span></div>'; };
  var actions = function (links) {
    if (!links || !links.length) return '';
    var n = 0;
    return '<div class="actions">' + links.map(function (l) {
      var cls = l.primary ? 'btn-primary' : (n++ === 0 ? 'btn-secondary' : 'btn-ghost');
      return '<a class="btn ' + cls + '" href="' + esc(l.href) + '" target="_blank" rel="noreferrer">' + esc(l.label) + '</a>';
    }).join('') + '</div>';
  };

  /* ---------- Projects page ---------- */
  var featRoot = $('#featured-root'), gridRoot = $('#projectsGrid'), filters = $('#filters');
  if (featRoot && gridRoot) {
    var feat = S.projects.filter(function (p) { return p.video; });
    var rest = S.projects.filter(function (p) { return !p.video; });
    featRoot.innerHTML = feat.map(function (p) {
      return '<section class="feature" data-tags="' + esc(p.tags.join(' ')) + '" aria-label="' + esc(p.title) + '">' +
        '<div class="feature-wrap" style="display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center;">' +
        '<div><h2 style="margin:.2rem 0 0;">' + esc(p.title) + '</h2>' +
        '<p class="project-desc" style="font-size:16px;">' + esc(p.desc) + '</p>' + badges(p.badges) + meta(p).replace('class="meta-row"', 'class="meta-row" style="margin-top:8px;"') + actions(p.links) + '</div>' +
        '<div><div class="project-thumb" style="aspect-ratio:auto;background:none;box-shadow:none;"><video controls playsinline preload="none" poster="' + esc(p.video.poster) + '"><source src="' + esc(p.video.file) + '" type="video/mp4">Your browser does not support the video tag.</video></div></div>' +
        '</div></section>';
    }).join('');
    gridRoot.innerHTML = rest.map(function (p) {
      return '<article class="project-card" data-tags="' + esc(p.tags.join(' ')) + '">' +
        '<div class="project-thumb"><img src="' + esc(p.thumb) + '" alt="' + esc(p.title) + '" loading="lazy"></div>' +
        '<div class="project-body"><h3 class="project-title">' + esc(p.title) + '</h3><p class="project-desc">' + esc(p.desc) + '</p>' +
        badges(p.badges) + meta(p) + actions(p.links) + '</div></article>';
    }).join('');

    if (filters) {
      var LABELS = [['mobile', 'Mobile'], ['fullstack', 'Full-stack'], ['backend', 'Backend/API'], ['web', 'Web'], ['salesforce', 'Salesforce']];
      var used = {}; S.projects.forEach(function (p) { p.tags.forEach(function (t) { used[t] = 1; }); });
      filters.innerHTML = '<button class="chip active" data-filter="all" aria-pressed="true">All</button>' +
        LABELS.filter(function (l) { return used[l[0]]; }).map(function (l) { return '<button class="chip" data-filter="' + l[0] + '" aria-pressed="false">' + l[1] + '</button>'; }).join('');
      var chips = filters.querySelectorAll('.chip'), items = document.querySelectorAll('[data-tags]');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
          chip.classList.add('active'); chip.setAttribute('aria-pressed', 'true');
          var tag = chip.getAttribute('data-filter');
          items.forEach(function (el) {
            var tags = (el.getAttribute('data-tags') || '').split(/\s+/);
            el.style.display = (tag === 'all' || tags.indexOf(tag) > -1) ? '' : 'none';
          });
        });
      });
    }
  }

  /* ---------- Skills page ---------- */
  var skRoot = $('#skills-root');
  if (skRoot) {
    var SPAN = { languages: 6, frameworks: 6, databases: 6, backend: 6, salesforce: 12, professional: 4, pm: 4, tooling: 4 };
    skRoot.innerHTML = S.skills.map(function (g) {
      var chips = (g.items || []).map(function (i) {
        var mark = i.icon ? '<img class="ico" src="assets/icons/' + esc(i.icon) + '.svg" alt="" width="20" height="20">' : '<span class="dot"></span>';
        return '<span class="chip">' + mark + esc(i.name) + '</span>';
      }).join('');
      return '<article class="card span-' + (SPAN[g.key] || 6) + '"><h2>' + esc(g.title) + '</h2>' +
        (g.sub ? '<p class="muted">' + esc(g.sub) + '</p>' : '') +
        (chips ? '<div class="chips">' + chips + '</div>' : '') +
        (g.notes ? '<ul class="list">' + g.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') + '</article>';
    }).join('');
  }
})();
