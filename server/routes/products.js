const express = require('express');
const router = express.Router();
const store = require('../db');

// GET /api/products — list with optional ?category= and ?search=
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const products = await store.getAllProducts({ category, search });
  res.json({ products, count: products.length });
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  const product = await store.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

module.exports = router;
