const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const store = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// GET /api/categories
app.get('/api/categories', async (req, res) => {
  const categories = await store.getCategories();
  res.json({ categories });
});

// SPA fallback — serve index.html for all non-API routes
app.get('/{*splat}', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🛒  Grocery Guru is running at http://localhost:${PORT}\n`);
});
