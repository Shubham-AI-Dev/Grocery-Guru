/* ===== Checkout / Order Confirmation ===== */
async function renderCheckoutPage() {
  const app = document.getElementById('app');
  const cartItems = Cart.getItems();

  if (cartItems.length === 0) {
    window.location.hash = '#/cart';
    return;
  }

  app.innerHTML = renderHeader() + `
    <div class="checkout-page">
      <h1>Checkout</h1>
      <div id="checkout-content">
        <div class="loading"><div class="spinner"></div> Preparing your order...</div>
      </div>
    </div>
  `;
  initHeaderEvents();

  const result = await API.validateCart(cartItems);
  const container = document.getElementById('checkout-content');

  container.innerHTML = `
        <div class="cart-summary">
      <h3 style="margin-bottom: 16px; font-family: var(--font-heading);">Order Summary</h3>
      <div class="order-items-list" style="margin-bottom: 16px;">
        ${result.items.map((i) => `
          <div class="order-item-row">
            <span class="name">${i.quantity}× ${i.name}</span>
            <span class="amount">₹${i.subtotal.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <label style="display:block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">Delivery Time Slot</label>
        <select id="delivery-slot" style="width: 100%; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(0,0,0,0.2); color: var(--text-primary); outline: none; margin-bottom: 16px;">
          <option value="ASAP">As Soon As Possible (Within 30 mins)</option>
          <option value="Today Evening">Today Evening (6 PM - 8 PM)</option>
          <option value="Tomorrow Morning">Tomorrow Morning (8 AM - 10 AM)</option>
        </select>
        
        <label style="display:block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">Promo Code</label>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="promo-code" placeholder="Enter GURU20" style="flex:1; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(0,0,0,0.2); color: var(--text-primary); text-transform: uppercase;" />
          <button id="apply-promo" style="background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-primary); padding: 0 16px; border-radius: var(--radius-sm); cursor: pointer;">Apply</button>
        </div>
        <div id="promo-msg" style="font-size: 0.85rem; margin-top: 8px;"></div>
      </div>

      
        <label style="display:block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">Payment Method</label>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
          <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); cursor: pointer; transition: border-color 0.2s;">
            <input type="radio" name="payment-method" value="UPI" checked style="accent-color: var(--accent); width: 18px; height: 18px;" />
            <span style="font-size: 1.2rem;">📱</span>
            <span style="color: var(--text-primary); font-weight: 500;">UPI / QR Code</span>
          </label>
          <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); cursor: pointer; transition: border-color 0.2s;">
            <input type="radio" name="payment-method" value="Card" style="accent-color: var(--accent); width: 18px; height: 18px;" />
            <span style="font-size: 1.2rem;">💳</span>
            <span style="color: var(--text-primary); font-weight: 500;">Credit / Debit Card</span>
          </label>
          <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); cursor: pointer; transition: border-color 0.2s;">
            <input type="radio" name="payment-method" value="COD" style="accent-color: var(--accent); width: 18px; height: 18px;" />
            <span style="font-size: 1.2rem;">💵</span>
            <span style="color: var(--text-primary); font-weight: 500;">Cash on Delivery (COD)</span>
          </label>
        </div>

      <div class="order-total-row" id="order-total-display">
        <span>Total</span>
        <span class="amount">₹${result.total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn" id="place-order-btn" data-total="${result.total}">🛒 Place Order — ₹${result.total.toFixed(2)}</button>
    </div>
  `;


  let finalTotal = result.total;
  let discountApplied = 0;
  
  const applyPromoBtn = document.getElementById('apply-promo');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const code = document.getElementById('promo-code').value.trim().toUpperCase();
      const msg = document.getElementById('promo-msg');
      if (code === 'GURU20') {
        discountApplied = result.total * 0.20;
        finalTotal = result.total - discountApplied;
        msg.textContent = '20% Discount applied! (-₹' + discountApplied.toFixed(2) + ')';
        msg.style.color = 'var(--accent)';
        
        document.getElementById('order-total-display').innerHTML = `
          <span>Total (after discount)</span>
          <span class="amount">₹${finalTotal.toFixed(2)}</span>
        `;
        document.getElementById('place-order-btn').textContent = `🛒 Place Order — ₹${finalTotal.toFixed(2)}`;
      } else {
        msg.textContent = 'Invalid promo code.';
        msg.style.color = 'var(--red)';
      }
    });
  }
  
  document.getElementById('place-order-btn').addEventListener('click', async (e) => {

    const btn = e.target;
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    const deliveryTime = document.getElementById('delivery-slot') ? document.getElementById('delivery-slot').value : 'ASAP';
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const payload = {
      items: cartItems,
      discount: discountApplied,
      deliveryTime: deliveryTime,
      paymentMethod: paymentMethod
    };
    const orderResult = await API.placeOrder(payload);

    if (orderResult.success) {
      Cart.clear();
      showOrderConfirmation(orderResult.order);
    } else {
      Toast.show('Failed to place order. Please try again.', 'error');
      btn.disabled = false;
      btn.textContent = `🛒 Place Order — ₹${result.total.toFixed(2)}`;
    }
  });
}

function showOrderConfirmation(order) {
  const app = document.getElementById('app');
  app.innerHTML = renderHeader() + `
    <div class="checkout-page">
      <div class="order-confirmation">
        <div class="check-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p class="order-id">Order #${order.id.slice(0, 8).toUpperCase()}</p>
        <div class="order-items-list">
          ${order.items.map((i) => `
            <div class="order-item-row">
              <span class="name">${i.quantity}× ${i.name}</span>
              <span class="amount">₹${i.subtotal.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-total-row">
          <span>Total Paid</span>
          <span class="amount">₹${order.total.toFixed(2)}</span>
        </div>
        <button class="continue-btn" onclick="window.location.hash='#/'">Continue Shopping</button>
      </div>
    </div>
  `;
  initHeaderEvents();
}
