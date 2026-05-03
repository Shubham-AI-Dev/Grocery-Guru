const express = require('express');
const router = express.Router();
const store = require('../db');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const products = await store.getAllProducts();
  const orders = await store.getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const inStock = products.filter((p) => p.inStock).length;

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: +totalRevenue.toFixed(2),
    inStock,
    outOfStock: products.length - inStock,
  });
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  const orders = await store.getAllOrders();
  res.json({ orders, count: orders.length });
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  const updated = await store.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: updated });
});

// POST /api/admin/products
router.post('/products', async (req, res) => {
  const { name, category, price, unit, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }
  const product = await store.addProduct({ name, category, price: +price, unit, description, image: '' });
  res.status(201).json({ product });
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  const success = await store.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// PATCH /api/admin/products/:id/stock
router.patch('/products/:id/stock', async (req, res) => {
  const product = await store.toggleProductStock(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

module.exports = router;
