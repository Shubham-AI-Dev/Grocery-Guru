const express = require('express');
const router = express.Router();
const store = require('../db');

// POST /api/cart/validate — validate cart items against stock/prices
router.post('/validate', async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required' });
  }

  const result = await store.validateCart(items);
  res.json(result);
});

module.exports = router;
