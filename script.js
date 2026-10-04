/* =====================================================================
   SCRIPT.JS — builds the page from content.js.
   You normally don't need to edit this file.
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
  var tagList = function (tags) {
    return has(tags) ? '<ul class="tags">' + tags.map(function (t) { return '<li class="tag">' + esc(t) + '</li>'; }).join('') + '</ul>' : '';
  };

  var P = S.profile || {}, C = S.contact || {}, T = S.theme || {};
  var fullName = (P.firstName || '') + ' ' + (P.lastName || '');

  /* ---------- THEME ---------- */
  if (has(T.accent)) root.style.setProperty('--accent', T.accent);
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

  /* ---------- HERO + ABOUT ---------- */
  bind('logo').innerHTML = esc(P.firstName || 'Portfolio') + '<span>.</span>';
  bind('eyebrow').textContent = [P.location].concat(P.roles || []).filter(has).join(' · ');
  bind('name').innerHTML = esc(P.firstName) + '<br><span class="last">' + esc(P.lastName) + '</span>';
  bind('roles').innerHTML = (P.roles || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
  bind('tagline').textContent = P.tagline || '';

  var heroImg = bind('heroImage');
  if (has(P.heroImage)) { heroImg.src = P.heroImage; heroImg.alt = P.heroImageAlt || fullName; }
  else heroImg.closest('figure').hidden = true;
  bind('heroCaption').innerHTML =
    '<div><b>Name</b>' + esc(P.initials || '') + '</div>' +
    '<div><b>Field</b>Civil Eng.</div>' +
    '<div><b>Based</b>' + esc(P.location || '') + '</div>';

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

  /* ---------- SERVICES ---------- */
  bind('services').innerHTML = (S.services || []).map(function (s, i) {
    return '<a class="service reveal" href="' + esc(s.link || '#') + '">' +
      '<span class="service-num">' + pad(i + 1) + '</span>' +
      '<h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p>' + tagList(s.tags) +
      '<span class="more">View work →</span></a>';
  }).join('');

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

  /* ---------- ENGINEERING ---------- */
  var eng = S.engineering || [];
  bind('engineering').innerHTML = eng.map(function (p, i) {
    return '<button type="button" class="sheet-card reveal" data-open="engineering:' + i + '">' + sheetCover(p, i) +
      '<div class="sheet-body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p>' + tagList(p.tags) + '</div></button>';
  }).join('');
  if (!eng.length) $('#engineering').hidden = true;

  /* ---------- PHOTOGRAPHY ---------- */
  var photos = S.photography || [];
  var pg = bind('photography');
  pg.classList.add('count-' + Math.min(photos.length, 3));
  pg.innerHTML = photos.map(function (ph, i) {
    return '<button type="button" class="photo reveal" data-photo="' + i + '" aria-label="View ' + esc(ph.title) + ' full screen">' +
      '<figure><img src="' + esc(ph.image) + '" alt="' + esc(ph.alt || ph.title) + '" loading="lazy">' +
      '<figcaption><strong>' + esc(ph.title) + '</strong><span>' + esc([ph.category, ph.year].filter(has).join(' · ')) + '</span></figcaption></figure></button>';
  }).join('');
  if (!photos.length) $('#photography').hidden = true;

  /* ---------- DESIGN ---------- */
  var des = S.design || [];
  bind('design').innerHTML = des.map(function (p, i) {
    return '<button type="button" class="card reveal" data-open="design:' + i + '"><div class="card-media">' + designCover(p) + '</div>' +
      '<div class="card-body"><span class="card-kicker">' + esc(p.discipline) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p>' + tagList(p.tags) + '</div></button>';
  }).join('');
  if (!des.length) $('#design').hidden = true;

  /* ---------- SKILLS / EXPERIENCE / TESTIMONIALS ---------- */
  var sk = S.skills || {};
  bind('skills').innerHTML = Object.keys(sk).map(function (g) {
    return '<div class="skill-group reveal"><h3>' + esc(g) + '</h3>' + tagList(sk[g]) + '</div>';
  }).join('');
  bind('experience').innerHTML = (S.experience || []).map(function (e) {
    return '<li class="reveal"><p class="tl-years">' + esc(e.years) + '</p><h3>' + esc(e.title) + '</h3><p>' + esc(e.text) + '</p></li>';
  }).join('');
  var tq = S.testimonials || [];
  if (tq.length) {
    $('#testimonials').hidden = false;
    bind('testimonials').innerHTML = tq.map(function (q) {
      return '<blockquote class="quote reveal"><p>“' + esc(q.quote) + '”</p><cite>' + esc([q.author, q.year].filter(has).join(', ')) + '</cite></blockquote>';
    }).join('');
  }

  /* ---------- CONTACT ---------- */
  var links = [];
  if (has(C.email)) links.push('<li><div class="row"><span class="k">Email</span><span class="v"><a href="mailto:' + esc(C.email) + '" style="display:inline;padding:0">' + esc(C.email) + '</a><button type="button" class="copy-btn" data-copy="' + esc(C.email) + '">Copy</button></span></div></li>');
  if (has(C.phone)) links.push('<li><a href="tel:' + esc(C.phone.replace(/\s/g, '')) + '"><span class="k">Phone</span><span class="v">' + esc(C.phone) + '</span></a></li>');
  var social = [['WhatsApp', C.whatsapp ? 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') : ''], ['Instagram', C.instagram], ['LinkedIn', C.linkedin], ['Behance', C.behance], ['GitHub', C.github]];
  social.forEach(function (s) {
    if (has(s[1])) links.push('<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener"><span class="k">' + s[0] + '</span><span class="v">' + esc(s[1].replace(/^https?:\/\/(www\.)?/, '')) + ' ↗</span></a></li>');
  });
  bind('contactLinks').innerHTML = links.length ? links.join('') : '<li class="contact-empty">Add your email and social links in content.js.</li>';

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
    var data = { name: form.name.value.trim(), email: form.email.value.trim(), message: form.message.value.trim() };
    if (has(C.formEndpoint)) {
      status.textContent = 'Sending…';
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(); status.textContent = 'Thanks, your message was sent. I will reply soon.'; form.reset(); })
        .catch(function () { status.textContent = 'The message could not be sent. Please email me directly' + (has(C.email) ? ' at ' + C.email : '') + '.'; });
    } else if (has(C.email)) {
      var href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Portfolio enquiry from ' + data.name) +
        '&body=' + encodeURIComponent(data.message + '\n\n' + data.name + '\n' + data.email);
      window.location.href = href;
      status.textContent = 'Your email app should open with the message ready to send. If it does not, email ' + C.email + '.';
    } else {
      status.textContent = 'The contact form is not set up yet. Add your email in content.js.';
    }
  });

  bind('footer').textContent = '© ' + new Date().getFullYear() + ' ' + fullName + ' · ' + (P.roles || []).join(' · ') + ' · ' + (P.location || '');

  /* ---------- NAV ---------- */
  var nav = $('#nav'), menuBtn = $('#menuBtn');
  function setMenu(open) {
    nav.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('locked', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('menu-open')); });
  document.querySelectorAll('#navLinks a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 20); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if ('IntersectionObserver' in window) {
    var navMap = {};
    document.querySelectorAll('#navLinks a').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && navMap[en.target.id]) {
          Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove('active'); });
          navMap[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- REVEAL ON SCROLL (only below the first screen) ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var items = Array.prototype.filter.call(document.querySelectorAll('.reveal'), function (el) {
      return el.getBoundingClientRect().top > window.innerHeight;
    });
    root.classList.add('js-motion');
    document.querySelectorAll('.reveal').forEach(function (el) { if (items.indexOf(el) < 0) el.classList.add('in'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { ro.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add('in'); }); }, 4000); // safety net
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

  var photoList = photos.map(function (ph) { return { src: ph.image, alt: ph.alt, caption: [ph.title, ph.category, ph.year].filter(has).join(' · ') }; });
  pg.addEventListener('click', function (e) {
    var b = e.target.closest('[data-photo]'); if (b) openLb(photoList, +b.getAttribute('data-photo'));
  });

  /* ---------- PROJECT DETAIL ---------- */
  var detail = $('#detail'), detailBody = $('#detailBody'), detailReturn = null;
  var groups = { engineering: eng, design: des };
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
      '<header class="detail-hero"><p class="eyebrow">' + (entry.group === 'engineering' ? 'Engineering project' : 'Design project') + '</p>' +
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

  function openDetail(entry, push) {
    if (!entry) return;
    if (detail.hidden) detailReturn = document.activeElement;
    renderDetail(entry);
    detail.hidden = false; document.body.classList.add('locked');
    $('#detailClose').focus();
    var h = '#work-' + entry.p.slug;
    if (push !== false && location.hash !== h) { try { history.pushState(null, '', h); } catch (e) {} }
  }
  function closeDetail(fromHistory) {
    if (detail.hidden) return;
    detail.hidden = true; document.body.classList.remove('locked');
    if (!fromHistory && /^#work-/.test(location.hash)) { try { history.pushState(null, '', location.pathname + location.search); } catch (e) {} }
    if (detailReturn) detailReturn.focus();
  }

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { var parts = o.getAttribute('data-open').split(':'); openDetail({ group: parts[0], index: +parts[1], p: groups[parts[0]][+parts[1]] }); return; }
    var go = e.target.closest('[data-go]');
    if (go) { openDetail(findBySlug(go.getAttribute('data-go'))); return; }
    var gal = e.target.closest('[data-gal]');
    if (gal) { openLb(detailBody._gallery, +gal.getAttribute('data-gal')); return; }
    if (e.target.closest('[data-contact]')) { closeDetail(); detailReturn = null; $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setTimeout(function () { $('#cf-name').focus({ preventScroll: true }); }, 500); }
  });
  $('#detailClose').addEventListener('click', function () { closeDetail(); });

  function route() {
    var m = /^#work-(.+)$/.exec(location.hash);
    if (m) openDetail(findBySlug(decodeURIComponent(m[1])), false);
    else closeDetail(true);
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
