/* ============================================================
   Mực Tím — interactivity
   ============================================================ */
(function () {
  'use strict';

  /* if a product photo fails, retry once with a very common tag, then fall back to emoji */
  window.loremFallback = function (img) {
    if (img.dataset.fb) { img.remove(); return; }
    img.dataset.fb = '1';
    img.src = 'https://loremflickr.com/600/600/stationery,school,supplies/all?lock=' + (Math.floor(Math.random() * 900) + 10);
  };

  /* ---------- product data ---------- */
  const PRODUCTS = [
    { id: 1,  name: 'Bộ bút gel 12 màu pastel', cat: 'but',    catLabel: 'Bút & Mực', em: '🖊️', kw: 'pen,stationery,supplies',        price: 89000,  old: 120000, rate: 4.9, sold: 1200, tag: 'sale' },
    { id: 2,  name: 'Sổ tay bìa cứng hoạ tiết',  cat: 'so',     catLabel: 'Sổ & Vở',   em: '📒', kw: 'notebook,stationery,supplies',   price: 65000,  old: null,   rate: 4.8, sold: 860,  tag: 'new' },
    { id: 3,  name: 'Hộp màu nước 24 ô',          cat: 'mau',    catLabel: 'Màu vẽ',    em: '🎨', kw: 'watercolor,paint,art',          price: 159000, old: 199000, rate: 5.0, sold: 540,  tag: 'sale' },
    { id: 4,  name: 'Balo chống gù Galaxy',       cat: 'balo',   catLabel: 'Balo & Túi',em: '🎒', kw: 'backpack,bag,school',           price: 349000, old: 459000, rate: 4.9, sold: 320,  tag: 'sale' },
    { id: 5,  name: 'Bộ thước kẻ 4 món',          cat: 'dungcu', catLabel: 'Dụng cụ',   em: '📐', kw: 'ruler,stationery,supplies',     price: 39000,  old: null,   rate: 4.7, sold: 2100, tag: null },
    { id: 6,  name: 'Bút chì gỗ 2B (hộp 12)',     cat: 'but',    catLabel: 'Bút & Mực', em: '✏️', kw: 'pencil,stationery,supplies',    price: 45000,  old: 55000,  rate: 4.9, sold: 3400, tag: 'sale' },
    { id: 7,  name: 'Vở ô ly 200 trang',          cat: 'so',     catLabel: 'Sổ & Vở',   em: '📓', kw: 'notebook,paper,stationery',     price: 18000,  old: null,   rate: 4.8, sold: 5600, tag: null },
    { id: 8,  name: 'Bộ sáp màu 36 cây',          cat: 'mau',    catLabel: 'Màu vẽ',    em: '🖍️', kw: 'crayon,color,art',              price: 99000,  old: 135000, rate: 4.9, sold: 780,  tag: 'sale' },
    { id: 9,  name: 'Túi đựng bút hình thú',      cat: 'balo',   catLabel: 'Balo & Túi',em: '👝', kw: 'pencilcase,stationery,supplies',price: 59000,  old: null,   rate: 4.7, sold: 990,  tag: 'new' },
    { id: 10, name: 'Gọt bút chì mini dễ thương', cat: 'dungcu', catLabel: 'Dụng cụ',   em: '✂️', kw: 'sharpener,pencil,stationery',   price: 25000,  old: 32000,  rate: 4.6, sold: 1500, tag: 'sale' },
    { id: 11, name: 'Bút highlight 6 màu neon',   cat: 'but',    catLabel: 'Bút & Mực', em: '🌈', kw: 'marker,highlighter,stationery', price: 72000,  old: null,   rate: 5.0, sold: 1100, tag: 'new' },
    { id: 12, name: 'Combo planner tựu trường',   cat: 'so',     catLabel: 'Sổ & Vở',   em: '📔', kw: 'planner,notebook,stationery',   price: 129000, old: 179000, rate: 4.9, sold: 410,  tag: 'sale' },
  ];

  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- render products ---------- */
  const grid = $('#productsGrid');
  function cardHTML(p) {
    const tag = p.tag === 'sale' ? `<span class="product-tag">SALE</span>`
              : p.tag === 'new'  ? `<span class="product-tag new">MỚI</span>` : '';
    const old = p.old ? `<span class="old">${fmt(p.old)}</span>` : '';
    return `
      <article class="product reveal" data-cat="${p.cat}" data-reveal>
        <div class="product-media" style="background:linear-gradient(150deg,${tint(p.cat)})">
          ${tag}
          <button class="product-fav" aria-label="Yêu thích" data-fav="${p.id}">🤍</button>
          <span class="em">${p.em}</span>
          <img class="product-img" src="https://loremflickr.com/600/600/${p.kw}/all?lock=${p.id}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer" onload="this.classList.add('loaded')" onerror="loremFallback(this)">
        </div>
        <div class="product-body">
          <span class="product-cat">${p.catLabel}</span>
          <h3 class="product-name">${p.name}</h3>
          <span class="product-rate">⭐ <b>${p.rate}</b> · ${p.sold.toLocaleString('vi-VN')} đã bán</span>
          <div class="product-foot">
            <div class="product-price"><span class="now">${fmt(p.price)}</span>${old}</div>
            <button class="add-btn" aria-label="Thêm vào giỏ" data-add="${p.id}">+</button>
          </div>
        </div>
      </article>`;
  }
  function tint(cat) {
    const m = {
      but: '#fff0f7,#ffe0ee', so: '#eef0ff,#e0e6ff', mau: '#fff7e0,#ffeec2',
      balo: '#e3fff7,#ccffee', dungcu: '#f3eaff,#e6d8ff'
    };
    return m[cat] || '#f6f1ff,#ece2ff';
  }
  grid.innerHTML = PRODUCTS.map(cardHTML).join('');

  /* ---------- filters ---------- */
  $('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    $$('.chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.product', grid).forEach((card) => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.display = show ? '' : 'none';
      if (show) { card.classList.remove('in'); requestAnimationFrame(() => observer.observe(card)); }
    });
  });

  /* ---------- favourites ---------- */
  grid.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      fav.classList.toggle('on');
      fav.textContent = fav.classList.contains('on') ? '💜' : '🤍';
    }
  });

  /* ---------- cart ---------- */
  const cart = new Map(); // id -> {product, qty}
  const cartItemsEl = $('#cartItems');
  const cartCountEl = $('#cartCount');
  const cartTotalEl = $('#cartTotal');

  function addToCart(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const it = cart.get(id);
    cart.set(id, { product: p, qty: (it ? it.qty : 0) + 1 });
    renderCart();
    bumpCount();
    toast(`Đã thêm "${p.name}" vào giỏ 🛒`);
  }
  function changeQty(id, delta) {
    const it = cart.get(id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart.delete(id);
    renderCart();
  }
  function removeItem(id) { cart.delete(id); renderCart(); }

  function renderCart() {
    let totalQty = 0, total = 0;
    cart.forEach((it) => { totalQty += it.qty; total += it.qty * it.product.price; });
    cartCountEl.textContent = totalQty;
    cartCountEl.classList.toggle('empty', totalQty === 0);

    if (cart.size === 0) {
      cartItemsEl.innerHTML = `<div class="cart-empty"><span class="big-emo">🛒</span>Giỏ hàng đang trống.<br>Hãy chọn vài món đồ xinh nhé!</div>`;
    } else {
      cartItemsEl.innerHTML = Array.from(cart.values()).map((it) => `
        <div class="cart-item">
          <div class="ci-em">${it.product.em}</div>
          <div class="ci-info">
            <div class="ci-name">${it.product.name}</div>
            <div class="ci-price">${fmt(it.product.price)}</div>
            <div class="qty">
              <button data-dec="${it.product.id}" aria-label="Giảm">−</button>
              <span>${it.qty}</span>
              <button data-inc="${it.product.id}" aria-label="Tăng">+</button>
            </div>
          </div>
          <button class="ci-remove" data-rm="${it.product.id}" aria-label="Xoá">🗑️</button>
        </div>`).join('');
    }
    cartTotalEl.textContent = fmt(total);
  }

  function bumpCount() {
    cartCountEl.classList.add('bump');
    setTimeout(() => cartCountEl.classList.remove('bump'), 260);
  }

  grid.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) addToCart(Number(add.dataset.add));
  });
  cartItemsEl.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const rm = e.target.closest('[data-rm]');
    if (inc) changeQty(Number(inc.dataset.inc), +1);
    if (dec) changeQty(Number(dec.dataset.dec), -1);
    if (rm) removeItem(Number(rm.dataset.rm));
  });

  /* cart drawer open/close */
  const drawer = $('#cartDrawer');
  const overlay = $('#cartOverlay');
  function openCart() { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', () => {
    if (cart.size === 0) { toast('Giỏ hàng đang trống nhé! 😊'); return; }
    toast('🎉 Đây là website mẫu — cảm ơn bạn đã trải nghiệm!');
    closeCart();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

  renderCart();

  /* ---------- toast ---------- */
  let toastTimer;
  const toastEl = $('#toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  /* ---------- reveal on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach((el) => observer.observe(el));

  /* ---------- animated counters ---------- */
  const counters = $$('.count');
  const cObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = Number(el.dataset.target);
      const dur = 1400;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('vi-VN');
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('vi-VN');
      }
      requestAnimationFrame(step);
      cObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cObserver.observe(c));

  /* ---------- header scrolled + scroll progress + back top ---------- */
  const header = $('#siteHeader');
  const progress = $('#scrollProgress');
  const backTop = $('#backTop');
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    backTop.classList.toggle('show', y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- mobile nav ---------- */
  const burger = $('#burger');
  const nav = $('#mainNav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- countdown (resets daily) ---------- */
  const cdH = $('#cdH'), cdM = $('#cdM'), cdS = $('#cdS');
  function tickCountdown() {
    const now = new Date();
    const end = new Date(now); end.setHours(23, 59, 59, 999);
    let diff = Math.max(0, Math.floor((end - now) / 1000));
    const h = Math.floor(diff / 3600); diff %= 3600;
    const m = Math.floor(diff / 60); const s = diff % 60;
    cdH.textContent = String(h).padStart(2, '0');
    cdM.textContent = String(m).padStart(2, '0');
    cdS.textContent = String(s).padStart(2, '0');
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- newsletter ---------- */
  const newsForm = $('#newsForm');
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#newsEmail').value = '';
    $('#newsOk').hidden = false;
    toast('🎈 Đăng ký thành công! Voucher 30K đang chờ bạn.');
  });

  /* ---------- subtle parallax for hero stickers ---------- */
  const stickers = $$('.sticker');
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      stickers.forEach((s, i) => {
        const depth = (i + 1) * 6;
        s.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    }, { passive: true });
  }
})();
