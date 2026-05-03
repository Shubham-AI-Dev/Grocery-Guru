/* ===== Cart Page ===== */
async function renderCartPage() {
  const app = document.getElementById('app');
  const cartItems = Cart.getItems();

  if (cartItems.length === 0) {
    app.innerHTML = renderHeader() + `
      <div class="cart-page">
        <h1>Your Cart</h1>
        <div class="cart-empty">
          <div class="empty-icon">🧺</div>
          <p>Your cart is empty</p>
          <a href="#/">Browse Products</a>
        </div>
      </div>
    `;
    initHeaderEvents();
    return;
  }

  app.innerHTML = renderHeader() + `
    <div class="cart-page">
      <h1>Your Cart</h1>
      <div class="cart-items" id="cart-items">
        <div class="loading"><div class="spinner"></div> Validating cart...</div>
      </div>
      <div class="cart-summary" id="cart-summary"></div>
    </div>
  `;
  initHeaderEvents();

  // Validate cart against server
  const result = await API.validateCart(cartItems);
  renderCartContents(result);
}

function renderCartContents(result) {
  const itemsEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!itemsEl || !summaryEl) return;

  itemsEl.innerHTML = result.items.map(renderCartItem).join('');

  const itemCount = result.items.reduce((s, i) => s + i.quantity, 0);
  summaryEl.innerHTML = `
    <div class="cart-summary-row">
      <span>Items (${itemCount})</span>
      <span>₹${result.total.toFixed(2)}</span>
    </div>
    <div class="cart-summary-row">
      <span>Delivery</span>
      <span style="color: var(--accent);">Free</span>
    </div>
    <div class="cart-summary-row total">
      <span>Total</span>
      <span>₹${result.total.toFixed(2)}</span>
    </div>
    <button class="checkout-btn" id="checkout-btn">Proceed to Checkout</button>
  `;

  // Qty buttons
  itemsEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const item = Cart.getItems().find((i) => i.productId === id);
    if (!item) return;

    if (action === 'increase') Cart.updateQuantity(id, item.quantity + 1);
    else if (action === 'decrease') Cart.updateQuantity(id, item.quantity - 1);
    else if (action === 'remove') Cart.removeItem(id);

    const updated = Cart.getItems();
    if (updated.length === 0) return renderCartPage();
    const newResult = await API.validateCart(updated);
    renderCartContents(newResult);
  });

  // Checkout button
  document.getElementById('checkout-btn').addEventListener('click', () => {
    window.location.hash = '#/checkout';
  });
}
