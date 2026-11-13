/*
 * US AOURIR — shop page: promo banner, one product rail per category (with page
 * counter), printing studio, category tiles, catalogue (filter / search / sort),
 * info cards, services and FAQ.
 * Supports ?cat=maillots and ?product=<id> (opens that product directly).
 */
(function () {
  'use strict';

  var U = window.USA;
  var t = U.t, tr = U.tr, esc = U.esc;
  var D = U.data, S = D.settings;
  var params = new URLSearchParams(location.search);
  var state = { cat: params.get('cat') || 'all', q: '', sort: 'reco' };
  if (state.cat !== 'all' && !D.categories.some(function (c) { return c.id === state.cat; })) state.cat = 'all';
  var $ = function (s) { return document.querySelector(s); };

  function category(id) { return D.categories.filter(function (c) { return c.id === id; })[0]; }
  function kitProducts() { return D.products.filter(function (p) { return p.kit && p.customizable; }); }

  /* ---------- Promo banner: repeated text band ---------- */
  function renderBand() {
    var el = $('[data-banner-band]');
    if (!el) return;
    var word = '<span>' + esc(t('banner.band')) + '</span>';
    el.innerHTML = new Array(9).join(word);
  }

  /* ---------- Collection rails (one per category) with page counter ---------- */
  var CHEV_L = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV_R = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function renderRails() {
    document.querySelectorAll('[data-rail-cat]').forEach(function (sec) {
      var c = category(sec.getAttribute('data-rail-cat'));
      if (!c) { sec.hidden = true; return; }
      var list = D.products.filter(function (p) { return p.category === c.id; });
      sec.innerHTML =
        '<div class="container"><h2 class="shop-title">' + esc(tr(c.name)) + '</h2></div>' +
        '<div class="shop-rail__track" data-track>' + list.map(U.card).join('') + '</div>' +
        '<div class="shop-rail__foot">' +
          '<div class="pager"><button type="button" class="pager__btn" data-pg="-1" aria-label="' + esc(t('shop.prev')) + '">' + CHEV_L + '</button>' +
          '<span class="pager__count" data-pg-count>1/1</span>' +
          '<button type="button" class="pager__btn" data-pg="1" aria-label="' + esc(t('shop.next')) + '">' + CHEV_R + '</button></div>' +
          '<a class="btn btn--sm-pill" href="?cat=' + c.id + '#catalogue" data-cat-link="' + c.id + '">' + t('shop.viewAll') + '</a>' +
        '</div>';
      var track = sec.querySelector('[data-track]');
      track.addEventListener('scroll', function () { updatePager(sec); }, { passive: true });
      updatePager(sec);
    });
  }
  function pagesOf(track) { return Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05)); }
  function updatePager(sec) {
    var track = sec.querySelector('[data-track]');
    var pages = pagesOf(track);
    var maxScroll = track.scrollWidth - track.clientWidth;
    var page = Math.abs(track.scrollLeft) >= maxScroll - 4 ? pages : Math.min(pages, Math.round(Math.abs(track.scrollLeft) / track.clientWidth) + 1);
    sec.querySelector('[data-pg-count]').textContent = page + '/' + pages;
    sec.querySelector('.pager').hidden = pages < 2;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pg]');
    if (!b) return;
    var track = b.closest('.shop-rail').querySelector('[data-track]');
    var rtl = document.documentElement.dir === 'rtl' ? -1 : 1;
    track.scrollBy({ left: +b.getAttribute('data-pg') * rtl * track.clientWidth, behavior: 'smooth' });
  });
  window.addEventListener('resize', function () { document.querySelectorAll('[data-rail-cat]').forEach(updatePager); });

  /* ---------- Category tiles (image, label underneath) ---------- */
  function renderTiles() {
    $('[data-cat-tiles]').innerHTML = D.categories.map(function (c) {
      var n = D.products.filter(function (p) { return p.category === c.id; }).length;
      return '<a class="tile" href="?cat=' + c.id + '#catalogue" data-cat-link="' + c.id + '">' +
        '<span class="tile__img"><img src="' + c.image + '" alt="" loading="lazy"></span>' +
        '<span class="tile__label"><b>' + esc(tr(c.name)) + '</b><small>' + n + ' ' + esc(t('shop.items')) + '</small></span></a>';
    }).join('');
  }

  /* ---------- Printing studio ---------- */
  var studio = { id: (kitProducts()[0] || {}).id, name: '', number: '', size: '' };
  function renderStudio() {
    var p = U.product(studio.id);
    if (!p) { $('#flocage').hidden = true; return; }
    $('[data-studio-kits]').closest('fieldset').hidden = kitProducts().length < 2;
    $('[data-studio-kits]').innerHTML = kitProducts().map(function (kp) {
      var k = D.kits[kp.kit];
      return '<label class="kitopt"><input type="radio" name="kit" value="' + kp.id + '"' + (kp.id === studio.id ? ' checked' : '') + '>' +
        '<span><span class="swatch" style="background:' + k.body + ';border-color:' + k.trim + '"></span>' + esc(tr(k.name)) + '</span></label>';
    }).join('');
    if (!p.sizes.some(function (s) { return U.optValue(s) === studio.size; })) studio.size = '';
    $('[data-studio-sizes]').innerHTML = p.sizes.map(function (s) {
      var v = U.optValue(s);
      return '<label><input type="radio" name="ssize" value="' + esc(v) + '"' + (v === studio.size ? ' checked' : '') + '><span>' + esc(tr(s)) + '</span></label>';
    }).join('');
    updateStudio();
  }
  function updateStudio() {
    var p = U.product(studio.id);
    $('[data-studio-preview]').innerHTML = U.jerseyBack(p.kit, studio.name, studio.number) +
      '<p class="studio__caption">' + esc(tr(p.name)) + '</p>';
    var printed = studio.name || studio.number;
    $('[data-studio-total]').innerHTML = U.money(p.price + (printed ? S.printingFee : 0)) +
      (printed ? ' <small>' + t('store.printFee', { fee: U.money(S.printingFee) }) + '</small>' : '');
  }
  var sf = $('[data-studio]');
  sf.addEventListener('input', function (e) {
    if (e.target.name === 'number') e.target.value = e.target.value.replace(/\D/g, '');
    if (e.target.name === 'name') studio.name = e.target.value.trim().toUpperCase();
    if (e.target.name === 'number') studio.number = e.target.value.trim();
    updateStudio();
  });
  sf.addEventListener('change', function (e) {
    if (e.target.name === 'kit') { studio.id = e.target.value; renderStudio(); }
    if (e.target.name === 'ssize') { studio.size = e.target.value; $('[data-studio-error]').hidden = true; sf.querySelector('.sizes').classList.remove('is-invalid'); }
  });
  sf.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!studio.size) {
      var err = $('[data-studio-error]');
      err.textContent = t('store.chooseSize'); err.hidden = false;
      sf.querySelector('.sizes').classList.add('is-invalid');
      return;
    }
    U.addToCart({ id: studio.id, size: studio.size, qty: 1, printName: studio.name, printNumber: studio.number });
  });

  /* ---------- Catalogue ---------- */
  var SORTS = ['reco', 'new', 'priceAsc', 'priceDesc'];
  function renderToolbar() {
    var items = [{ id: 'all', label: t('store.all') }].concat(D.categories.map(function (c) { return { id: c.id, label: tr(c.name) }; }));
    $('[data-filters]').innerHTML = items.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (c.id === state.cat) + '">' + esc(c.label) + '</button>';
    }).join('');
    $('[data-sort]').innerHTML = SORTS.map(function (s) {
      return '<option value="' + s + '"' + (s === state.sort ? ' selected' : '') + '>' + t('sort.' + s) + '</option>';
    }).join('');
    var c = category(state.cat);
    $('[data-catalog-title]').textContent = c ? tr(c.name) : t('catalog.title');
    $('[data-crumb-current]').textContent = c ? tr(c.name) : t('store.all');
  }

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function renderGrid() {
    var inCat = D.products.filter(function (p) { return state.cat === 'all' || p.category === state.cat; });
    var q = norm(state.q.trim());
    var list = inCat.filter(function (p) {
      if (!q) return true;
      return [p.name.fr, p.name.ar, p.name.en, tr(p.desc)].some(function (x) { return x && norm(x).indexOf(q) > -1; });
    });
    var order = D.products.slice();
    list.sort(function (a, b) {
      if (state.sort === 'priceAsc') return a.price - b.price;
      if (state.sort === 'priceDesc') return b.price - a.price;
      if (state.sort === 'new') return (b.badge === 'new') - (a.badge === 'new') || order.indexOf(a) - order.indexOf(b);
      return order.indexOf(a) - order.indexOf(b);
    });
    $('[data-grid]').innerHTML = list.map(U.card).join('');
    $('[data-empty]').hidden = list.length > 0;
    $('[data-count]').textContent = t('catalog.count', { n: list.length, total: inCat.length });
  }

  function setCat(cat, scroll) {
    state.cat = cat;
    try {
      var u = new URL(location.href);
      if (cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', cat);
      u.searchParams.delete('product');
      history.replaceState(null, '', u.pathname + u.search + '#catalogue');
    } catch (err) { /* file:// or old browser */ }
    renderToolbar(); renderGrid();
    if (scroll) $('#catalogue').scrollIntoView({ behavior: 'smooth' });
  }

  $('[data-filters]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) setCat(b.getAttribute('data-cat'), false);
  });
  // Header menu, hero CTA and tiles filter in place instead of reloading.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cat-link]');
    if (!a) return;
    e.preventDefault();
    var nav = document.querySelector('[data-mobile-nav]');
    if (nav && !nav.hidden) document.querySelector('[data-menu-open]').click();
    setCat(a.getAttribute('data-cat-link'), true);
  });
  $('[data-search]').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(); });
  $('[data-sort]').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(); });

  /* ---------- Banner, services, FAQ ---------- */
  function renderExtras() {
    function contactHref(subject) {
      return S.whatsapp ? 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(subject)
        : 'mailto:' + S.email + '?subject=' + encodeURIComponent(subject);
    }
    $('[data-wa-link]').href = contactHref(t('group.title'));
    $('[data-wa-pickup]').href = contactHref(t('info.pickupTitle') + ' — US Aourir');
    var icons = ['<rect x="2" y="6" width="20" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
      '<path d="M3 10l9-6 9 6v10H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="2"/>',
      '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
      '<path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'];
    $('[data-services]').innerHTML = [1, 2, 3, 4].map(function (i) {
      return '<li><span class="services__icon"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + icons[i - 1] + '</svg></span>' +
        '<span><b>' + t('service.' + i) + '</b><small>' + t('service.' + i + 't', { fee: U.money(S.printingFee) }) + '</small></span></li>';
    }).join('');
    $('[data-faq]').innerHTML = (D.faq || []).map(function (f, i) {
      return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(tr(f.q)) + '</summary><p>' + esc(tr(f.a)) + '</p></details>';
    }).join('') + '<details><summary>' + t('size.guide') + '</summary><p><button type="button" class="link-btn" data-size-guide="adult">' + t('size.guide') + ' →</button></p></details>';
  }

  function renderAll() {
    renderBand(); renderRails(); renderTiles(); renderStudio(); renderToolbar(); renderGrid(); renderExtras();
  }
  renderAll();
  document.addEventListener('langchange', renderAll);

  var pid = params.get('product');
  if (pid && U.product(pid)) U.openProduct(pid);
})();
