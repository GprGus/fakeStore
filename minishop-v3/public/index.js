// ─── SVG CONSTANTS ───
const STAR_SVG = `<svg class="rating__star" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
const ICON_BAG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>`;
const ICON_TRASH = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;
const ICON_CAMERA = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>`;
const ICON_USER_LG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>`;
const ICON_RECEIPT = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`;

// ─── TOAST ───
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 2200);
}

// ─── RENDER STARS ───
function renderStars(rate) {
  const w = (rate / 5) * 100;
  let bg = '', fg = '';
  for (let i = 0; i < 5; i++) {
    bg += `<span class="rating__star--empty">${STAR_SVG}</span>`;
    fg += `<span class="rating__star--filled">${STAR_SVG}</span>`;
  }
  return `<div class="rating__stars"><div class="rating__stars-bg">${bg}</div><div class="rating__stars-fill" style="width:${w}%">${fg}</div></div>`;
}

// ─── PRODUCT LIST ───
class ProductList {
  constructor() { this.products = []; this.categories = []; this.currentCategory = 'All'; }

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      this.products = data.products || [];
      this.categories = [...new Set(this.products.map(p => p.category))].sort();
      this.renderFilters();
      this.renderProducts();
    } catch {
      document.getElementById('productGrid').innerHTML = `<li class="loading" style="color:var(--accent)">Failed to load products.</li>`;
    }
  }

  renderFilters() {
    const nav = document.getElementById('filters');
    nav.innerHTML = '';
    if (this.categories.length === 0) return;
    ['All', ...this.categories].forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-btn${cat === this.currentCategory ? ' active' : ''}`;
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        this.currentCategory = cat;
        nav.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.textContent === cat));
        this.renderProducts();
      });
      nav.appendChild(btn);
    });
  }

  renderProducts() {
    const grid = document.getElementById('productGrid');
    const list = this.currentCategory === 'All' ? this.products : this.products.filter(p => p.category === this.currentCategory);

    if (list.length === 0) {
      grid.innerHTML = `<li class="loading" style="color:var(--text-muted)">No products available yet.</li>`;
      return;
    }

    grid.innerHTML = '';
    list.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'product-card';
      li.style.animationDelay = `${i * 0.04}s`;
      const rate = p.rating?.rate || 0;
      const count = p.rating?.count || 0;
      const imgSrc = p.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0ece6" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%239e9892" font-size="12">No image</text></svg>';

      li.innerHTML = `
        <div class="product-card__image">
          <span class="product-card__category">${p.category}</span>
          <img src="${imgSrc}" alt="${p.title}" loading="lazy" />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${p.title}</h3>
          <div class="rating">${renderStars(rate)}<span class="rating__score">${rate}</span><span class="rating__count">(${count})</span></div>
        </div>
        <div class="product-card__footer">
          <span class="product-card__price">$${p.price.toFixed(2)}</span>
          <button class="add-btn">Add to Cart</button>
        </div>`;
      li.querySelector('.add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        cart.addItem(p);
        const b = e.currentTarget; b.textContent = 'Added!'; b.classList.add('added');
        setTimeout(() => { b.textContent = 'Add to Cart'; b.classList.remove('added'); }, 900);
      });
      li.addEventListener('click', () => openProductDetail(p._id));
      grid.appendChild(li);
    });
  }
}

