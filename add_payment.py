import re

checkout_file = "public/js/pages/checkout.js"
with open(checkout_file, "r", encoding="utf-8") as f:
    content = f.read()

# Add Payment Options UI to Checkout
payment_ui = """
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
"""

# Insert payment UI before order total
content = content.replace('<div class="order-total-row" id="order-total-display">', payment_ui + '\n      <div class="order-total-row" id="order-total-display">')

# Fetch selected payment method
js_payload = """    const deliveryTime = document.getElementById('delivery-slot') ? document.getElementById('delivery-slot').value : 'ASAP';
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const payload = {
      items: cartItems,
      discount: discountApplied,
      deliveryTime: deliveryTime,
      paymentMethod: paymentMethod
    };"""

content = content.replace("""    const deliveryTime = document.getElementById('delivery-slot') ? document.getElementById('delivery-slot').value : 'ASAP';
    const payload = {
      items: cartItems,
      discount: discountApplied,
      deliveryTime: deliveryTime
    };""", js_payload)

with open(checkout_file, "w", encoding="utf-8") as f:
    f.write(content)

# Update server/routes/orders.js
orders_file = "server/routes/orders.js"
with open(orders_file, "r", encoding="utf-8") as f:
    orders_content = f.read()

orders_content = orders_content.replace("const { items, discount, deliveryTime } = req.body;", "const { items, discount, deliveryTime, paymentMethod } = req.body;")
orders_content = orders_content.replace("await store.createOrder(items, discount || 0, deliveryTime || 'ASAP');", "await store.createOrder(items, discount || 0, deliveryTime || 'ASAP', paymentMethod || 'COD');")

with open(orders_file, "w", encoding="utf-8") as f:
    f.write(orders_content)

# Update server/models/store.js
store_file = "server/models/store.js"
with open(store_file, "r", encoding="utf-8") as f:
    store_content = f.read()

store_content = store_content.replace("async createOrder(cartItems, discount = 0, deliveryTime = 'ASAP') {", "async createOrder(cartItems, discount = 0, deliveryTime = 'ASAP', paymentMethod = 'COD') {")
store_content = store_content.replace("      deliveryTime: deliveryTime,\n      status: 'confirmed',", "      deliveryTime: deliveryTime,\n      paymentMethod: paymentMethod,\n      status: 'confirmed',")

with open(store_file, "w", encoding="utf-8") as f:
    f.write(store_content)

print("Payment option added.")
