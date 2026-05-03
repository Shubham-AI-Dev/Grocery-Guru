/* ===== Admin Dashboard ===== */
async function renderAdminPage() {
  if (!Auth.requireAdmin()) return;
  const user = Auth.getUser();
  const app = document.getElementById('app');

  app.innerHTML = `
    <header class="header">
      <div class="header-inner">
        <a href="#/admin" class="logo"><span class="logo-icon">🛒</span><span>Fresh</span>Cart</a>
        <div class="admin-header-tag">Admin Panel</div>
        <div class="header-actions">
          <span class="admin-user">${user.avatar} ${user.name}</span>
          <button class="logout-btn" id="admin-logout">Logout</button>
        </div>
      </div>
    </header>
    <div class="admin-page">
      <div class="admin-stats" id="admin-stats">
        <div class="loading"><div class="spinner"></div> Loading dashboard...</div>
      </div>
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="products" id="atab-products">📦 Products</button>
        <button class="admin-tab" data-tab="orders" id="atab-orders">📋 Orders</button>
      </div>
      <div class="admin-content" id="admin-content"></div>
    </div>
  `;

  document.getElementById('admin-logout').addEventListener('click', () => Auth.logout());

  // Load stats
  const stats = await fetch('/api/admin/stats').then((r) => r.json());
  document.getElementById('admin-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">📦</div>
      <div class="stat-value">${stats.totalProducts}</div>
      <div class="stat-label">Products</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📋</div>
      <div class="stat-value">${stats.totalOrders}</div>
      <div class="stat-label">Orders</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-value">₹${stats.totalRevenue.toLocaleString('en-IN')}</div>
      <div class="stat-label">Revenue</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-value">${stats.inStock}</div>
      <div class="stat-label">In Stock</div>
    </div>
  `;

  // Tab switching
  let currentTab = 'products';
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      if (currentTab === 'products') loadAdminProducts();
      else loadAdminOrders();
    });
  });

  loadAdminProducts();
}

async function loadAdminProducts() {
  const container = document.getElementById('admin-content');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Loading products...</div>';

  const { products } = await API.getProducts();
  container.innerHTML = `
    <div class="admin-toolbar">
      <input type="text" class="admin-search" id="admin-product-search" placeholder="Search products..." />
      <button class="admin-add-btn" id="admin-add-product">+ Add Product</button>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table" id="admin-products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Unit</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map((p) => renderAdminProductRow(p)).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Search
  document.getElementById('admin-product-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#admin-products-table tbody tr');
    rows.forEach((row) => {
      const name = row.querySelector('.ap-name').textContent.toLowerCase();
      row.style.display = name.includes(term) ? '' : 'none';
    });
  });

  // Add product
  document.getElementById('admin-add-product').addEventListener('click', () => showAddProductModal());

  // Table actions via delegation
  container.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;

    if (action === 'toggle-stock') {
      await fetch(`/api/admin/products/${id}/stock`, { method: 'PATCH' });
      Toast.show('Stock status updated');
      loadAdminProducts();
    } else if (action === 'delete') {
      if (!confirm('Delete this product?')) return;
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      Toast.show('Product deleted');
      loadAdminProducts();
    }
  });
}

function renderAdminProductRow(p) {
  const emoji = (typeof PRODUCT_EMOJI !== 'undefined' && PRODUCT_EMOJI[p.id]) || '📦';
  return `
    <tr>
      <td><span class="ap-emoji">${emoji}</span> <span class="ap-name">${p.name}</span></td>
      <td><span class="ap-cat">${p.category}</span></td>
      <td class="ap-price">₹${p.price}</td>
      <td>${p.unit}</td>
      <td>
        <span class="stock-badge ${p.inStock ? 'in' : 'out'}">${p.inStock ? 'In Stock' : 'Out'}</span>
      </td>
      <td class="ap-actions">
        <button class="ap-btn toggle" data-action="toggle-stock" data-id="${p.id}" title="Toggle stock">
          ${p.inStock ? '⏸' : '▶'}
        </button>
        <button class="ap-btn delete" data-action="delete" data-id="${p.id}" title="Delete">🗑</button>
      </td>
    </tr>
  `;
}

function showAddProductModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>Add New Product</h2>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <form id="add-product-form" class="modal-form">
        <div class="form-group">
          <label>Product Name</label>
          <input type="text" id="ap-name" required placeholder="e.g. Organic Honey" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select id="ap-category" required>
              <option value="">Select</option>
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Dairy</option>
              <option>Bakery</option>
              <option>Beverages</option>
              <option>Snacks</option>
            </select>
          </div>
          <div class="form-group">
            <label>Price (₹)</label>
            <input type="number" id="ap-price" required min="1" placeholder="99" />
          </div>
        </div>
        <div class="form-group">
          <label>Unit</label>
          <input type="text" id="ap-unit" required placeholder="e.g. kg, pack, litre" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="ap-desc" rows="3" placeholder="Describe the product..."></textarea>
        </div>
        <button type="submit" class="login-btn">Add Product</button>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: document.getElementById('ap-name').value,
      category: document.getElementById('ap-category').value,
      price: +document.getElementById('ap-price').value,
      unit: document.getElementById('ap-unit').value,
      description: document.getElementById('ap-desc').value,
    };
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    overlay.remove();
    Toast.show('Product added!');
    loadAdminProducts();
  });
}

async function loadAdminOrders() {
  const container = document.getElementById('admin-content');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Loading orders...</div>';

  const { orders } = await fetch('/api/admin/orders').then((r) => r.json());

  if (orders.length === 0) {
    container.innerHTML = '<div class="loading">No orders yet</div>';
    return;
  }

  container.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map((o) => `
            <tr>
              <td class="order-id-cell">#${o.id.slice(0, 8).toUpperCase()}</td>
              <td>${o.items.length} items</td>
              <td class="ap-price">₹${o.total.toFixed(2)}</td>
              <td><span class="stock-badge in">${o.status}</span></td>
              <td>${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
