/* ===== My Orders Page ===== */
async function renderOrdersPage() {
  const app = document.getElementById('app');
  app.innerHTML = renderHeader() + `
    <div style="max-width: var(--max-width); margin: 0 auto; padding: 48px 24px; min-height: 70vh;">
      <h1 style="font-family: var(--font-heading); margin-bottom: 24px; color: var(--text-primary);">My Orders</h1>
      <div id="my-orders-list">
        <div class="loading"><div class="spinner"></div> Loading orders...</div>
      </div>
    </div>
  `;
  initHeaderEvents();

  // Mocking order fetch for demo
  setTimeout(() => {
    const list = document.getElementById('my-orders-list');
    list.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 24px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 16px;">
          <div>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Order #ORD-8A9F23</p>
            <p style="font-weight: 600; color: var(--text-primary);">Delivered on May 1st</p>
          </div>
          <div style="text-align: right;">
            <p style="color: var(--text-muted); font-size: 0.85rem;">Total Amount</p>
            <p style="font-weight: 700; color: var(--accent);">₹450.00</p>
          </div>
        </div>
        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div style="font-size: 2rem;">🍎 🍞 🥛</div>
          <div style="color: var(--text-secondary); font-size: 0.95rem;">Shimla Apples, Sourdough Bread, Amul Milk</div>
        </div>
        <button onclick="Toast.show('Added items from past order to cart!'); Cart.addItem('p003'); Cart.addItem('p016'); Cart.addItem('p011');" style="background: var(--bg-glass); border: 1px solid var(--accent); color: var(--accent); padding: 8px 16px; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; transition: background 0.2s;">↻ Reorder Items</button>
      </div>
    `;
  }, 500);
}