// ─── SHOPPING CART ───
class ShoppingCart {
  static #inst;
  constructor() { this.items = []; this.total = 0; }
  static getInstance() { if (!ShoppingCart.#inst) ShoppingCart.#inst = new ShoppingCart(); return ShoppingCart.#inst; }

  #calc() { this.total = this.items.reduce((s, i) => s + i.product.price * i.quantity, 0); }

  addItem(product) {
    const pid = product._id || product.id;
    const ex = this.items.find(i => (i.product._id || i.product.id) === pid);
    if (ex) ex.quantity++; else this.items.push({ product, quantity: 1 });
    this.#calc(); this.render();
    showToast(`${product.title.length > 28 ? product.title.slice(0, 28) + '…' : product.title} added`);
  }

  changeQty(idx, d) {
    const it = this.items[idx]; if (!it) return;
    it.quantity += d; if (it.quantity <= 0) this.items.splice(idx, 1);
    this.#calc(); this.render();
  }

  removeItem(idx) { this.items.splice(idx, 1); this.#calc(); this.render(); }
  clear() { this.items = []; this.total = 0; this.render(); }
  get count() { return this.items.reduce((s, i) => s + i.quantity, 0); }

  render() {
    const badge = document.getElementById('cartBadge');
    badge.textContent = this.count;
    badge.classList.toggle('visible', this.count > 0);

    const body = document.getElementById('cartBody');
    body.innerHTML = this.items.length === 0
      ? `<div class="cart-empty">${ICON_BAG}<p>Your cart is empty</p></div>`
      : this.items.map((it, i) => {
        const imgSrc = it.product.image || '';
        return `
        <div class="cart-item">
          <div class="cart-item__image"><img src="${imgSrc}" alt="" /></div>
          <div class="cart-item__info">
            <div class="cart-item__title">${it.product.title}</div>
            <div class="cart-item__price">$${(it.product.price * it.quantity).toFixed(2)}</div>
            <div class="cart-item__controls">
              <button class="qty-btn" data-a="dec" data-i="${i}">−</button>
              <span class="cart-item__qty">${it.quantity}</span>
              <button class="qty-btn" data-a="inc" data-i="${i}">+</button>
              <button class="remove-btn" data-a="rm" data-i="${i}" aria-label="Remove">${ICON_TRASH}</button>
            </div>
          </div>
        </div>`;
      }).join('');

    body.onclick = (e) => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const i = +b.dataset.i;
      if (b.dataset.a === 'dec') this.changeQty(i, -1);
      else if (b.dataset.a === 'inc') this.changeQty(i, 1);
      else if (b.dataset.a === 'rm') this.removeItem(i);
    };

    const footer = document.getElementById('cartFooter');
    footer.innerHTML = `
      <div class="cart-total"><span class="cart-total__label">Total</span><span class="cart-total__value">$${this.total.toFixed(2)}</span></div>
      <div class="cart-actions">
        <button class="btn-secondary" id="btnClear">Clear</button>
        <button class="btn-primary" id="btnOrder"${!this.items.length ? ' disabled' : ''}>Place Order</button>
      </div>`;

    footer.querySelector('#btnClear').onclick = () => this.clear();
    footer.querySelector('#btnOrder').onclick = async () => {
      if (!this.items.length) return;
      if (!userMgr.isLoggedIn()) {
        closeDrawer('cart');
        setTimeout(() => userMgr.openDrawer('login'), 100);
        showToast('Sign in to place your order');
        return;
      }

      const phone = userMgr.user?.phone;
      if (!phone) {
        closeDrawer('cart');
        setTimeout(() => userMgr.openDrawer(), 100);
        showToast('Add your phone number to receive order updates via WhatsApp');
        return;
      }

      const orderBtn = footer.querySelector('#btnOrder');
      orderBtn.innerHTML = `<span class="spinner-sm"></span> Placing…`;
      orderBtn.disabled = true;

      const orderItems = this.items.map(i => ({
        productId: i.product._id || i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image || '',
      }));

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userMgr.user._id, items: orderItems, total: this.total })
        });
        const data = await res.json();
        if (res.ok) {
          await userMgr.loadOrders();
          showToast(data.whatsappSent ? 'Order confirmed! Check your WhatsApp 📱' : 'Order placed successfully!');
        } else {
          showToast(data.error || 'Failed to place order');
        }
      } catch (err) {
        showToast('Error placing order');
      }

      this.clear();
      closeDrawer('cart');
    };
  }
}

