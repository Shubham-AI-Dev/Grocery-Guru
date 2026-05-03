const express = require('express');
const router = express.Router();
const store = require('../db');

// POST /api/orders — place a new order
router.post('/', async (req, res) => {
  const { items, discount, deliveryTime, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  const result = await store.createOrder(items, discount || 0, deliveryTime || 'ASAP', paymentMethod || 'COD');

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
});

// GET /api/orders/:id — get order details
router.get('/:id', async (req, res) => {
  const order = await store.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

module.exports = router;
