/* ===== Header Component ===== */
function renderHeader() {
  const count = Cart.getCount();
  const user = Auth.getUser();
  const userSection = user ? `
    <span class="header-user">${user.avatar} ${user.name}</span>
    <div style="display: flex; gap: 16px; align-items: center; margin: 0 12px; font-size: 0.9rem;">
      <a href="#/profile" style="color: var(--text-secondary); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'">Profile</a>
      <a href="#/orders" style="color: var(--text-secondary); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'">Orders</a>
    </div>
    <button class="logout-btn" id="header-logout">Logout</button>
  ` : `
    <a href="#/login" class="login-btn-header" style="background: var(--primary); color: white; padding: 6px 16px; border-radius: 20px; text-decoration: none; font-weight: 500;">Login</a>
  `;

  return `
    <header class="header" id="main-header">
      <div class="header-inner">
        <a href="#/" class="logo">
          <span class="logo-icon">🧘‍♂️</span>
          <span>Grocery</span>Guru
        </a>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" placeholder="Search groceries..." autocomplete="off" />
        </div>
        <div class="header-actions">
          <a href="#/cart" class="cart-btn" id="cart-btn">
            <span class="cart-icon">🧺</span>
            <span>Cart</span>
            <span class="cart-badge ${count === 0 ? 'hidden' : ''}" id="cart-badge">${count}</span>
          </a>
          ${userSection}
        </div>
      </div>
    </header>
  `;
}

function initHeaderEvents() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const term = e.target.value.trim();
        if (window.location.hash !== '#/' && window.location.hash !== '') {
          window.location.hash = '#/';
        }
        if (typeof window.handleSearch === 'function') {
          window.handleSearch(term);
        }
      }, 300);
    });
  }

  const logoutBtn = document.getElementById('header-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => Auth.logout());
  }

  Cart.onChange((count) => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  });
}
