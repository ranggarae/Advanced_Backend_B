// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // sesuaikan path ke pool mysql2

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_secure_secret';

// Middleware untuk proteksi route
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token missing' });
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Semua field wajib diisi' });

  try {
    // cek duplikat
    const [exists] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (exists.length)
      return res.status(409).json({ error: 'Username atau email sudah terdaftar' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username,email,password) VALUES (?,?,?)',
      [username, email, hash]
    );
    return res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username dan password wajib diisi' });

  try {
    const [rows] = await pool.query(
      'SELECT id,username,email,password FROM users WHERE username = ?',
      [username]
    );
    if (!rows.length) return res.status(401).json({ error: 'Credensial salah' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credensial salah' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET PROFILE
router.get('/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,username,email FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User tidak ditemukan' });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE PROFILE (optional)
router.put('/profile', authenticate, async (req, res) => {
  const { username, email, password } = req.body;
  const fields = [], vals = [];
  if (username) { fields.push('username = ?'); vals.push(username); }
  if (email)    { fields.push('email    = ?'); vals.push(email); }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    fields.push('password = ?');
    vals.push(hash);
  }
  if (!fields.length) return res.status(400).json({ error: 'Tidak ada data diubah' });
  vals.push(req.user.id);

  try {
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, vals);
    return res.json({ message: 'Profil diperbarui' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
