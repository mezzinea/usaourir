/*
 * US AOURIR — shop components: product cards, product dialog (size, quantity,
 * printing with live jersey-back preview) and the size guide.
 * Used by the homepage (featured products) and the shop page. Requires js/app.js.
 */
(function () {
  'use strict';

  var U = window.USA;
  var t = U.t, tr = U.tr, esc = U.esc;
  var D = U.data, S = D.settings;

  var PEN = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var RULER = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15L15 3l6 6L9 21zM7 11l2 2M10 8l2 2M13 5l2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  function category(id) { return D.categories.filter(function (c) { return c.id === id; })[0]; }

  /* ---------- Jersey back preview (inline SVG) ---------- */
  var JERSEY = 'M130 70 L170 52 Q200 66 230 52 L270 70 L330 110 L305 165 L275 150 L275 340 Q200 352 125 340 L125 150 L95 165 L70 110 Z';
  var clipN = 0;
  function jerseyBack(kitKey, name, number) {
    var k = (D.kits && D.kits[kitKey]) || { body: '#0E773F', trim: '#E1C257', text: '#E1C257' };
    var cid = 'jclip' + (++clipN);
    var stripe = k.stripe
      ? '<clipPath id="' + cid + '"><path d="' + JERSEY + '"/></clipPath><g clip-path="url(#' + cid + ')">' +
          '<path d="M296 176 L322 182 L246 360 L220 360 Z" fill="' + k.stripe[0] + '"/>' +
          '<path d="M327 183 L337 185 L261 360 L251 360 Z" fill="' + k.stripe[1] + '"/></g>'
      : '';
    var empty = !name && !number;
    var nm = esc((name || t('store.printName')).toUpperCase());
    var num = esc(number || '10');
    var fit = nm.length > 7 ? ' textLength="150" lengthAdjust="spacingAndGlyphs"' : '';
    var op = empty ? ' opacity=".35"' : '';
    return '<svg class="jersey-back" viewBox="0 0 400 400" role="img" aria-label="' + esc(t('store.preview')) + '">' +
      '<path d="' + JERSEY + '" fill="' + k.body + '" stroke="#0D1B0C" stroke-opacity=".15" stroke-width="3"/>' +
      stripe +
      '<path d="M170 52 Q200 66 230 52" fill="none" stroke="' + k.trim + '" stroke-width="8"/>' +
      '<path d="M95 165 L70 110 L78 104 L103 160 Z M305 165 L330 110 L322 104 L297 160 Z" fill="' + k.trim + '"/>' +
      '<g fill="' + k.text + '"' + op + ' font-family="Roboto Condensed, Arial Narrow, Arial, sans-serif" font-weight="800" text-anchor="middle">' +
        '<text x="200" y="138" font-size="32" letter-spacing="3"' + fit + '>' + nm + '</text>' +
        '<text x="200" y="285" font-size="140">' + num + '</text>' +
      '</g></svg>';
  }

  /* ---------- Product card ---------- */
  function card(p) {
    var badge = p.badge ? '<span class="badge badge--' + p.badge + '">' + t('badge.' + p.badge) + '</span>' : '';
    var flag = p.customizable ? '<span class="card__flag" title="' + esc(t('store.customizable')) + '">' + PEN + '<span>' + t('store.customizable') + '</span></span>' : '';
    var cat = category(p.category);
    return '<article class="card">' +
      '<button type="button" class="card__media" data-product="' + p.id + '" aria-label="' + esc(tr(p.name)) + '">' +
        badge + '<img src="' + U.mainImage(p) + '" alt="" loading="lazy">' + flag +
      '</button>' +
      '<div class="card__body">' +
        (cat ? '<small class="card__cat">' + esc(tr(cat.name)) + '</small>' : '') +
        '<h3><button type="button" data-product="' + p.id + '">' + esc(tr(p.name)) + '</button></h3>' +
        '<div class="card__foot"><span class="price">' + U.money(p.price) + '</span>' +
        '<button type="button" class="card__cart" data-quick="' + p.id + '" aria-label="' + esc(t('store.add') + ' — ' + tr(p.name)) + '" title="' + esc(t('store.add')) + '">' + U.icon('cart') + '</button></div>' +
      '</div>' +
    '</article>';
  }

  /* ---------- Product dialog ---------- */
  var dlg = document.createElement('dialog');
  dlg.className = 'pdialog';
  document.body.appendChild(dlg);
  var current = null;

  function showDialog(d) {
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
    document.body.classList.add('no-scroll');
  }
  function closeDialog(d) {
    if (d.open && typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }

  function open(id) {
    var p = U.product(id);
    if (!p) return;
    current = p;
    var cat = category(p.category);
    var hasPreview = p.customizable && p.kit;
    var sizes = p.sizes.length
      ? '<fieldset class="sizes"><legend><span>' + esc(U.optName(p)) + '</span>' +
          (p.optionLabel ? '' : '<button type="button" class="link-btn" data-size-guide="' + (p.kids ? 'kids' : 'adult') + '">' + RULER + t('size.guide') + '</button>') + '</legend>' +
          '<div class="sizes__list">' + p.sizes.map(function (s) {
            return '<label><input type="radio" name="size" value="' + esc(U.optValue(s)) + '"><span>' + esc(tr(s)) + '</span></label>';
          }).join('') + '</div></fieldset>'
      : '<p class="muted">' + t('store.oneSize') + '</p>';
    var print = p.customizable
      ? '<fieldset class="print"><legend>' + PEN + t('store.print') + ' <small>' + t('store.printFee', { fee: U.money(S.printingFee) }) + '</small></legend>' +
          '<label class="field"><span>' + t('store.printName') + '</span><input name="printName" maxlength="12" autocomplete="off" placeholder="' + esc(t('studio.namePh')) + '"></label>' +
          '<label class="field field--num"><span>' + t('store.printNumber') + '</span><input name="printNumber" inputmode="numeric" maxlength="2" pattern="[0-9]*" autocomplete="off" placeholder="10"></label>' +
        '</fieldset>'
      : '';
    var imgs = p.images && p.images.length ? p.images : [U.mainImage(p)];
    var gallery =
      '<div class="gallery" data-front>' +
        '<img class="gallery__main" data-main src="' + imgs[0] + '" alt="' + esc(tr(p.name)) + '">' +
        (imgs.length > 1 ? '<div class="gallery__thumbs">' + imgs.map(function (src, i) {
          return '<button type="button" data-thumb="' + src + '" aria-label="' + (i + 1) + '/' + imgs.length + '" aria-current="' + (i === 0) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
        }).join('') + '</div>' : '') +
      '</div>';
    var media = '<div class="pdialog__media">' +
      (hasPreview
        ? '<div class="viewtabs" role="tablist">' +
            '<button type="button" role="tab" aria-selected="true" data-view="front">' + t('store.view') + '</button>' +
            '<button type="button" role="tab" aria-selected="false" data-view="back">' + t('store.preview') + '</button>' +
          '</div>' + gallery + '<div data-back hidden>' + jerseyBack(p.kit, '', '') + '</div>'
        : gallery) +
      '</div>';

    dlg.innerHTML =
      '<form method="dialog" class="pdialog__inner" data-pform novalidate>' +
        '<button type="button" class="icon-btn pdialog__close" data-dclose aria-label="' + t('nav.close') + '">' + U.icon('close') + '</button>' +
        media +
        '<div class="pdialog__info">' +
          '<p class="pdialog__crumb">' + (cat ? esc(tr(cat.name)) : '') + (p.badge ? ' <span class="badge badge--' + p.badge + '">' + t('badge.' + p.badge) + '</span>' : '') + '</p>' +
          '<h2>' + esc(tr(p.name)) + '</h2>' +
          '<p class="price price--lg" data-dprice>' + U.money(p.price) + '</p>' +
          '<p class="pdialog__desc">' + esc(tr(p.desc)) + '</p>' +
          sizes + print +
          '<div class="pdialog__buy">' +
            '<label class="qty--input"><span class="sr-only">' + t('store.qty') + '</span><input name="qty" type="number" min="1" max="20" value="1"></label>' +
            '<button type="submit" class="btn btn--lg btn--dark">' + U.icon('cart') + t('store.add') + '</button>' +
          '</div>' +
          '<p class="form-error" data-derror hidden></p>' +
          '<ul class="pdialog__perks"><li>' + t('service.1') + '</li><li>' + t('service.2') + '</li></ul>' +
        '</div>' +
      '</form>';
    showDialog(dlg);
  }

  function setView(view) {
    var front = dlg.querySelector('[data-front]'), back = dlg.querySelector('[data-back]');
    if (!front || !back) return;
    front.hidden = view !== 'front';
    back.hidden = view !== 'back';
    dlg.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-view') === view)); });
  }

  function updatePrint() {
    var f = dlg.querySelector('[data-pform]');
    if (!f || !f.printName) return;
    var name = f.printName.value.trim(), num = f.printNumber.value.trim();
    var back = dlg.querySelector('[data-back]');
    if (back) { back.innerHTML = jerseyBack(current.kit, name, num); if (name || num) setView('back'); }
    dlg.querySelector('[data-dprice]').innerHTML = U.money(current.price + (name || num ? S.printingFee : 0)) +
      (name || num ? ' <small>(' + t('store.printFee', { fee: U.money(S.printingFee) }) + ')</small>' : '');
  }

  dlg.addEventListener('close', function () { document.body.classList.remove('no-scroll'); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-dclose]')) { closeDialog(dlg); return; }
    var v = e.target.closest('[data-view]');
    if (v) { setView(v.getAttribute('data-view')); return; }
    var th = e.target.closest('[data-thumb]');
    if (th) {
      dlg.querySelector('[data-main]').src = th.getAttribute('data-thumb');
      dlg.querySelectorAll('[data-thumb]').forEach(function (b) { b.setAttribute('aria-current', String(b === th)); });
    }
  });
  dlg.addEventListener('change', function (e) {
    if (e.target.name !== 'size') return;
    dlg.querySelector('[data-derror]').hidden = true;
    dlg.querySelector('.sizes').classList.remove('is-invalid');
  });
  dlg.addEventListener('input', function (e) {
    if (e.target.name === 'printNumber') e.target.value = e.target.value.replace(/\D/g, '');
    if (e.target.name === 'printName' || e.target.name === 'printNumber') updatePrint();
  });
  dlg.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var size = f.querySelector('input[name="size"]:checked');
    if (current.sizes.length && !size) {
      var err = f.querySelector('[data-derror]');
      err.textContent = t('store.chooseSize'); err.hidden = false;
      f.querySelector('.sizes').classList.add('is-invalid');
      f.querySelector('.sizes input').focus();
      return;
    }
    U.addToCart({
      id: current.id,
      size: size ? size.value : '',
      qty: f.qty.value,
      printName: f.printName ? f.printName.value.trim().toUpperCase() : '',
      printNumber: f.printNumber ? f.printNumber.value.trim() : ''
    });
    closeDialog(dlg);
  });

  /* ---------- Size guide ---------- */
  var sg = document.createElement('dialog');
  sg.className = 'sgdialog';
  document.body.appendChild(sg);

  function openSizeGuide(which) {
    var G = D.sizeGuide || { adult: [], kids: [] };
    var adult = '<table><thead><tr><th>' + t('size.size') + '</th><th>' + t('size.chest') + '</th><th>' + t('size.length') + '</th></tr></thead><tbody>' +
      G.adult.map(function (r) { return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table>';
    var kids = '<table><thead><tr><th>' + t('size.size') + '</th><th>' + t('size.height') + '</th><th>' + t('size.chest') + '</th><th>' + t('size.length') + '</th></tr></thead><tbody>' +
      G.kids.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('') + '</tbody></table>';
    sg.innerHTML =
      '<div class="sgdialog__inner">' +
        '<div class="sgdialog__head"><h2>' + t('size.guide') + '</h2><button type="button" class="icon-btn" data-sgclose aria-label="' + t('nav.close') + '">' + U.icon('close') + '</button></div>' +
        (!G.kids || !G.kids.length ? '' : '<div class="viewtabs viewtabs--light" role="tablist">' +
          '<button type="button" role="tab" data-sgtab="adult" aria-selected="' + (which !== 'kids') + '">' + t('size.adult') + '</button>' +
          '<button type="button" role="tab" data-sgtab="kids" aria-selected="' + (which === 'kids') + '">' + t('size.kids') + '</button>' +
        '</div>') +
        '<div data-sgpanel="adult"' + (which === 'kids' ? ' hidden' : '') + '>' + adult + '</div>' +
        '<div data-sgpanel="kids"' + (which === 'kids' ? '' : ' hidden') + '>' + kids + '</div>' +
        '<p class="muted">' + t('size.note') + '</p>' +
      '</div>';
    showDialog(sg);
  }
  sg.addEventListener('click', function (e) {
    if (e.target === sg || e.target.closest('[data-sgclose]')) { closeDialog(sg); return; }
    var tb = e.target.closest('[data-sgtab]');
    if (tb) {
      var w = tb.getAttribute('data-sgtab');
      sg.querySelectorAll('[data-sgtab]').forEach(function (b) { b.setAttribute('aria-selected', String(b === tb)); });
      sg.querySelectorAll('[data-sgpanel]').forEach(function (p) { p.hidden = p.getAttribute('data-sgpanel') !== w; });
    }
  });
  sg.addEventListener('close', function () { if (!dlg.open) document.body.classList.remove('no-scroll'); });

  /* ---------- Global triggers ---------- */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-size-guide]');
    if (g) { openSizeGuide(g.getAttribute('data-size-guide')); return; }
    var b = e.target.closest('[data-product]');
    if (b) { open(b.getAttribute('data-product')); return; }
    var q = e.target.closest('[data-quick]');
    if (q) {
      var p = U.product(q.getAttribute('data-quick'));
      if (p.sizes.length || p.customizable) open(p.id);
      else U.addToCart({ id: p.id, size: '', qty: 1 });
    }
  });

  U.card = card;
  U.openProduct = open;
  U.jerseyBack = jerseyBack;
  U.openSizeGuide = openSizeGuide;
})();
