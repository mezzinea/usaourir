/*
 * US AOURIR — shared site runtime.
 * Renders header, footer and the cart drawer, handles language switching,
 * and exposes helpers as window.USA. Requires data/club.js and js/i18n.js.
 */
(function () {
  'use strict';

  var I = window.USAI18n;
  var t = I.t, tr = I.tr;
  var DATA = window.USA_DATA;
  var S = DATA.settings;
  var page = document.body.getAttribute('data-page');
  var home = page === 'home' ? '' : 'index.html';

  /* ---------- Storage (falls back to memory if blocked) ---------- */
  var memory = {};
  var store = {
    get: function (k) {
      try { var v = localStorage.getItem(k); if (v !== null) return v; } catch (e) { /* memory */ }
      return memory[k] || null;
    },
    set: function (k, v) {
      memory[k] = v;
      try { localStorage.setItem(k, v); } catch (e) { /* memory only */ }
    }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function money(n) {
    var num = new Intl.NumberFormat(I.locale(), { maximumFractionDigits: 0 }).format(n);
    return I.lang === 'ar' ? num + ' درهم' : num + ' ' + S.currency;
  }

  // Product helpers: options can be plain strings ("M") or translated objects ({ fr, ar, en }).
  function optValue(o) { return typeof o === 'string' ? o : (o.fr || o.en); }
  function optLabel(p, value) {
    var o = (p.sizes || []).filter(function (x) { return optValue(x) === value; })[0];
    return o ? tr(o) : value;
  }
  function optName(p) { return p.optionLabel ? tr(p.optionLabel) : t('store.size'); }
  function mainImage(p) { return (p.images && p.images[0]) || p.image || ''; }

  function product(id) {
    for (var i = 0; i < DATA.products.length; i++) if (DATA.products[i].id === id) return DATA.products[i];
    return null;
  }

  /* ---------- Icons ---------- */
  var ICONS = {
    cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20.5" r="1.5"/><circle cx="17" cy="20.5" r="1.5"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>',
    fb: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 6.5L12 13l8.5-6.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    wa: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13.4 13.4 0 0 1-5.2-4.6 5.8 5.8 0 0 1-1.2-3.1 3.4 3.4 0 0 1 1-2.5 1.1 1.1 0 0 1 .8-.4h.6c.2 0 .5 0 .7.6l1 2.4c.1.2.1.4 0 .6l-.3.5-.5.5c-.2.2-.3.4-.1.7a10 10 0 0 0 1.9 2.3 9 9 0 0 0 2.7 1.7c.3.2.6.1.8-.1l1-1.3c.3-.3.5-.3.8-.2l2.3 1.1c.3.2.6.3.6.4.1.2.1.8-.2 1.5z"/>',
    pin: '<path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" fill="none" stroke="currentColor" stroke-width="2"/>',
    chev: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    search: '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  };
  function icon(name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  /* ---------- Layout ---------- */
  var LANG_NAMES = { fr: 'Français', ar: 'العربية', en: 'English' };
  var LANG_SHORT = { fr: 'FR', ar: 'AR', en: 'EN' };
  var langCount = 0;

  // Language dropdown. `up` opens the list above the button (footer).
  function langButtons(up) {
    var id = 'lang-menu-' + (++langCount);
    return '<div class="lang' + (up ? ' lang--up' : '') + '" data-langdd>' +
      '<button type="button" class="lang__toggle" aria-haspopup="true" aria-expanded="false" aria-controls="' + id + '" aria-label="Langue / اللغة / Language">' +
        icon('globe') + '<span data-lang-current>' + LANG_SHORT[I.lang] + '</span>' + icon('chev', 'lang__chev') +
      '</button>' +
      '<ul class="lang__menu" id="' + id + '" hidden>' + I.langs.map(function (l) {
        return '<li><button type="button" data-lang="' + l + '" lang="' + l + '" aria-current="' + (l === I.lang) + '">' +
          '<span>' + LANG_NAMES[l] + '</span><small>' + LANG_SHORT[l] + '</small></button></li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  // Footer: plain text links instead of a dropdown.
  function langLinks() {
    return '<nav class="lang-links" aria-label="Langue / اللغة / Language">' + I.langs.map(function (l) {
      return '<button type="button" data-lang="' + l + '" lang="' + l + '" title="' + LANG_NAMES[l] + '" aria-current="' + (l === I.lang) + '">' + LANG_SHORT[l] + '</button>';
    }).join('<span aria-hidden="true">·</span>') + '</nav>';
  }

  function closeLangMenus(except) {
    document.querySelectorAll('[data-langdd]').forEach(function (dd) {
      if (dd === except) return;
      dd.querySelector('.lang__menu').hidden = true;
      dd.querySelector('.lang__toggle').setAttribute('aria-expanded', 'false');
    });
  }

  function toggleLangMenu(dd, open) {
    var menu = dd.querySelector('.lang__menu');
    open = typeof open === 'boolean' ? open : menu.hidden;
    closeLangMenus(dd);
    menu.hidden = !open;
    dd.querySelector('.lang__toggle').setAttribute('aria-expanded', String(open));
    if (open) (menu.querySelector('[aria-current="true"]') || menu.querySelector('button')).focus();
  }

  var CLUB_LINKS = [['#club', 'nav.club'], ['#equipes', 'nav.teams'], ['#galerie', 'nav.gallery'], ['#contact', 'nav.contact']];

  // Registration link: WhatsApp when a number is set, otherwise e-mail.
  function joinHref() {
    return S.whatsapp
      ? 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(t('teams.join') + ' — US Aourir')
      : 'mailto:' + S.email + '?subject=' + encodeURIComponent(t('teams.join'));
  }

  function navLinks() {
    if (page === 'store') {
      return DATA.categories.map(function (c) {
        // Jump to the category's product row if the page has one, otherwise filter the catalogue.
        return document.getElementById('rail-' + c.id)
          ? '<a href="#rail-' + c.id + '" data-cat-name="' + c.id + '">' + esc(tr(c.name)) + '</a>'
          : '<a href="boutique.html?cat=' + c.id + '#catalogue" data-cat-link="' + c.id + '" data-cat-name="' + c.id + '">' + esc(tr(c.name)) + '</a>';
      }).join('') +
        '<a href="#flocage" data-i18n="nav.custom">' + t('nav.custom') + '</a>' +
        '<a class="nav__shop" href="index.html" data-i18n="nav.backClub">' + t('nav.backClub') + '</a>';
    }
    return CLUB_LINKS.map(function (l) {
      return '<a href="' + home + l[0] + '" data-i18n="' + l[1] + '">' + t(l[1]) + '</a>';
    }).join('') + '<a class="nav__shop' + (page === 'store' ? ' is-active' : '') + '" href="boutique.html" data-i18n="nav.shop">' + t('nav.shop') + '</a>';
  }

  function renderHeader() {
    var el = document.querySelector('[data-site-header]');
    if (!el) return;
    var ext = S.whatsapp ? ' target="_blank" rel="noopener"' : '';
    el.outerHTML =
      '<div class="utility"><div class="utility__inner">' +
        '<nav class="utility__links" aria-label="US Aourir">' +
          '<a href="index.html"' + (page === 'home' ? ' class="is-active"' : '') + ' data-i18n="util.official">' + t('util.official') + '</a>' +
          '<a href="boutique.html"' + (page === 'store' ? ' class="is-active"' : '') + ' data-i18n="nav.shop">' + t('nav.shop') + '</a>' +
          '<a href="' + joinHref() + '" data-join-link' + ext + ' data-i18n="util.register">' + t('util.register') + '</a>' +
        '</nav>' +
        '<div class="utility__social">' + socialLinks() + '</div>' +
      '</div></div>' +
      (page === 'store' ? ticker() : '') +
      '<header class="header' + (page === 'home' ? ' header--overlay' : '') + (page === 'store' ? ' header--shop' : '') + '" data-header>' +
        '<div class="header__inner">' +
          '<a class="brand" href="' + (home || '#top') + '" aria-label="US Aourir"><img src="img/logo-crest.png" alt="" width="52" height="73">' +
            '<span class="brand__text"><strong>US AOURIR</strong><small>Union Sport Aourir</small></span></a>' +
          '<div class="header__main">' +
            '<div class="header__top"><span class="header__title" data-i18n="' + (page === 'store' ? 'header.shop' : 'header.official') + '">' + t(page === 'store' ? 'header.shop' : 'header.official') + '</span>' + langButtons() + '</div>' +
            '<div class="header__bottom">' +
              '<nav class="nav" aria-label="Main">' + navLinks() + '</nav>' +
              '<div class="header__tools">' +
                (page === 'store' ? '<a class="cart-btn" href="#catalogue" data-search-jump aria-label="' + esc(t('catalog.search')) + '" data-i18n-attr="aria-label:catalog.search">' + icon('search') + '</a>' : '') +
                '<button type="button" class="cart-btn" data-cart-open data-i18n-attr="aria-label:cart.open" aria-label="' + t('cart.open') + '">' + icon('cart') + '<span class="cart-btn__count" data-cart-count hidden>0</span></button>' +
                '<button type="button" class="menu-btn" data-menu-open data-i18n-attr="aria-label:nav.menu" aria-label="' + t('nav.menu') + '" aria-expanded="false">' + icon('menu') + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>' +

      '<div class="mobile-nav" data-mobile-nav hidden>' +
        '<nav>' + navLinks() + '</nav>' + langButtons() +
      '</div>';
  }

  // Shop: scrolling promo ticker (messages repeated so the loop is seamless).
  var TICKER = [['ann.1', 'star'], ['ann.4', 'pen'], ['ann.2', 'wa'], ['ann.3', 'pin']];
  function ticker() {
    var items = TICKER.map(function (m) {
      return '<span class="ticker__item">' + icon(m[1]) + '<span data-i18n="' + m[0] + '">' + t(m[0]) + '</span></span>';
    }).join('');
    return '<div class="ticker" aria-label="' + esc(t('ann.1')) + '"><div class="ticker__track">' +
      '<div class="ticker__group">' + items + '</div><div class="ticker__group" aria-hidden="true">' + items + '</div>' +
    '</div></div>';
  }

  function footerCol(titleKey, links) {
    return '<div class="footer__col"><h3 data-i18n="' + titleKey + '">' + t(titleKey) + '</h3><ul>' + links.map(function (l) {
      return '<li><a href="' + l[0] + '"' + (l[2] ? ' target="_blank" rel="noopener"' : '') + (l[3] ? ' ' + l[3] : '') + '>' + l[1] + '</a></li>';
    }).join('') + '</ul></div>';
  }

  function renderFooter() {
    var el = document.querySelector('[data-site-footer]');
    if (!el) return;
    var club = CLUB_LINKS.map(function (l) { return [(home || '') + l[0], t(l[1]), false, 'data-i18n="' + l[1] + '"']; });
    var shop = DATA.categories.map(function (c) {
      return ['boutique.html?cat=' + c.id + '#catalogue', esc(tr(c.name)), false, 'data-cat-name="' + c.id + '"' + (page === 'store' ? ' data-cat-link="' + c.id + '"' : '')];
    }).concat([['boutique.html#flocage', t('nav.custom'), false, 'data-i18n="nav.custom"']]);
    var contact = [['mailto:' + S.email, S.email, false, 'dir="ltr"']];
    if (S.whatsapp) contact.push(['https://wa.me/' + S.whatsapp, 'WhatsApp +' + S.whatsapp, true, 'dir="ltr"']);
    contact.push([S.instagram, 'Instagram', true], [S.facebook, 'Facebook', true]);
    el.outerHTML =
      '<footer class="footer">' +
        '<div class="footer__stripe"></div>' +
        '<div class="container footer__grid">' +
          '<div class="footer__brand"><img src="img/logo-crest.png" alt="" width="72" height="101">' +
            '<div><strong>Union Sport Aourir</strong><p data-i18n="footer.tagline">' + t('footer.tagline') + '</p>' +
            '<div class="footer__social">' + socialLinks() + '</div></div></div>' +
          footerCol('footer.club', club) + footerCol('footer.shop', shop) + footerCol('footer.contact', contact) +
        '</div>' +
        '<div class="footer__bottom"><div class="container footer__bottom-inner">' +
          '<span>© ' + new Date().getFullYear() + ' Union Sport Aourir. <span data-i18n="footer.rights">' + t('footer.rights') + '</span></span>' + langLinks() +
          '<span class="footer__credit"><span data-i18n="footer.credit">' + t('footer.credit') + '</span> <a href="https://yancode.ma" target="_blank" rel="noopener">YanCode</a></span>' +
        '</div></div>' +
      '</footer>';
  }

  function socialLinks() {
    return '<a href="' + S.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon('ig') + '</a>' +
      '<a href="' + S.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon('fb') + '</a>' +
      '<a href="mailto:' + S.email + '" aria-label="E-mail">' + icon('mail') + '</a>' +
      (S.whatsapp ? '<a href="https://wa.me/' + S.whatsapp + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon('wa') + '</a>' : '');
  }

  function bindLayout() {
    document.addEventListener('click', function (e) {
      var tg = e.target.closest('.lang__toggle');
      if (tg) { toggleLangMenu(tg.closest('[data-langdd]')); return; }
      var lb = e.target.closest('[data-lang]');
      if (lb) {
        var dd = lb.closest('[data-langdd]');
        I.setLang(lb.getAttribute('data-lang'));
        closeLangMenus();
        if (dd) dd.querySelector('.lang__toggle').focus();
        return;
      }
      if (!e.target.closest('[data-langdd]')) closeLangMenus();
      if (e.target.closest('[data-menu-open]')) { toggleMenu(); return; }
      if (e.target.closest('[data-search-jump]')) {
        var sb = document.querySelector('[data-search]');
        if (sb) { e.preventDefault(); document.querySelector('#catalogue').scrollIntoView({ behavior: 'smooth' }); setTimeout(function () { sb.focus({ preventScroll: true }); }, 450); }
      }
      if (e.target.closest('.mobile-nav a')) toggleMenu(false);
    });
    document.addEventListener('langchange', function () {
      document.querySelectorAll('[data-lang]').forEach(function (b) {
        b.setAttribute('aria-current', String(b.getAttribute('data-lang') === I.lang));
      });
      document.querySelectorAll('[data-lang-current]').forEach(function (c) { c.textContent = LANG_SHORT[I.lang]; });
      document.querySelectorAll('[data-join-link]').forEach(function (a) { a.href = joinHref(); });
      document.querySelectorAll('[data-cat-name]').forEach(function (a) {
        var c = DATA.categories.filter(function (x) { return x.id === a.getAttribute('data-cat-name'); })[0];
        if (c) a.textContent = tr(c.name);
      });
      renderCart();
    });
    // Keyboard: arrows move between languages, Escape closes the list.
    document.addEventListener('keydown', function (e) {
      var dd = e.target.closest && e.target.closest('[data-langdd]');
      if (!dd) return;
      var menu = dd.querySelector('.lang__menu');
      var items = Array.prototype.slice.call(menu.querySelectorAll('button'));
      if (e.key === 'Escape' && !menu.hidden) { e.stopPropagation(); toggleLangMenu(dd, false); dd.querySelector('.lang__toggle').focus(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      if (menu.hidden) { toggleLangMenu(dd, true); return; }
      var i = items.indexOf(document.activeElement);
      items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
    }, true);
    document.addEventListener('focusin', function (e) {
      if (!e.target.closest('[data-langdd]')) closeLangMenus();
    });
    var msgs = document.querySelectorAll('.announce__msg'), mi = 0;
    if (msgs.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () {
        msgs[mi].classList.remove('is-active');
        mi = (mi + 1) % msgs.length;
        msgs[mi].classList.add('is-active');
      }, 4000);
    }
    var header = document.querySelector('[data-header]');
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function toggleMenu(force) {
    var nav = document.querySelector('[data-mobile-nav]');
    var btn = document.querySelector('[data-menu-open]');
    var open = typeof force === 'boolean' ? force : nav.hidden;
    if (open) nav.style.top = Math.max(0, document.querySelector('[data-header]').getBoundingClientRect().bottom) + 'px';
    nav.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.innerHTML = icon(open ? 'close' : 'menu');
    document.body.classList.toggle('no-scroll', open);
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2400);
  }

  /* ---------- Cart ---------- */
  var CART_KEY = 'usa_cart';
  var cart = [];
  try { cart = JSON.parse(store.get(CART_KEY) || '[]').filter(function (i) { return product(i.id); }); } catch (e) { cart = []; }

  function saveCart() { store.set(CART_KEY, JSON.stringify(cart)); renderCart(); }

  function unitPrice(item) {
    var p = product(item.id);
    return p.price + (item.printName || item.printNumber ? (S.printingFee || 0) : 0);
  }

  function addToCart(item) {
    item.qty = Math.max(1, Math.min(20, parseInt(item.qty, 10) || 1));
    item.key = [item.id, item.size || '', item.printName || '', item.printNumber || ''].join('|');
    var existing = cart.filter(function (c) { return c.key === item.key; })[0];
    if (existing) existing.qty = Math.min(20, existing.qty + item.qty);
    else cart.push(item);
    saveCart();
    toast(t('store.added'));
    bump();
  }

  function bump() {
    var b = document.querySelector('.cart-btn');
    if (!b) return;
    b.classList.remove('is-bumped'); void b.offsetWidth; b.classList.add('is-bumped');
  }

  function cartCount() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function subtotal() { return cart.reduce(function (n, i) { return n + unitPrice(i) * i.qty; }, 0); }

  function renderDrawerShell() {
    var d = document.createElement('div');
    d.innerHTML =
      '<div class="drawer-backdrop" data-cart-close hidden></div>' +
      '<aside class="drawer" data-drawer aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">' +
        '<div class="drawer__head"><h2 id="cart-title" data-i18n="cart.title">' + t('cart.title') + '</h2>' +
        '<button type="button" class="icon-btn" data-cart-close data-i18n-attr="aria-label:nav.close" aria-label="' + t('nav.close') + '">' + icon('close') + '</button></div>' +
        '<div class="drawer__body" data-cart-body></div>' +
      '</aside>';
    while (d.firstChild) document.body.appendChild(d.firstChild);

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cart-open]')) { openCart(true); return; }
      if (e.target.closest('[data-cart-close]')) { openCart(false); return; }
      var q = e.target.closest('[data-qty]');
      if (q) {
        var it = cart[+q.getAttribute('data-index')];
        if (!it) return;
        it.qty += +q.getAttribute('data-qty');
        if (it.qty < 1) cart.splice(+q.getAttribute('data-index'), 1);
        it.qty = Math.min(20, it.qty);
        saveCart();
        return;
      }
      var rm = e.target.closest('[data-remove]');
      if (rm) { cart.splice(+rm.getAttribute('data-remove'), 1); saveCart(); return; }
      var send = e.target.closest('[data-send]');
      if (send) { sendOrder(send.getAttribute('data-send')); }
    });
    document.addEventListener('change', function (e) {
      if (e.target.name === 'method') { formState.method = e.target.value; renderTotals(); }
    });
    document.addEventListener('input', function (e) {
      if (e.target.closest('[data-checkout]') && e.target.name) formState[e.target.name] = e.target.value;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { openCart(false); toggleMenuIfOpen(); }
    });
  }

  function toggleMenuIfOpen() {
    var nav = document.querySelector('[data-mobile-nav]');
    if (nav && !nav.hidden) toggleMenu(false);
  }

  var lastFocus = null;
  function openCart(open) {
    var drawer = document.querySelector('[data-drawer]');
    var bd = document.querySelector('.drawer-backdrop');
    if (!drawer) return;
    if (open) { lastFocus = document.activeElement; toggleMenuIfOpen(); }
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    bd.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
    if (open) drawer.focus();
    else if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var formState = { name: '', phone: '', city: '', method: 'pickup', note: '' };

  function deliveryLine() {
    if (formState.method !== 'delivery') return { value: 0, label: t('cart.free') };
    return S.deliveryFee ? { value: S.deliveryFee, label: money(S.deliveryFee) } : { value: 0, label: t('cart.tbc') };
  }

  function renderTotals() {
    var el = document.querySelector('[data-totals]');
    if (!el) return;
    var d = deliveryLine();
    el.innerHTML =
      '<div><span>' + t('cart.subtotal') + '</span><span>' + money(subtotal()) + '</span></div>' +
      '<div><span>' + t('cart.delivery') + '</span><span>' + d.label + '</span></div>' +
      '<div class="totals__grand"><span>' + t('cart.total') + '</span><span>' + money(subtotal() + d.value) + '</span></div>';
  }

  function renderCart() {
    var count = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(function (c) { c.textContent = count; c.hidden = count === 0; });
    var body = document.querySelector('[data-cart-body]');
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty"><img src="img/logo-crest.png" alt="" width="64" height="90"><p>' + t('cart.empty') + '</p>' +
        (page !== 'store' ? '<a class="btn" href="boutique.html">' + t('hero.ctaShop') + '</a>' : '') + '</div>';
      return;
    }
    var items = cart.map(function (it, i) {
      var p = product(it.id);
      var meta = [];
      if (it.size) meta.push(esc(optName(p)) + ' : ' + esc(optLabel(p, it.size)));
      if (it.printName || it.printNumber) meta.push(t('order.flocage') + ' : ' + esc([it.printName, it.printNumber].filter(Boolean).join(' #')));
      return '<li class="cart-item">' +
        '<img src="' + mainImage(p) + '" alt="">' +
        '<div class="cart-item__info"><strong>' + esc(tr(p.name)) + '</strong>' +
          (meta.length ? '<small>' + meta.join(' · ') + '</small>' : '') +
          '<div class="cart-item__row"><div class="qty">' +
            '<button type="button" data-qty="-1" data-index="' + i + '" aria-label="−">−</button><span>' + it.qty + '</span>' +
            '<button type="button" data-qty="1" data-index="' + i + '" aria-label="+">+</button></div>' +
            '<span class="cart-item__price">' + money(unitPrice(it) * it.qty) + '</span></div>' +
        '</div>' +
        '<button type="button" class="icon-btn icon-btn--sm" data-remove="' + i + '" aria-label="' + t('cart.remove') + '">' + icon('trash') + '</button>' +
      '</li>';
    }).join('');

    function field(name, label, type, req) {
      return '<label class="field"><span>' + label + (req ? ' *' : '') + '</span><input name="' + name + '" type="' + type + '" value="' + esc(formState[name]) + '"' +
        (req ? ' required' : '') + (type === 'tel' ? ' autocomplete="tel" inputmode="tel"' : name === 'name' ? ' autocomplete="name"' : '') + '></label>';
    }

    body.innerHTML =
      '<ul class="cart-list">' + items + '</ul>' +
      '<div class="totals" data-totals></div>' +
      '<form class="checkout" data-checkout novalidate>' +
        '<h3>' + t('checkout.title') + '</h3>' +
        field('name', t('checkout.name'), 'text', true) +
        field('phone', t('checkout.phone'), 'tel', true) +
        field('city', t('checkout.city'), 'text', false) +
        '<fieldset class="choice"><legend>' + t('checkout.method') + '</legend>' +
          '<label><input type="radio" name="method" value="pickup"' + (formState.method === 'pickup' ? ' checked' : '') + '> ' + t('checkout.pickup') + '</label>' +
          '<label><input type="radio" name="method" value="delivery"' + (formState.method === 'delivery' ? ' checked' : '') + '> ' + t('checkout.delivery') + '</label>' +
        '</fieldset>' +
        '<label class="field"><span>' + t('checkout.note') + '</span><textarea name="note" rows="2">' + esc(formState.note) + '</textarea></label>' +
        '<p class="checkout__error" data-checkout-error hidden></p>' +
        (S.whatsapp ? '<button type="button" class="btn btn--wa btn--block" data-send="wa">' + icon('wa') + t('checkout.whatsapp') + '</button>' : '') +
        '<button type="button" class="btn btn--block' + (S.whatsapp ? ' btn--ghost' : '') + '" data-send="email">' + icon('mail') + t('checkout.email') + '</button>' +
        '<p class="checkout__info">' + t('checkout.info') + '</p>' +
      '</form>';
    renderTotals();
  }

  function orderText() {
    var lines = [t('order.hello'), ''];
    cart.forEach(function (it) {
      var p = product(it.id);
      var l = '• ' + it.qty + ' × ' + tr(p.name);
      if (it.size) l += ' (' + optName(p) + ' ' + optLabel(p, it.size) + ')';
      if (it.printName || it.printNumber) l += ' — ' + t('order.flocage') + ': ' + [it.printName, it.printNumber].filter(Boolean).join(' #');
      l += ' — ' + money(unitPrice(it) * it.qty);
      lines.push(l);
    });
    var d = deliveryLine();
    lines.push('', t('cart.delivery') + ': ' + (formState.method === 'delivery' ? t('checkout.delivery') + ' (' + d.label + ')' : t('checkout.pickup')));
    lines.push(t('cart.total') + ': ' + money(subtotal() + d.value), '');
    lines.push(t('order.customer') + ': ' + formState.name);
    lines.push(t('checkout.phone') + ': ' + formState.phone);
    if (formState.city) lines.push(t('checkout.city') + ': ' + formState.city);
    if (formState.note) lines.push(t('checkout.note') + ': ' + formState.note);
    return lines.join('\n');
  }

  function sendOrder(channel) {
    var err = document.querySelector('[data-checkout-error]');
    if (!formState.name.trim() || !formState.phone.trim()) {
      err.textContent = t('checkout.required');
      err.hidden = false;
      var first = document.querySelector('[data-checkout] input[name="' + (!formState.name.trim() ? 'name' : 'phone') + '"]');
      if (first) first.focus();
      return;
    }
    err.hidden = true;
    var text = orderText();
    if (channel === 'wa' && S.whatsapp) {
      window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    } else {
      location.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent(t('order.subject') + ' — ' + formState.name) + '&body=' + encodeURIComponent(text);
    }
  }

  /* ---------- Init ---------- */
  renderHeader();
  renderFooter();
  renderDrawerShell();
  bindLayout();
  I.apply();
  renderCart();

  window.USA = {
    data: DATA, t: t, tr: tr, esc: esc, money: money, icon: icon, product: product,
    joinHref: joinHref, optValue: optValue, optLabel: optLabel, optName: optName, mainImage: mainImage,
    addToCart: addToCart, openCart: openCart, toast: toast
  };
})();
