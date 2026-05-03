/* ===== API Client ===== */
const API = {
  base: '/api',

  async getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = qs ? `${this.base}/products?${qs}` : `${this.base}/products`;
    const res = await fetch(url);
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${this.base}/products/${id}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${this.base}/categories`);
    return res.json();
  },

  async validateCart(items) {
    const res = await fetch(`${this.base}/cart/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    return res.json();
  },

  async placeOrder(payload) {
    const res = await fetch(`${this.base}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${this.base}/orders/${id}`);
    return res.json();
  },
};
