const express = require('express');
const router = express.Router();
const store = require('../db');

const nodemailer = require('nodemailer');

const otpStore = new Map();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone number and password are required' });
  }

  const user = await store.authenticateUser(phone, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid phone number or password' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, phone, password, role = 'user' } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  if (phone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone format' });
  }

  // Check if user already exists
  if (await store.getUserByPhone(phone)) {
    return res.status(409).json({ error: 'Phone number already registered' });
  }

  const newUser = await store.createUser(name, '', phone, password, role);
  if (!newUser) {
    return res.status(500).json({ error: 'Failed to create user' });
  }

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser });
});

// POST /api/auth/verify — check if stored session is valid
router.post('/verify', async (req, res) => {
  const { userId } = req.body;
  const user = await store.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// POST /api/auth/forgot-password — demo endpoint
router.post('/forgot-password', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const user = await store.getUserByPhone(phone);
  if (!user) {
    return res.status(404).json({ error: 'Phone number not found' });
  }

  // In a real app, you'd generate a reset token and send an SMS
  // For demo, just return success
  res.json({ 
    success: true, 
    message: 'Password reset link sent to your mobile number (demo - no real SMS sent)' 
  });
});

module.exports = router;
