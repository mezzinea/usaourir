/*
 * US AOURIR — homepage: hero slider, stats, team photos, photo gallery + lightbox, featured products, social links.
 */
(function () {
  'use strict';

  var U = window.USA, I = window.USAI18n;
  var t = U.t, tr = U.tr, esc = U.esc;
  var D = U.data, S = D.settings;
  var $ = function (s) { return document.querySelector(s); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function photo(slug, size) { return 'img/photos/' + slug + '-' + (size || 'md') + '.webp'; }
  function href(h) { return h === 'join' ? U.joinHref() : h; }

  /* ---------- Hero slider ---------- */
  var slideIndex = 0, slideTimer = null, paused = false;
  function renderSlides() {
    var slides = D.heroSlides || [];
    $('[data-slides]').innerHTML = slides.map(function (s, i) {
      var tag = i === 0 ? 'h1' : 'h2';
      var external = /^https?:/.test(href(s.cta.href)) ? ' target="_blank" rel="noopener"' : '';
      return '<article class="slide' + (i === slideIndex ? ' is-active' : '') + '" aria-roledescription="slide" aria-label="' + (i + 1) + ' / ' + slides.length + '"' + (i === slideIndex ? '' : ' aria-hidden="true"') + '>' +
        '<img class="slide__bg" src="' + photo(s.image, 'lg') + '" srcset="' + photo(s.image, 'md') + ' 900w, ' + photo(s.image, 'lg') + ' 1920w" sizes="100vw" alt=""' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '>' +
        '<div class="slide__shade"></div>' +
        '<div class="container slide__content">' +
          '<div class="slide__copy">' +
            '<p class="slide__meta"><span class="slide__tag">' + esc(tr(s.tag)) + '</span></p>' +
            '<' + tag + ' class="slide__title">' + esc(tr(s.title)) + '</' + tag + '>' +
            '<p class="slide__text">' + esc(tr(s.text)) + '</p>' +
            '<a class="btn btn--outline-light btn--lg" href="' + href(s.cta.href) + '"' + external + (i === slideIndex ? '' : ' tabindex="-1"') + '>' + esc(tr(s.cta.label)) + '</a>' +
          '</div>' +
          (s.product ? '<a class="slide__product" href="' + href(s.cta.href) + '" tabindex="-1" aria-hidden="true"><img src="' + s.product + '" alt="" loading="lazy"></a>' : '') +
        '</div>' +
      '</article>';
    }).join('');
    $('[data-dots]').innerHTML = slides.map(function (s, i) {
      return '<button type="button" class="slider__dot" data-dot="' + i + '" aria-label="' + esc(t('hero.goto', { n: i + 1 })) + '" aria-current="' + (i === slideIndex) + '"><span></span></button>';
    }).join('');
  }
  function goSlide(i) {
    var slides = document.querySelectorAll('.slide');
    if (!slides.length) return;
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (el, n) {
      var on = n === slideIndex;
      el.classList.toggle('is-active', on);
      if (on) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true');
      el.querySelectorAll('a.btn').forEach(function (a) { if (on) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
    });
    document.querySelectorAll('[data-dot]').forEach(function (d, n) { d.setAttribute('aria-current', String(n === slideIndex)); });
    restartTimer();
  }
  function restartTimer() {
    clearInterval(slideTimer);
    var dots = $('[data-dots]');
    if (dots) { dots.classList.remove('is-running'); void dots.offsetWidth; }
    if (reduceMotion || paused) return;
    if (dots) dots.classList.add('is-running');
    slideTimer = setInterval(function () { goSlide(slideIndex + 1); }, 7000);
  }
  var rtlStep = function (d) { return document.documentElement.dir === 'rtl' ? -d : d; };
  $('[data-slide-prev]').addEventListener('click', function () { goSlide(slideIndex - 1); });
  $('[data-slide-next]').addEventListener('click', function () { goSlide(slideIndex + 1); });
  $('[data-dots]').addEventListener('click', function (e) { var d = e.target.closest('[data-dot]'); if (d) goSlide(+d.getAttribute('data-dot')); });
  var slider = $('.slider');
  slider.addEventListener('mouseenter', function () { paused = true; restartTimer(); });
  slider.addEventListener('mouseleave', function () { paused = false; restartTimer(); });
  slider.addEventListener('focusin', function () { paused = true; restartTimer(); });
  slider.addEventListener('focusout', function () { paused = false; restartTimer(); });
  var touchX = null;
  slider.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50) goSlide(slideIndex + rtlStep(dx < 0 ? 1 : -1));
  });

  /* ---------- Stats, teams ---------- */
  function renderStats() {
    $('[data-stats]').innerHTML = D.stats.map(function (s) {
      return '<div class="stat"><b>' + esc(s.value) + '</b><span>' + esc(tr(s.label)) + '</span></div>';
    }).join('');
  }
  function renderTeams() {
    $('[data-teams]').innerHTML = D.teams.map(function (tm, i) {
      return '<button type="button" class="team-card" data-team="' + i + '">' +
        '<img src="' + photo(tm.image) + '" alt="" loading="lazy">' +
        '<span class="team-card__label"><b>' + esc(tr(tm.name)) + '</b></span>' +
      '</button>';
    }).join('');
    document.querySelectorAll('[data-join-link]').forEach(function (a) {
      a.href = U.joinHref();
      if (S.whatsapp) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }
  $('[data-teams]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-team]');
    if (!b) return;
    openLightbox(D.teams.map(function (tm) { return { image: tm.image, caption: tm.name }; }), +b.getAttribute('data-team'));
  });

  /* ---------- Gallery + lightbox ---------- */
  var PREVIEW = 9, showAll = false;
  function renderPhotos() {
    var list = showAll ? D.gallery : D.gallery.slice(0, PREVIEW);
    $('[data-photos]').innerHTML = list.map(function (g, i) {
      return '<button type="button" class="photo-tile' + (i === 0 ? ' photo-tile--big' : '') + '" data-photo="' + i + '">' +
        '<img src="' + photo(g.image) + '" alt="' + esc(tr(g.caption)) + '" loading="lazy">' +
        '<span class="photo-tile__cap">' + esc(tr(g.caption)) + '</span></button>';
    }).join('');
    var more = $('[data-photos-more]');
    more.hidden = D.gallery.length <= PREVIEW;
    more.textContent = t(showAll ? 'gallery.less' : 'gallery.more');
  }
  $('[data-photos]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-photo]');
    if (b) openLightbox(D.gallery, +b.getAttribute('data-photo'));
  });
  $('[data-photos-more]').addEventListener('click', function () {
    showAll = !showAll;
    renderPhotos();
    if (!showAll) $('#galerie').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var lb = $('[data-lightbox]'), lbList = [], lbIndex = 0;
  function lbRender() {
    var g = lbList[lbIndex];
    lb.innerHTML =
      '<div class="lightbox__inner">' +
        '<button type="button" class="lightbox__close" data-lb-close aria-label="' + t('nav.close') + '">' + U.icon('close') + '</button>' +
        '<figure><img src="' + photo(g.image, 'lg') + '" alt="' + esc(tr(g.caption)) + '">' +
        '<figcaption><b>' + esc(tr(g.caption)) + '</b><span>' + t('gallery.photo', { n: lbIndex + 1, total: lbList.length }) + '</span></figcaption></figure>' +
        (lbList.length > 1
          ? '<button type="button" class="lightbox__nav lightbox__nav--prev" data-lb-step="-1" aria-label="' + t('hero.prev') + '"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
            '<button type="button" class="lightbox__nav lightbox__nav--next" data-lb-step="1" aria-label="' + t('hero.next') + '"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
          : '') +
      '</div>';
  }
  function openLightbox(list, i) {
    lbList = list; lbIndex = i; lbRender();
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.classList.add('no-scroll');
  }
  function lbStep(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; lbRender(); }
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.closest('[data-lb-close]')) { lb.close(); return; }
    var s = e.target.closest('[data-lb-step]');
    if (s) lbStep(+s.getAttribute('data-lb-step'));
  });
  lb.addEventListener('keydown', function (e) {
    var rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'ArrowRight') lbStep(rtl ? -1 : 1);
    if (e.key === 'ArrowLeft') lbStep(rtl ? 1 : -1);
  });
  lb.addEventListener('close', function () { document.body.classList.remove('no-scroll'); });
  var lbTouch = null;
  lb.addEventListener('touchstart', function (e) { lbTouch = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (lbTouch === null) return;
    var dx = e.changedTouches[0].clientX - lbTouch; lbTouch = null;
    if (Math.abs(dx) > 50) lbStep(rtlStep(dx < 0 ? 1 : -1));
  });

  /* ---------- Shop teaser + social ---------- */
  function renderFeatured() {
    var list = D.products.filter(function (p) { return p.badge; }).slice(0, 4);
    if (list.length < 4) list = list.concat(D.products.filter(function (p) { return list.indexOf(p) < 0; })).slice(0, 4);
    $('[data-featured]').innerHTML = list.map(U.card).join('');
  }
  function renderSocial() {
    var handle = function (url) { return '@' + url.replace(/\/+$/, '').split('/').pop(); };
    var items = [[S.instagram, 'ig', 'Instagram', handle(S.instagram), true], [S.facebook, 'fb', 'Facebook', handle(S.facebook), true]];
    if (S.whatsapp) items.push(['https://wa.me/' + S.whatsapp, 'wa', 'WhatsApp', '+' + S.whatsapp, true]);
    items.push(['mailto:' + S.email, 'mail', t('contact.email'), S.email, false]);
    $('[data-social]').innerHTML = items.map(function (c) {
      return '<a class="social__item" href="' + c[0] + '"' + (c[4] ? ' target="_blank" rel="noopener"' : '') + '>' +
        '<span class="social__icon">' + U.icon(c[1]) + '</span><b>' + c[2] + '</b><small dir="ltr">' + esc(c[3]) + '</small></a>';
    }).join('');
  }

  function renderAll() {
    renderSlides(); renderStats(); renderTeams(); renderPhotos(); renderFeatured(); renderSocial();
    restartTimer();
  }
  renderAll();
  document.addEventListener('langchange', renderAll);
})();
