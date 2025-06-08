// app.js
require('dotenv').config();
require('dotenv').config();
const express   = require('express');
const mysql     = require('mysql2/promise');
const cors      = require('cors');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const multer    = require('multer');
const path      = require('path');
const fs        = require('fs');
const { sendVerificationEmail } = require('./services/emailServices'); // :contentReference[oaicite:4]{index=4}

const app = express();
app.use(cors());
app.use(express.json());

// ─── Global request logger middleware ────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Initialize MySQL connection pool
let pool;
(async function initDb() {
  pool = await mysql.createPool({
    host:            process.env.DB_HOST,
    user:            process.env.DB_USER,
    password:        process.env.DB_PASS,
    database:        process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0
  });
})().catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});

// pastikan folder uploads ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// serve static files dari /uploads
app.use('/uploads', express.static(uploadDir));

// ─── JWT Authentication middleware ───────────────────────────────────────────
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only images are allowed'));
    } else {
      cb(null, true);
    }
  }
});

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

// Register new user
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email & password required' });
  }
  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hash]
  );

    // kirim email verifikasi (fire-and-forget)
    sendVerificationEmail(result.insertId, email)
      .catch(err => console.error('❌ sendVerificationEmail error:', err));

    const user  = { id: result.insertId, username, email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error('❌ /api/register error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login existing user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username & password required' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT id, email, password FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = { id: userRow.id, username, email: userRow.email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('❌ /api/login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get profile (protected)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, avatar FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── UPLOAD AVATAR ─────────────────────────────────────────────────────────
app.post(
  '/api/profile/avatar',
  authenticateToken,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const avatarPath = `/uploads/${req.file.filename}`;
      await pool.query(
        'UPDATE users SET avatar = ? WHERE id = ?',
        [avatarPath, req.user.id]
      );
      res.json({ avatar: avatarPath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  }
);

// ─── listContinue ────────────────────────────────────────────────────────────
app.get('/api/listContinue', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, title, image, image1, progress, metadata
        FROM list_continue
    `);
    res.json(
      rows.map(r => ({
        id:       r.id,
        title:    r.title,
        image:    r.image,
        image1:   r.image1,
        progress: r.progress,
        ...JSON.parse(r.metadata)
      }))
    );
  } catch (err) {
    console.error('❌ /api/listContinue error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── listMovies ───────────────────────────────────────────────────────────────
app.get('/api/listMovies', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, title, image, image1, rating, duration, progress, genres
        FROM movies
    `);
    res.json(
      rows.map(r => ({
        id:       r.id,
        title:    r.title,
        image:    r.image,
        image1:   r.image1,
        rating:   r.rating,
        duration: r.duration,
        progress: r.progress,
        genres:   typeof r.genres === 'string' ? JSON.parse(r.genres) : r.genres
      }))
    );
  } catch (err) {
    console.error('❌ /api/listMovies error:', err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// ─── MY LIST ──────────────────────────────────────────────────────────────────
// All My List routes protected by JWT
app.get('/api/mylist', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.title, m.image, m.image1, m.rating, m.duration, m.progress, m.genres
        FROM mylist ml
        JOIN movies m ON m.id = ml.movie_id
       WHERE ml.user_id = ?
       ORDER BY ml.added_at DESC
    `, [req.user.id]);
    res.json(
      rows.map(r => ({
        id:       r.id,
        title:    r.title,
        image:    r.image,
        image1:   r.image1,
        rating:   r.rating,
        duration: r.duration,
        progress: r.progress,
        genres:   typeof r.genres === 'string' ? JSON.parse(r.genres) : r.genres
      }))
    );
  } catch (err) {
    console.error('❌ /api/mylist GET error:', err);
    res.status(500).json({ error: 'Failed to fetch mylist' });
  }
});

app.post('/api/mylist', authenticateToken, async (req, res) => {
  try {
    const { movie_id } = req.body;
    await pool.query(
      'INSERT IGNORE INTO mylist (user_id, movie_id) VALUES (?, ?)',
      [req.user.id, movie_id]
    );
    res.status(201).json({ movie_id, added_at: new Date() });
  } catch (err) {
    console.error('❌ /api/mylist POST error:', err);
    res.status(500).json({ error: 'Failed to add to mylist' });
  }
});

app.delete('/api/mylist/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    await pool.query(
      'DELETE FROM mylist WHERE user_id = ? AND movie_id = ?',
      [req.user.id, movieId]
    );
    res.status(204).end();
  } catch (err) {
    console.error('❌ /api/mylist DELETE error:', err);
    res.status(500).json({ error: 'Failed to remove from mylist' });
  }
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ─── Error-handling middleware ────────────────────────────────────────────────
// Must have 4 args to be recognized as error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
