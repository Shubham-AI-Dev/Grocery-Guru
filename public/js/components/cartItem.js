/* ===== Cart Item Component ===== */
function renderCartItem(item) {
  const emoji = PRODUCT_EMOJI[item.productId] || '🛒';
  const subtotal = (item.price * item.quantity).toFixed(2);
  return `
    <div class="cart-item" id="cart-item-${item.productId}">
      <div class="cart-item-icon">${emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} / ${item.unit}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-item-qty-btn" data-action="decrease" data-id="${item.productId}">−</button>
        <span class="cart-item-qty">${item.quantity}</span>
        <button class="cart-item-qty-btn" data-action="increase" data-id="${item.productId}">+</button>
      </div>
      <div class="cart-item-subtotal">₹${subtotal}</div>
      <button class="cart-item-remove" data-action="remove" data-id="${item.productId}" title="Remove">✕</button>
    </div>
  `;
}
