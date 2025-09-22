const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtp, verifyOtp } = require('../services/otpService');

const SECRET = process.env.JWT_SECRET || 'secret';

// Register (email + password)
router.post('/register', async (req, res) => {
  const { name, email, password, language_preference } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    const q = `INSERT INTO users (id, name, email, password_hash, language_preference) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id, name, email`;
    const r = await client.query(q, [name, email, hashed, language_preference || 'en']);
    res.json(r.rows[0]);
  } catch(e) {
    res.status(400).json({ error: 'User exists or bad data' });
  } finally {
    client.release();
  }
});

// Login (email)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!r.rows[0]) return res.status(400).json({ error: 'User not found' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid creds' });
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } finally {
    client.release();
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  await sendOtp(phone);
  res.json({ success: true });
});

// Verify OTP (returns JWT on success)
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const ok = await verifyOtp(phone, otp);
  if (!ok) return res.status(400).json({ error: 'Invalid OTP' });
  // create a user row if not exists (demo)
  const client = await pool.connect();
  try {
    let r = await client.query('SELECT * FROM users WHERE phone_number=$1', [phone]);
    let user;
    if (r.rows.length === 0) {
      const ins = await client.query('INSERT INTO users (id, name, phone_number) VALUES (gen_random_uuid(), $1, $1) RETURNING *', [phone]);
      user = ins.rows[0];
    } else {
      user = r.rows[0];
    }
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } finally {
    client.release();
  }
});

module.exports = router;
