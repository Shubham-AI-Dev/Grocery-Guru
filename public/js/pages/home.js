/* ===== Home Page ===== */
let _allProducts = [];
let _activeCategory = '';

async function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = renderHeader() + `
    <section class="hero">
      <h1>Grocery Guru</h1>
      <p>Shop smarter with the grocery guru.</p>
    </section>
    <div class="categories" id="category-tabs"></div>
    <section class="products-section">
      <h2 id="products-heading">All Products</h2>
      <div class="product-grid" id="product-grid">
        <div class="loading"><div class="spinner"></div> Loading products...</div>
      </div>
    </section>
  `;

  initHeaderEvents();

  // Load categories
  const { categories } = await API.getCategories();
  const tabsEl = document.getElementById('category-tabs');
  tabsEl.innerHTML = `
    <button class="cat-btn active" data-cat="" id="cat-all">All</button>
    ${categories.map((c) => `<button class="cat-btn" data-cat="${c}" id="cat-${c.toLowerCase()}">${c}</button>`).join('')}
  `;
  tabsEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('cat-btn')) {
      _activeCategory = e.target.dataset.cat;
      tabsEl.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');
      filterAndRender();
    }
  });

  // Load products
  const { products } = await API.getProducts();
  _allProducts = products;
  filterAndRender();
}

function filterAndRender(searchTerm = '') {
  let filtered = _allProducts;
  if (_activeCategory) {
    filtered = filtered.filter((p) => p.category === _activeCategory);
  }
  if (searchTerm) {
    const t = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t)
    );
  }

  const heading = document.getElementById('products-heading');
  if (heading) {
    heading.textContent = _activeCategory || (searchTerm ? `Results for "${searchTerm}"` : 'All Products');
  }

  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="loading">No products found</div>';
    return;
  }

  grid.innerHTML = filtered.map(renderProductCard).join('');

  // Card click → detail page
  grid.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-btn')) return;
      window.location.hash = `#/product/${card.dataset.id}`;
    });
  });

  // Add-to-cart buttons
  grid.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      Cart.addItem(btn.dataset.productId);
      Toast.show('Added to cart!');
    });
  });
}

window.handleSearch = function (term) {
  filterAndRender(term);
};
