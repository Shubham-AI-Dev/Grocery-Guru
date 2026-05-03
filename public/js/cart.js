/* ===== Cart State (localStorage) ===== */
const Cart = {
  KEY: 'freshcart_items',
  _listeners: [],

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  _save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this._notify();
  },

  addItem(productId, qty = 1) {
    const items = this.getItems();
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({ productId, quantity: qty });
    }
    this._save(items);
  },

  removeItem(productId) {
    const items = this.getItems().filter((i) => i.productId !== productId);
    this._save(items);
  },

  updateQuantity(productId, qty) {
    if (qty <= 0) return this.removeItem(productId);
    const items = this.getItems();
    const item = items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = qty;
      this._save(items);
    }
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this._notify();
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach((fn) => fn(this.getCount()));
  },
};
