const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Store {
  constructor() {
    this.products = [];
    this.orders = [];
    this.users = [];
    this._loadProducts();
    this._loadUsers();
  }

  _loadProducts() {
    const dataPath = path.join(__dirname, '..', 'data', 'products.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    this.products = JSON.parse(raw);
  }

  _loadUsers() {
    const dataPath = path.join(__dirname, '..', 'data', 'users.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    this.users = JSON.parse(raw);
  }

  async authenticateUser(identifier, password) {
    const idStr = identifier.toLowerCase().trim();
    return this.users.find(
      (u) => (u.email.toLowerCase() === idStr || u.phone === idStr) && u.password === password
    ) || null;
  }

  async getUserById(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  async getAllProducts({ category, search } = {}) {
    let results = [...this.products];

    if (category) {
      results = results.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const term = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    return results;
  }

  async getProductById(id) {
    return this.products.find((p) => p.id === id) || null;
  }

  async getCategories() {
    const cats = [...new Set(this.products.map((p) => p.category))];
    return cats.sort();
  }

  async validateCart(items) {
    const validated = [];
    let valid = true;

    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (!product) {
        validated.push({ ...item, error: 'Product not found' });
        valid = false;
        continue;
      }
      if (!product.inStock) {
        validated.push({ ...item, error: 'Out of stock', product });
        valid = false;
        continue;
      }
      validated.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: item.quantity,
        subtotal: +(product.price * item.quantity).toFixed(2),
      });
    }

    const total = validated.reduce((sum, i) => sum + (i.subtotal || 0), 0);
    return { valid, items: validated, total: +total.toFixed(2) };
  }

  async createOrder(cartItems, discount = 0, deliveryTime = 'ASAP', paymentMethod = 'COD') {
    const validation = await this.validateCart(cartItems);
    if (!validation.valid) {
      return { success: false, error: 'Some items are invalid', validation };
    }

    const order = {
      id: uuidv4(),
      items: validation.items,
      total: +(validation.total - discount).toFixed(2),
      discount: discount,
      deliveryTime: deliveryTime,
      paymentMethod: paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    this.orders.push(order);
    return { success: true, order };
  }

  async getOrder(id) {
    return this.orders.find((o) => o.id === id) || null;
  }

  async getAllOrders() {
    return [...this.orders].reverse();
  }

  async updateProduct(id, updates) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates, id };
    return this.products[idx];
  }

  async addProduct(data) {
    const id = 'p' + String(this.products.length + 1).padStart(3, '0');
    const product = { id, inStock: true, rating: 4.0, ...data };
    this.products.push(product);
    return product;
  }

  async deleteProduct(id) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  async toggleProductStock(id) {
    const product = await this.getProductById(id);
    if (!product) return null;
    product.inStock = !product.inStock;
    return product;
  }

  // ===== User Management =====
  async getUserByEmail(email) {
    return this.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getUserByPhone(phone) {
    return this.users.find((u) => u.phone === phone) || null;
  }

  async createUser(name, email, phone, password, role = 'user') {
    const newUser = {
      id: 'u' + String(this.users.length + 1).padStart(3, '0'),
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : '',
      phone: phone ? phone.trim() : '',
      password: password,
      role: role,
      avatar: role === 'admin' ? '👨‍💼' : '👤',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this._saveUsers();
    return newUser;
  }

  _saveUsers() {
    const dataPath = path.join(__dirname, '..', 'data', 'users.json');
    fs.writeFileSync(dataPath, JSON.stringify(this.users, null, 2), 'utf-8');
  }
}

// Singleton
module.exports = new Store();