// ─── USER MANAGER ───
const userMgr = {
  user: null, avatarUrl: null, orders: [],

  isLoggedIn() { return !!this.user; },

  async login(username, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.user = data.user;
    this.avatarUrl = data.user.avatar || null;
    await this.loadOrders();
    this.updateBtn();
    return this.user;
  },

  async register(username, email, password, firstname, lastname, phone) {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, firstname, lastname, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    this.user = data.user;
    this.updateBtn();
    return this.user;
  },

  async saveProfile(updates) {
    if (!this.user) return;
    const res = await fetch(`/api/user/${this.user._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    this.user = data.user;
    this.avatarUrl = data.user.avatar || null;
    this.updateBtn();
    return this.user;
  },

  async loadOrders() {
    if (!this.user) return;
    try {
      const res = await fetch(`/api/orders/${this.user._id}`);
      const data = await res.json();
      this.orders = data.orders || [];
    } catch { this.orders = []; }
  },

  logout() {
    this.user = null; this.avatarUrl = null; this.orders = [];
    this.updateBtn();
    showToast('Signed out');
  },

  updateBtn() {
    const btn = document.getElementById('userToggle');
    const img = document.getElementById('headerAvatar');
    if (this.isLoggedIn()) {
      btn.classList.add('logged-in');
      if (this.avatarUrl) { img.src = this.avatarUrl; btn.classList.add('has-avatar'); }
      else { btn.classList.remove('has-avatar'); img.src = ''; }
    } else {
      btn.classList.remove('logged-in', 'has-avatar'); img.src = '';
    }
  },

  openDrawer(view) {
    const title = document.getElementById('userDrawerTitle');
    const body = document.getElementById('userBody');
    if (!this.isLoggedIn() || view === 'login') {
      title.textContent = 'Sign In';
      body.innerHTML = this._loginHTML();
      this._loginEvents(body);
    } else {
      title.textContent = 'My Account';
      body.innerHTML = this._profileHTML();
      this._profileEvents(body);
    }
    openDrawer('user');
  },

  _loginHTML() {
    return `<div class="login-form-wrapper">
      <div class="profile-tabs" style="margin-bottom:16px">
        <button class="profile-tab active" data-auth="login">Sign In</button>
        <button class="profile-tab" data-auth="register">Create Account</button>
      </div>
      <div id="authLogin">
        <div class="form-group"><label for="lu">Username</label><input type="text" id="lu" placeholder="your_username" /></div>
        <div class="form-group"><label for="lp">Password</label><input type="password" id="lp" placeholder="••••••••" /></div>
        <div id="lerr" style="color:var(--red);font-size:0.82rem;margin-bottom:8px;display:none"></div>
        <button class="btn-primary" id="lbtn" style="width:100%">Sign In</button>
      </div>
      <div id="authRegister" style="display:none">
        <div class="form-row">
          <div class="form-group"><label for="rf">First Name</label><input type="text" id="rf" placeholder="John" /></div>
          <div class="form-group"><label for="rl">Last Name</label><input type="text" id="rl" placeholder="Doe" /></div>
        </div>
        <div class="form-group"><label for="ru">Username</label><input type="text" id="ru" placeholder="johndoe" /></div>
        <div class="form-group"><label for="re">Email</label><input type="email" id="re" placeholder="john@example.com" /></div>
        <div class="form-group">
          <label for="rph" style="display:flex;align-items:center">Phone <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-text">Your phone number will only be used to send order confirmations via WhatsApp. It will never be used for marketing purposes.</span></span></label>
          <input type="tel" id="rph" placeholder="(19) 99305-3983" />
        </div>
        <div class="form-group"><label for="rp">Password</label><input type="password" id="rp" placeholder="Min 6 characters" /></div>
        <div id="rerr" style="color:var(--red);font-size:0.82rem;margin-bottom:8px;display:none"></div>
        <button class="btn-primary" id="rbtn" style="width:100%">Create Account</button>
      </div>
    </div>`;
  },

  _loginEvents(c) {
    c.querySelectorAll('[data-auth]').forEach(tab => tab.onclick = () => {
      c.querySelectorAll('[data-auth]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      c.querySelector('#authLogin').style.display = tab.dataset.auth === 'login' ? 'block' : 'none';
      c.querySelector('#authRegister').style.display = tab.dataset.auth === 'register' ? 'block' : 'none';
    });

    const lbtn = c.querySelector('#lbtn'), lerr = c.querySelector('#lerr');
    const doLogin = async () => {
      const u = c.querySelector('#lu').value.trim(), p = c.querySelector('#lp').value;
      if (!u || !p) { lerr.textContent = 'Fill in both fields'; lerr.style.display = 'block'; return; }
      lbtn.innerHTML = `<span class="spinner-sm"></span> Signing in…`; lbtn.disabled = true; lerr.style.display = 'none';
      try {
        await this.login(u, p);
        showToast(`Welcome back, ${this.user.name?.firstname || u}!`);
        closeDrawer('user');
      } catch (e) {
        lerr.textContent = e.message || 'Invalid credentials'; lerr.style.display = 'block';
        lbtn.textContent = 'Sign In'; lbtn.disabled = false;
      }
    };
    lbtn.onclick = doLogin;
    c.querySelector('#lp')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

    const rbtn = c.querySelector('#rbtn'), rerr = c.querySelector('#rerr');
    const doRegister = async () => {
      const f = c.querySelector('#rf').value.trim(), l = c.querySelector('#rl').value.trim();
      const u = c.querySelector('#ru').value.trim(), e = c.querySelector('#re').value.trim();
      const ph = c.querySelector('#rph').value.trim();
      const p = c.querySelector('#rp').value;
      if (!u || !e || !p || !ph) { rerr.textContent = 'All fields are required (username, email, phone, password)'; rerr.style.display = 'block'; return; }
      if (p.length < 6) { rerr.textContent = 'Password must be at least 6 characters'; rerr.style.display = 'block'; return; }
      rbtn.innerHTML = `<span class="spinner-sm"></span> Creating…`; rbtn.disabled = true; rerr.style.display = 'none';
      try {
        await this.register(u, e, p, f, l, ph);
        showToast(`Welcome, ${f || u}! Your account is ready.`);
        closeDrawer('user');
      } catch (err) {
        rerr.textContent = err.message || 'Registration failed'; rerr.style.display = 'block';
        rbtn.textContent = 'Create Account'; rbtn.disabled = false;
      }
    };
    rbtn.onclick = doRegister;
    c.querySelector('#rp')?.addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); });
  },

  _profileHTML() {
    const u = this.user;
    const name = `${u.name?.firstname || ''} ${u.name?.lastname || ''}`.trim() || u.username;
    const av = this.avatarUrl ? `<img src="${this.avatarUrl}" alt="" />` : ICON_USER_LG;
    return `<div class="profile-section">
      <div class="profile-avatar-area">
        <div class="profile-avatar" id="avTrig">${av}<div class="profile-avatar-overlay">${ICON_CAMERA}</div></div>
        <div class="profile-name">${name}</div>
        <div class="profile-email">${u.email || ''}</div>
      </div>
      <div class="profile-tabs">
        <button class="profile-tab active" data-tab="profile">Profile</button>
        <button class="profile-tab" data-tab="orders">Order History</button>
      </div>
      <div class="tab-content active" id="tab-profile">
        <div class="form-row">
          <div class="form-group"><label>First Name</label><input type="text" id="pf" value="${u.name?.firstname || ''}" /></div>
          <div class="form-group"><label>Last Name</label><input type="text" id="pl" value="${u.name?.lastname || ''}" /></div>
        </div>
        <div class="form-group"><label>Email</label><input type="email" value="${u.email || ''}" readonly /></div>
        <div class="form-group"><label>Phone</label><input type="tel" id="pp" value="${u.phone || ''}" placeholder="(19) 99305-3983" /></div>
        <div class="form-group"><label>Address</label><input type="text" id="pa" value="${u.address || ''}" placeholder="123 Main St, City" /></div>
        <div class="form-group"><label>New Password</label><input type="password" id="pnp" placeholder="Leave blank to keep current" /></div>
        <div class="form-group"><label>Confirm Password</label><input type="password" id="pcp" placeholder="Confirm new password" /></div>
        <div class="form-actions">
          <button class="btn-save" id="btnSave">Save Changes</button>
          <button class="btn-danger" id="btnOut">Sign Out</button>
        </div>
      </div>
      <div class="tab-content" id="tab-orders">${this._ordersHTML()}</div>
    </div>`;
  },

  _ordersHTML() {
    if (!this.orders.length) return `<div class="empty-state">${ICON_RECEIPT}<p>No orders yet</p></div>`;
    return this.orders.map(o => {
      const date = new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      return `
      <div class="order-card">
        <div class="order-card__header">
          <div><div class="order-card__id">${o.orderId}</div><div class="order-card__date">${date}</div></div>
          <span class="order-card__status order-card__status--${o.status}">${o.status}</span>
        </div>
        <div class="order-card__items">${o.items.map(it => `
          <div class="order-card__item"><span>${it.quantity}× ${it.title.length > 32 ? it.title.slice(0, 32) + '…' : it.title}</span><span>$${(it.price * it.quantity).toFixed(2)}</span></div>`).join('')}
        </div>
        <div class="order-card__total"><span>Total</span><span>$${o.total.toFixed(2)}</span></div>
      </div>`;
    }).join('');
  },

  _profileEvents(c) {
    c.querySelectorAll('.profile-tab').forEach(tab => tab.onclick = () => {
      c.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      c.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      c.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
    });
    c.querySelector('#avTrig')?.addEventListener('click', () => document.getElementById('avatarInput').click());

    c.querySelector('#btnSave').onclick = async () => {
      const np = c.querySelector('#pnp').value, cp = c.querySelector('#pcp').value;
      if (np && np !== cp) { showToast('Passwords do not match'); return; }
      if (np && np.length < 6) { showToast('Password must be at least 6 characters'); return; }
      const updates = {
        firstname: c.querySelector('#pf').value, lastname: c.querySelector('#pl').value,
        phone: c.querySelector('#pp').value, address: c.querySelector('#pa').value,
      };
      if (np) updates.newPassword = np;
      const btn = c.querySelector('#btnSave');
      btn.innerHTML = `<span class="spinner-sm" style="border-color:rgba(255,255,255,0.3);border-top-color:#fff"></span> Saving…`;
      btn.disabled = true;
      try {
        await this.saveProfile(updates);
        showToast('Profile updated!');
        const ne = c.querySelector('.profile-name');
        if (ne) ne.textContent = `${this.user.name.firstname} ${this.user.name.lastname}`.trim();
        c.querySelector('#pnp').value = ''; c.querySelector('#pcp').value = '';
      } catch (e) { showToast(e.message || 'Failed to save'); }
      btn.textContent = 'Save Changes'; btn.disabled = false;
    };

    c.querySelector('#btnOut').onclick = () => { this.logout(); closeDrawer('user'); };
  }
};

// Avatar handler
document.getElementById('avatarInput').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = async (ev) => {
    try {
      await userMgr.saveProfile({ avatar: ev.target.result });
      if (document.getElementById('userDrawer').classList.contains('open')) userMgr.openDrawer();
      showToast('Avatar updated!');
    } catch { showToast('Failed to upload avatar'); }
  };
  r.readAsDataURL(f);
  e.target.value = '';
};

// ─── DRAWER OPEN/CLOSE ───
function openDrawer(w) {
  document.getElementById(`${w}Overlay`).classList.add('open');
  document.getElementById(`${w}Drawer`).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer(w) {
  document.getElementById(`${w}Overlay`).classList.remove('open');
  document.getElementById(`${w}Drawer`).classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartToggle').onclick = () => openDrawer('cart');
document.getElementById('cartClose').onclick = () => closeDrawer('cart');
document.getElementById('cartOverlay').onclick = () => closeDrawer('cart');
document.getElementById('userToggle').onclick = () => userMgr.openDrawer();
document.getElementById('userClose').onclick = () => closeDrawer('user');
document.getElementById('userOverlay').onclick = () => closeDrawer('user');

// ─── PRODUCT DETAIL PAGE ───
const ICON_ARROW_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>`;

function renderStarIcons(rating, size = 13) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const cls = i <= Math.round(rating) ? 'filled' : 'empty';
    html += `<span class="review-card__star ${cls}">${STAR_SVG}</span>`;
  }
  return html;
}

async function openProductDetail(productId) {
  const storeView = document.getElementById('storeView');
  const detailView = document.getElementById('productDetail');

  storeView.style.display = 'none';
  detailView.style.display = 'block';
  detailView.innerHTML = `<div class="loading"><div class="spinner"></div>Loading...</div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    const res = await fetch(`/api/products/${productId}`);
    const { product, reviews } = await res.json();
    const rate = product.rating?.rate || 0;
    const count = product.rating?.count || 0;
    const imgSrc = product.image || '';

    detailView.innerHTML = `
      <button class="product-detail__back" id="backToStore">${ICON_ARROW_LEFT} Back to store</button>

      <div class="product-detail__main">
        <div class="product-detail__img-wrap">
          <img src="${imgSrc}" alt="${product.title}" />
        </div>
        <div class="product-detail__info">
          <span class="product-detail__category">${product.category}</span>
          <h1 class="product-detail__title">${product.title}</h1>
          <div class="rating" style="font-size:0.9rem">
            ${renderStars(rate)}
            <span class="rating__score" style="font-size:0.9rem">${rate}</span>
            <span class="rating__count" style="font-size:0.85rem">(${count} review${count !== 1 ? 's' : ''})</span>
          </div>
          <div class="product-detail__price">$${product.price.toFixed(2)}</div>
          <p class="product-detail__desc">${product.description || 'No description available.'}</p>
          <button class="product-detail__add" id="detailAddBtn">Add to Cart</button>
        </div>
      </div>

      <div class="reviews-section">
        <div class="reviews-section__title">Customer Reviews (${count})</div>
        <div id="reviewFormArea"></div>
        <div id="reviewsList"></div>
      </div>
    `;

    // Back button
    detailView.querySelector('#backToStore').onclick = closeProductDetail;

    // Add to cart
    detailView.querySelector('#detailAddBtn').onclick = (e) => {
      cart.addItem(product);
      const b = e.currentTarget; b.textContent = 'Added!'; b.classList.add('added');
      setTimeout(() => { b.textContent = 'Add to Cart'; b.classList.remove('added'); }, 900);
    };

    // Review form
    renderReviewForm(productId, reviews);
    renderReviews(reviews);
  } catch (err) {
    detailView.innerHTML = `<div class="loading" style="color:var(--accent)">Failed to load product.</div>`;
  }
}

function closeProductDetail() {
  document.getElementById('storeView').style.display = '';
  document.getElementById('productDetail').style.display = 'none';
}

function renderReviewForm(productId, existingReviews) {
  const area = document.getElementById('reviewFormArea');

  if (!userMgr.isLoggedIn()) {
    area.innerHTML = `<div class="review-form"><div class="review-form__login"><a id="reviewLoginLink">Sign in</a> to leave a review</div></div>`;
    area.querySelector('#reviewLoginLink').onclick = () => userMgr.openDrawer('login');
    return;
  }

  // Check if user already reviewed
  const alreadyReviewed = existingReviews.some(r => (r.userId?._id || r.userId) === userMgr.user._id);
  if (alreadyReviewed) {
    area.innerHTML = `<div class="review-form" style="text-align:center;color:var(--text-muted);font-size:0.88rem;padding:16px">You've already reviewed this product</div>`;
    return;
  }

  let selectedRating = 0;
  area.innerHTML = `
    <div class="review-form">
      <div style="font-size:0.88rem;font-weight:600;margin-bottom:10px">Write a review</div>
      <div class="review-form__stars" id="starPicker">
        ${[1,2,3,4,5].map(i => `<span class="review-form__star" data-v="${i}">${STAR_SVG}</span>`).join('')}
      </div>
      <textarea id="reviewComment" placeholder="Share your experience with this product..."></textarea>
      <button class="review-form__submit" id="submitReview" disabled>Submit Review</button>
    </div>`;

  const stars = area.querySelectorAll('.review-form__star');
  const submitBtn = area.querySelector('#submitReview');

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const v = +star.dataset.v;
      stars.forEach((s, i) => s.classList.toggle('active', i < v));
    });
    star.addEventListener('click', () => {
      selectedRating = +star.dataset.v;
      stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
      submitBtn.disabled = false;
    });
  });

  area.querySelector('#starPicker').addEventListener('mouseleave', () => {
    stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
  });

  submitBtn.onclick = async () => {
    if (!selectedRating) return;
    submitBtn.innerHTML = `<span class="spinner-sm"></span> Posting…`;
    submitBtn.disabled = true;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: userMgr.user._id,
          rating: selectedRating,
          comment: area.querySelector('#reviewComment').value.trim(),
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Review posted!');
        openProductDetail(productId); // Refresh the page
      } else {
        showToast(data.error || 'Failed to post review');
        submitBtn.textContent = 'Submit Review';
        submitBtn.disabled = false;
      }
    } catch {
      showToast('Error posting review');
      submitBtn.textContent = 'Submit Review';
      submitBtn.disabled = false;
    }
  };
}

function renderReviews(reviews) {
  const list = document.getElementById('reviewsList');
  if (reviews.length === 0) {
    list.innerHTML = `<div class="reviews-empty">No reviews yet. Be the first!</div>`;
    return;
  }
  list.innerHTML = reviews.map(r => {
    const user = r.userId || {};
    const name = `${user.name?.firstname || ''} ${user.name?.lastname || ''}`.trim() || user.username || 'Anonymous';
    const date = new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const avatarHTML = user.avatar
      ? `<img src="${user.avatar}" alt="" />`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>`;
    return `
      <div class="review-card">
        <div class="review-card__avatar">${avatarHTML}</div>
        <div class="review-card__body">
          <div class="review-card__header">
            <span class="review-card__name">${name}</span>
            <span class="review-card__date">${date}</span>
          </div>
          <div class="review-card__stars">${renderStarIcons(r.rating)}</div>
          ${r.comment ? `<div class="review-card__comment">${r.comment}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

// ─── INIT ───
const cart = ShoppingCart.getInstance();
cart.render();
new ProductList().fetchProducts();
