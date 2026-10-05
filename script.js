/* =====================================================================
   SCRIPT.JS — builds the page from content.js.
   You normally don't need to edit this file.
   Pages: home, engineering, design, photography (switched by the link
   after the # in the address, e.g. yoursite.com/#design).
   ===================================================================== */
(function () {
  'use strict';

  var S = window.SITE;

  /* Preview mode: admin.html shows unsaved edits by opening index.html?preview */
  if (/[?&]preview\b/.test(location.search)) {
    try {
      var draft = JSON.parse(localStorage.getItem('site-admin-draft') || 'null');
      if (draft && draft.site) {
        S = draft.site;
        var newImgs = draft.images || {};
        var swap = function (img) { var s = img.getAttribute('src'); if (s && newImgs[s]) img.src = newImgs[s]; };
        new MutationObserver(function (ms) {
          ms.forEach(function (m) {
            if (m.type === 'attributes') { if (m.target.tagName === 'IMG') swap(m.target); return; }
            m.addedNodes.forEach(function (n) {
              if (n.nodeType !== 1) return;
              if (n.tagName === 'IMG') swap(n);
              n.querySelectorAll('img').forEach(swap);
            });
          });
        }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
      }
    } catch (e) {}
  }
  if (!S) { console.error('content.js did not load. Check it for a missing comma or quote.'); return; }

  /* Older content.js files kept the lists at the top level. Accept them too. */
  ['engineering', 'design'].forEach(function (k) { if (Array.isArray(S[k])) S[k] = { projects: S[k] }; });
  if (Array.isArray(S.photography)) S.photography = { photos: S.photography };

  var root = document.documentElement;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var bind = function (name) { return document.querySelector('[data-bind="' + name + '"]'); };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var isHex = function (v) { return /^#[0-9a-f]{6}$/i.test(v || ''); };
  var tagList = function (tags, cls) {
    return has(tags) ? '<ul class="tags' + (cls ? ' ' + cls : '') + '">' + tags.map(function (t) { return '<li class="tag">' + esc(t) + '</li>'; }).join('') + '</ul>' : '';
  };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var P = S.profile || {}, C = S.contact || {}, T = S.theme || {};
  var fullName = (P.firstName || '') + ' ' + (P.lastName || '');

  /* ---------- THE THREE SECTIONS ---------- */
  var KEYS = ['engineering', 'design', 'photography'];
  var DEF = {
    engineering: { navLabel: 'Engineering', accent: '#2F6BFF' },
    design:      { navLabel: 'Graphic Design', accent: '#FF4F6D' },
    photography: { navLabel: 'Photography', accent: '#F2A93B' }
  };
  var PG = {};
  KEYS.forEach(function (k) {
    var s = S[k] || {};
    PG[k] = Object.assign({}, s);
    PG[k].navLabel = has(s.navLabel) ? s.navLabel : DEF[k].navLabel;
    PG[k].accent = isHex(s.accent) ? s.accent : DEF[k].accent;
    root.style.setProperty('--c-' + k, PG[k].accent);
  });
  var eng = PG.engineering.projects || [], des = PG.design.projects || [], photos = PG.photography.photos || [];
  var groups = { engineering: eng, design: des };
  var num = function (k) { return pad(KEYS.indexOf(k) + 1); };

  /* ---------- THEME ---------- */
  var homeAccent = isHex(T.accent) ? T.accent : '#D9822B';
  function setAccent(hex) {
    var n = parseInt(hex.slice(1), 16), lum = (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
    root.style.setProperty('--accent', hex);
    root.style.setProperty('--on-accent', lum > 0.6 ? '#14130F' : '#FFFFFF');
  }
  setAccent(homeAccent);
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function storedMode() { try { return localStorage.getItem('site-theme'); } catch (e) { return null; } }
  function resolvedMode() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function syncModeIcon() { root.setAttribute('data-mode', resolvedMode()); }
  var startMode = storedMode() || (T.defaultMode === 'dark' || T.defaultMode === 'light' ? T.defaultMode : null);
  if (startMode) root.setAttribute('data-theme', startMode);
  syncModeIcon();
  if (mq && mq.addEventListener) mq.addEventListener('change', syncModeIcon);
  $('#themeToggle').addEventListener('click', function () {
    var next = resolvedMode() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('site-theme', next); } catch (e) {}
    syncModeIcon();
  });

  /* ---------- NAV + FOOTER LINKS ---------- */
  bind('logo').innerHTML = esc(P.firstName || 'Portfolio') + '<span>.</span>';
  bind('navMain').innerHTML = KEYS.map(function (k) {
    return '<li><a href="#' + k + '" data-view-link="' + k + '" style="--dot:' + PG[k].accent + '">' + esc(PG[k].navLabel) + '</a></li>';
  }).join('');
  bind('footNav').innerHTML = KEYS.map(function (k) {
    return '<a href="#' + k + '" style="--dot:' + PG[k].accent + '">' + esc(PG[k].navLabel) + '</a>';
  }).join('');
  bind('footer').textContent = '© ' + new Date().getFullYear() + ' ' + fullName + (P.location ? ' · ' + P.location : '');

  /* ---------- HOME: HERO ---------- */
  bind('eyebrow').textContent = [P.location, 'Portfolio'].filter(has).join(' · ');
  bind('name').innerHTML = esc(P.firstName) + '<br><span class="last">' + esc(P.lastName) + '</span>';
  bind('tagline').textContent = P.tagline || '';
  bind('heroLinks').innerHTML = KEYS.map(function (k) {
    return '<li><a href="#' + k + '" style="--dot:' + PG[k].accent + '">' + esc(PG[k].navLabel) + '</a></li>';
  }).join('');
  var heroImg = bind('heroImage');
  if (has(P.heroImage)) { heroImg.src = P.heroImage; heroImg.alt = P.heroImageAlt || fullName; }
  else heroImg.closest('figure').hidden = true;

  /* ---------- HOME: THE THREE DOORS ---------- */
  var TRUSS = '<svg class="truss" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' +
    '<path d="M50 190H350M50 120H350"/><path d="M50 120L90 190L130 120L170 190L210 120L250 190L290 120L330 190L350 160"/>' +
    '<path d="M90 120V190M170 120V190M250 120V190M330 120V190" stroke-width="1.2" opacity=".6"/>' +
    '<path d="M50 190L38 214H62ZM350 190L338 214H362Z" stroke-width="1.6"/></g>' +
    '<g class="dim" fill="none" stroke-width="1.4"><path d="M50 246H350M50 238V254M350 238V254"/></g>' +
    '<text x="200" y="272" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="currentColor" opacity=".7">12 000</text></svg>';
  function countText(k) {
    var n = k === 'photography' ? photos.length : (groups[k] || []).length;
    return n + (k === 'photography' ? (n === 1 ? ' photo' : ' photos') : (n === 1 ? ' project' : ' projects'));
  }
  bind('gates').innerHTML = KEYS.map(function (k) {
    var g = PG[k];
    var art = has(g.homeImage) ? '<img src="' + esc(g.homeImage) + '" alt="" loading="lazy">'
      : k === 'engineering' ? TRUSS : '<div class="gate-fill" style="--c:' + g.accent + '">' + esc(g.navLabel) + '</div>';
    return '<a class="gate reveal" href="#' + k + '" style="--c:' + g.accent + '">' +
      '<div class="gate-art' + (k === 'engineering' && !has(g.homeImage) ? ' blueprint' : '') + '">' + art + '</div>' +
      '<div class="gate-body"><span class="gate-num">' + num(k) + ' · ' + esc(countText(k)) + '</span>' +
      '<h3>' + esc(g.navLabel) + '</h3><p>' + esc(g.blurb || '') + '</p>' + tagList(g.focus) +
      '<span class="more">Open section <i>→</i></span></div></a>';
  }).join('');

  /* ---------- HOME: ABOUT / TESTIMONIALS ---------- */
  var A = S.about || {};
  bind('aboutHeading').textContent = A.heading || '';
  bind('hello').textContent = "Hello, I'm " + (P.firstName || '') + '.';
  var paras = (A.paragraphs || []).slice();
  if (has(P.university)) paras[0] = (paras[0] || '') + ' I study at the ' + P.university + '.';
  bind('aboutParagraphs').innerHTML = paras.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  var portrait = bind('portrait');
  if (has(P.portrait)) { portrait.src = P.portrait; portrait.alt = P.portraitAlt || fullName; }
  else portrait.parentElement.hidden = true;
  var statsEl = bind('stats');
  if (has(A.stats)) statsEl.innerHTML = A.stats.map(function (s) {
    return '<div class="stat"><div class="stat-number">' + esc(s.number) + '</div><div class="stat-label">' + esc(s.label) + '</div></div>';
  }).join('');
  else statsEl.hidden = true;
  var cvRow = bind('cvRow');
  if (has(P.cvUrl)) cvRow.innerHTML = '<a class="btn btn-outline" href="' + esc(P.cvUrl) + '" target="_blank" rel="noopener">Download CV</a>';
  else cvRow.hidden = true;
  var tq = S.testimonials || [];
  if (tq.length) {
    $('#testimonials').hidden = false;
    bind('testimonials').innerHTML = tq.map(function (q) {
      return '<blockquote class="quote reveal"><p>“' + esc(q.quote) + '”</p><cite>' + esc([q.author, q.year].filter(has).join(', ')) + '</cite></blockquote>';
    }).join('');
  }

  /* ---------- PROJECT COVERS ---------- */
  function sheetCover(p, index) {
    if (has(p.image)) return '<div class="sheet"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>';
    return '<div class="sheet" aria-hidden="true"><div class="sheet-frame"></div>' +
      '<div class="sheet-mark">' + esc(p.discipline || 'Engineering') + '<small>' + esc((p.tags || []).slice(0, 2).join(' · ')) + '</small></div>' +
      '<div class="sheet-tb"><span>DRG ENG-' + pad(index + 1) + '</span><span>' + esc(p.year || '') + '</span></div></div>';
  }
  function designCover(p) {
    if (has(p.image)) return '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">';
    return '<div class="card-cover" aria-hidden="true">' + esc(p.discipline || p.title) + '</div>';
  }

  /* ---------- THE THREE SECTION PAGES ---------- */
  var viewEl = { home: document.getElementById('view-home') };
  KEYS.forEach(function (k) { viewEl[k] = document.getElementById('view-' + k); });

  function pageHeader(k) {
    var g = PG[k];
    var facts = (g.facts || []).filter(function (f) { return has(f.label) || has(f.value); }).map(function (f) {
      return '<div><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
    }).join('');
    return '<div class="ph-band" data-kind="' + k + '"><header class="page-hero">' +
      '<div class="ph-text"><p class="eyebrow">' + num(k) + ' — ' + esc(g.navLabel) + '</p>' +
      '<h1>' + esc(g.heading || g.navLabel) + '</h1>' +
      (has(g.intro) ? '<p class="ph-intro">' + esc(g.intro) + '</p>' : '') + tagList(g.focus, 'focus') + '</div>' +
      (facts ? '<dl class="ph-facts">' + facts + '</dl>' : '') + '</header></div>';
  }
  function chipBar(k, list, field) {
    var seen = [];
    list.forEach(function (it) { var v = it[field]; if (has(v) && seen.indexOf(v) < 0) seen.push(v); });
    if (seen.length < 2 || list.length < 4) return '';
    return '<div class="chips" data-for="' + k + '" role="group" aria-label="Filter">' +
      '<button type="button" class="chip" data-chip="" aria-pressed="true">All</button>' +
      seen.map(function (v) { return '<button type="button" class="chip" data-chip="' + esc(v) + '" aria-pressed="false">' + esc(v) + '</button>'; }).join('') + '</div>';
  }
  function toolsAndTimeline(g) {
    var tools = has(g.skills) ? '<div class="split-col"><h2 class="block-title">' + esc(g.skillsTitle || 'Tools') + '</h2>' + tagList(g.skills, 'pills') + '</div>' : '';
    var tl = has(g.timeline) ? '<div class="split-col"><h2 class="block-title">' + esc(g.timelineTitle || 'Experience') + '</h2><ol class="timeline">' +
      g.timeline.map(function (e) { return '<li><p class="tl-years">' + esc(e.years) + '</p><h3>' + esc(e.title) + '</h3><p>' + esc(e.text) + '</p></li>'; }).join('') + '</ol></div>' : '';
    return (tools || tl) ? '<section class="block split reveal">' + tools + tl + '</section>' : '';
  }
  function ctaAndSiblings(k) {
    var g = PG[k];
    return '<section class="cta reveal"><div class="cta-inner"><div><h2>' + esc(g.ctaHeading || "Let's work together") + '</h2>' +
      (has(g.ctaText) ? '<p>' + esc(g.ctaText) + '</p>' : '') + '</div><a class="btn btn-primary" href="#contact">Get in touch</a></div></section>' +
      '<section class="block"><p class="eyebrow">Also explore</p><div class="siblings">' +
      KEYS.filter(function (o) { return o !== k; }).map(function (o) {
        return '<a class="sib reveal" href="#' + o + '" style="--c:' + PG[o].accent + '"><small>' + num(o) + '</small><strong>' + esc(PG[o].navLabel) + '</strong>' +
          '<span>' + esc(PG[o].blurb || '') + '</span><i>→</i></a>';
      }).join('') + '</div></section>';
  }
  function buildView(k) {
    var g = PG[k], list = k === 'photography' ? photos : groups[k];
    var field = k === 'photography' ? 'category' : 'discipline';
    var title = g.listTitle || (k === 'engineering' ? 'Selected projects' : k === 'design' ? 'Selected work' : 'Gallery');
    viewEl[k].innerHTML = pageHeader(k) +
      '<section class="block"><div class="block-head"><h2 class="block-title">' + esc(title) + '</h2>' + chipBar(k, list, field) + '</div>' +
      '<div class="grid grid-' + k + '" data-grid="' + k + '"></div></section>' +
      toolsAndTimeline(g) + ctaAndSiblings(k);
    paintGrid(k, '', true);
  }

  var shownPhotos = [];
  function paintGrid(k, filter, quiet) {
    var grid = document.querySelector('[data-grid="' + k + '"]'), h = '';
    if (k === 'engineering') {
      h = eng.map(function (p, i) { return { p: p, i: i }; })
        .filter(function (x) { return !filter || x.p.discipline === filter; })
        .map(function (x) {
          return '<button type="button" class="sheet-card reveal" data-open="engineering:' + x.i + '">' + sheetCover(x.p, x.i) +
            '<div class="sheet-body"><h3>' + esc(x.p.title) + '</h3><p>' + esc(x.p.summary) + '</p>' + tagList(x.p.tags) +
            '<span class="more">Read the write-up <i>→</i></span></div></button>';
        }).join('');
    } else if (k === 'design') {
      var vis = des.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return !filter || x.p.discipline === filter; });
      h = vis.map(function (x, n) {
        var feat = !filter && vis.length > 1 && n === 0;
        return '<button type="button" class="card reveal' + (feat ? ' featured' : '') + '" data-open="design:' + x.i + '"><div class="card-media">' + designCover(x.p) + '</div>' +
          '<div class="card-body"><span class="card-kicker">' + esc([x.p.discipline, x.p.year].filter(has).join(' · ')) + '</span><h3>' + esc(x.p.title) + '</h3>' +
          '<p>' + esc(x.p.summary) + '</p>' + tagList(x.p.tags) + '<span class="more">View project <i>→</i></span></div></button>';
      }).join('');
    } else {
      shownPhotos = photos.filter(function (ph) { return !filter || ph.category === filter; });
      grid.className = 'grid grid-photography count-' + Math.min(shownPhotos.length, 3);
      h = shownPhotos.map(function (ph, i) {
        return '<button type="button" class="photo reveal" data-photo="' + i + '" aria-label="View ' + esc(ph.title) + ' full screen">' +
          '<figure><img src="' + esc(ph.image) + '" alt="' + esc(ph.alt || ph.title) + '" loading="lazy">' +
          '<figcaption><strong>' + esc(ph.title) + '</strong><span>' + esc([ph.category, ph.year].filter(has).join(' · ')) + '</span></figcaption></figure></button>';
      }).join('');
    }
    grid.innerHTML = h || '<p class="empty">Coming soon.</p>';
    if (!quiet) armReveal(grid);
  }
  KEYS.forEach(buildView);

  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-chip]');
    if (!c) return;
    var bar = c.parentNode;
    bar.querySelectorAll('[data-chip]').forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
    paintGrid(bar.getAttribute('data-for'), c.getAttribute('data-chip'));
  });

  /* ---------- CONTACT ---------- */
  var links = [];
  if (has(C.email)) links.push('<li><div class="row"><span class="k">Email</span><span class="v"><a href="mailto:' + esc(C.email) + '" style="display:inline;padding:0">' + esc(C.email) + '</a><button type="button" class="copy-btn" data-copy="' + esc(C.email) + '">Copy</button></span></div></li>');
  if (has(C.phone)) links.push('<li><a href="tel:' + esc(C.phone.replace(/\s/g, '')) + '"><span class="k">Phone</span><span class="v">' + esc(C.phone) + '</span></a></li>');
  var social = [['WhatsApp', C.whatsapp ? 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') : ''], ['Instagram', C.instagram], ['LinkedIn', C.linkedin], ['Behance', C.behance], ['GitHub', C.github]];
  social.forEach(function (s) {
    if (has(s[1])) links.push('<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener"><span class="k">' + s[0] + '</span><span class="v">' + esc(s[1].replace(/^https?:\/\/(www\.)?/, '')) + ' ↗</span></a></li>');
  });
  bind('contactLinks').innerHTML = links.length ? links.join('') : '<li class="contact-empty">Add your email and social links in content.js.</li>';

  var topic = $('#cf-topic');
  topic.innerHTML = '<option value="">Something else / not sure yet</option>' + KEYS.map(function (k) { return '<option value="' + k + '">' + esc(PG[k].navLabel) + '</option>'; }).join('');
  var topicLabel = function () { return topic.value ? PG[topic.value].navLabel : ''; };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var text = b.getAttribute('data-copy');
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { selectText(b.previousSibling); });
    else selectText(b.previousSibling);
  });
  function selectText(el) {
    if (!el) return; var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  var form = $('#contactForm'), status = $('#formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['cf-name', 'cf-email', 'cf-message'].forEach(function (id) {
      var f = document.getElementById(id); var valid = f.value.trim() && f.checkValidity();
      f.setAttribute('aria-invalid', valid ? 'false' : 'true'); if (!valid) ok = false;
    });
    if (!ok) { status.textContent = 'Please fill in your name, a valid email and a message.'; return; }
    var data = { topic: topicLabel(), name: form.name.value.trim(), email: form.email.value.trim(), message: form.message.value.trim() };
    if (has(C.formEndpoint)) {
      status.textContent = 'Sending…';
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(); status.textContent = 'Thanks, your message was sent. I will reply soon.'; form.reset(); })
        .catch(function () { status.textContent = 'The message could not be sent. Please email me directly' + (has(C.email) ? ' at ' + C.email : '') + '.'; });
    } else if (has(C.email)) {
      var href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Portfolio enquiry' + (data.topic ? ' (' + data.topic + ')' : '') + ' from ' + data.name) +
        '&body=' + encodeURIComponent(data.message + '\n\n' + data.name + '\n' + data.email);
      window.location.href = href;
      status.textContent = 'Your email app should open with the message ready to send. If it does not, email ' + C.email + '.';
    } else {
      status.textContent = 'The contact form is not set up yet. Add your email in content.js.';
    }
  });

  /* ---------- NAV BEHAVIOUR ---------- */
  var nav = $('#nav'), menuBtn = $('#menuBtn');
  function setMenu(open) {
    nav.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('locked', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('menu-open')); });
  document.querySelectorAll('#navMenu a, .nav-logo').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  $('.nav-logo').addEventListener('click', function () {
    if (current === 'home') window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });   // already on home: glide to the top
  });
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 20); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- REVEAL ON SCROLL (only below the first screen) ---------- */
  var motion = 'IntersectionObserver' in window && !reduce, ro = null;
  if (motion) {
    root.classList.add('js-motion');
    ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
  }
  function armReveal(scope) {
    var els = Array.prototype.slice.call(scope.querySelectorAll('.reveal:not(.in)'));
    if (!motion) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) ro.observe(el); else el.classList.add('in');
    });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 4000); // safety net
  }

  /* ---------- PAGES (home / engineering / design / photography) ---------- */
  var current = null, baseTitle = document.title;
  function show(view) {
    var changed = view !== current;
    Object.keys(viewEl).forEach(function (v) { viewEl[v].hidden = v !== view; });
    current = view;
    root.setAttribute('data-view', view);
    setAccent(view === 'home' ? homeAccent : PG[view].accent);
    document.querySelectorAll('[data-view-link]').forEach(function (a) {
      var on = a.getAttribute('data-view-link') === view;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = view === 'home' ? baseTitle : PG[view].navLabel + ' · ' + fullName;
    if (changed) {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
      armReveal(viewEl[view]);
    }
  }
  function scrollToEl(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- LIGHTBOX ---------- */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCaption'), lbList = [], lbIndex = 0, lbReturn = null;
  function showLb(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var it = lbList[lbIndex];
    lbImg.src = it.src; lbImg.alt = it.alt || it.caption || '';
    lbCap.textContent = it.caption || '';
    $('#lbPrev').hidden = $('#lbNext').hidden = lbList.length < 2;
  }
  function openLb(list, i) {
    lbReturn = document.activeElement; lbList = list; showLb(i);
    lb.hidden = false; document.body.classList.add('locked'); $('#lbClose').focus();
  }
  function closeLb() {
    lb.hidden = true; lbImg.src = '';
    if (detail.hidden) document.body.classList.remove('locked');
    if (lbReturn) lbReturn.focus();
  }
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { showLb(lbIndex - 1); });
  $('#lbNext').addEventListener('click', function () { showLb(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-photo]');
    if (!b) return;
    openLb(shownPhotos.map(function (ph) { return { src: ph.image, alt: ph.alt, caption: [ph.title, ph.category, ph.year].filter(has).join(' · ') }; }), +b.getAttribute('data-photo'));
  });

  /* ---------- PROJECT DETAIL ---------- */
  var detail = $('#detail'), detailBody = $('#detailBody'), detailReturn = null;
  var allProjects = [];
  ['engineering', 'design'].forEach(function (g) { groups[g].forEach(function (p, i) { allProjects.push({ group: g, index: i, p: p }); }); });

  function findBySlug(slug) {
    for (var i = 0; i < allProjects.length; i++) if (allProjects[i].p.slug === slug) return allProjects[i];
    return null;
  }
  function section(title, text) { return has(text) ? '<h2>' + esc(title) + '</h2><p>' + esc(text) + '</p>' : ''; }

  function renderDetail(entry) {
    var p = entry.p, list = groups[entry.group], i = entry.index;
    var prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
    var cover = entry.group === 'engineering'
      ? (has(p.image) ? '<img class="detail-img" src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' : sheetCover(p, i))
      : (has(p.image) ? '<img class="detail-img" src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' : designCover(p));
    var meta = [['Discipline', p.discipline], ['Year', p.year], ['Client', p.client]].filter(function (m) { return has(m[1]); })
      .map(function (m) { return '<div><b>' + m[0] + '</b>' + esc(m[1]) + '</div>'; }).join('');
    var html =
      '<header class="detail-hero"><p class="eyebrow">' + esc(PG[entry.group].navLabel) + ' project</p>' +
      '<h1 id="detailTitle">' + esc(p.title) + '</h1>' + (meta ? '<div class="detail-meta">' + meta + '</div>' : '') + '</header>' +
      '<div class="detail-cover">' + cover + '</div><article class="detail-content">' +
      section('Overview', p.overview) + section('My role', p.role) + section('The challenge', p.challenge) + section('Process', p.process);
    if (has(p.palette)) html += '<h2>Colour palette</h2><div class="palette">' + p.palette.map(function (c) { return '<span class="swatch"><i style="background:' + esc(c) + '"></i>' + esc(c) + '</span>'; }).join('') + '</div>';
    if (has(p.tools)) html += '<h2>Tools</h2>' + tagList(p.tools);
    if (has(p.gallery)) html += '<h2>Gallery</h2><div class="detail-gallery">' + p.gallery.map(function (g, gi) { return '<button type="button" data-gal="' + gi + '"><img src="' + esc(g) + '" alt="' + esc(p.title) + ' image ' + (gi + 1) + '" loading="lazy"></button>'; }).join('') + '</div>';
    html += section('Deliverables', p.deliverables) + section('Results', p.results);
    if (has(p.stats)) html += '<div class="detail-stats">' + p.stats.map(function (s) { return '<div class="stat"><div class="stat-number">' + esc(s.number) + '</div><div class="stat-label">' + esc(s.label) + '</div></div>'; }).join('') + '</div>';
    if (list.length > 1) html += '<nav class="detail-nav" aria-label="More projects">' +
      '<button type="button" data-go="' + esc(prev.slug) + '"><small>Previous</small>← ' + esc(prev.title) + '</button>' +
      '<button type="button" data-go="' + esc(next.slug) + '"><small>Next</small>' + esc(next.title) + ' →</button></nav>';
    html += '<div class="detail-cta"><h2>Interested in working together?</h2><p>Tell me about your project and I will get back to you.</p><button type="button" class="btn btn-primary" data-contact>Get in touch</button></div></article>';
    detailBody.innerHTML = html;
    detail.scrollTop = 0;
    detailBody._gallery = (p.gallery || []).map(function (g) { return { src: g, alt: p.title, caption: p.title }; });
  }

  function viewHash() { return current && current !== 'home' ? '#' + current : location.pathname + location.search; }
  function openDetail(entry, push) {
    if (!entry) return;
    if (detail.hidden) detailReturn = document.activeElement;
    show(entry.group);
    renderDetail(entry);
    detail.hidden = false; document.body.classList.add('locked');
    $('#detailClose').focus();
    var h = '#work-' + entry.p.slug;
    if (push !== false && location.hash !== h) { try { history.pushState(null, '', h); } catch (e) {} }
  }
  function closeDetail(fromHistory) {
    if (detail.hidden) return;
    detail.hidden = true; document.body.classList.remove('locked');
    if (!fromHistory && /^#work-/.test(location.hash)) { try { history.pushState(null, '', viewHash()); } catch (e) {} }
    if (detailReturn) detailReturn.focus();
  }

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { var parts = o.getAttribute('data-open').split(':'); openDetail({ group: parts[0], index: +parts[1], p: groups[parts[0]][+parts[1]] }); return; }
    var go = e.target.closest('[data-go]');
    if (go) { openDetail(findBySlug(go.getAttribute('data-go'))); return; }
    var gal = e.target.closest('[data-gal]');
    if (gal) { openLb(detailBody._gallery, +gal.getAttribute('data-gal')); return; }
    if (e.target.closest('[data-contact]')) {
      closeDetail(); detailReturn = null;
      if (KEYS.indexOf(current) >= 0) topic.value = current;
      scrollToEl('contact');
      setTimeout(function () { $('#cf-name').focus({ preventScroll: true }); }, 500);
    }
  });
  $('#detailClose').addEventListener('click', function () { closeDetail(); });

  /* ---------- ROUTING ---------- */
  function route() {
    var h = ''; try { h = decodeURIComponent((location.hash || '').replace(/^#\/?/, '')); } catch (e) {}
    var m = /^work-(.+)$/.exec(h);
    if (m) { var entry = findBySlug(m[1]); if (entry) { openDetail(entry, false); return; } }
    closeDetail(true);
    if (h === 'contact') {
      if (!current) show('home');
      if (KEYS.indexOf(current) >= 0) topic.value = current;
      scrollToEl('contact');
    } else if (h === 'about' || h === 'paths' || h === 'testimonials') {
      show('home'); scrollToEl(h);
    } else {
      show(KEYS.indexOf(h) >= 0 ? h : 'home');
    }
  }
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);
  route();

  /* ---------- KEYBOARD ---------- */
  document.addEventListener('keydown', function (e) {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    } else if (!detail.hidden && e.key === 'Escape') closeDetail();
    else if (nav.classList.contains('menu-open') && e.key === 'Escape') setMenu(false);
  });
})();
