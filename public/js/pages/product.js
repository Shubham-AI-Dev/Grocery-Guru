/* ===== Product Detail Page ===== */
async function renderProductPage(productId) {
  const app = document.getElementById('app');
  app.innerHTML = renderHeader() + `<div class="loading"><div class="spinner"></div> Loading...</div>`;
  initHeaderEvents();

  const { product } = await API.getProduct(productId);
  if (!product) {
    app.innerHTML = renderHeader() + `<div class="loading">Product not found</div>`;
    return;
  }

  const emoji = getProductEmoji(product);
  let qty = 1;

  app.innerHTML = renderHeader() + `
    <div style="max-width: var(--max-width); margin: 0 auto; padding: 24px;">
      <button class="back-btn" id="back-btn">← Back to products</button>
    </div>
    <div class="product-detail">
      <div class="product-detail-img">${emoji}</div>
      <div class="product-detail-info">
        <span class="product-card-cat">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="product-detail-meta">
          <span>${renderStars(product.rating)}</span>
          <span>${product.inStock ? '✓ In Stock' : '✕ Out of Stock'}</span>
        </div>
        <div class="product-detail-price">₹${product.price} <small>/ ${product.unit}</small></div>
        <p class="product-detail-desc">${product.description}</p>
        <div class="qty-controls">
          <button class="qty-btn" id="qty-dec">−</button>
          <span class="qty-display" id="qty-display">${qty}</span>
          <button class="qty-btn" id="qty-inc">+</button>
        </div>
        <button class="detail-add-btn" id="detail-add-btn">Add to Cart</button>
      </div>
    </div>
  `;

  initHeaderEvents();

  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.hash = '#/';
  });
  document.getElementById('qty-dec').addEventListener('click', () => {
    if (qty > 1) { qty--; document.getElementById('qty-display').textContent = qty; }
  });
  document.getElementById('qty-inc').addEventListener('click', () => {
    qty++; document.getElementById('qty-display').textContent = qty;
  });
  document.getElementById('detail-add-btn').addEventListener('click', () => {
    Cart.addItem(product.id, qty);
    Toast.show(`${qty}× ${product.name} added to cart!`);
  });
}
