// routes/mylist.js
import express from 'express';
import pool from '../db';    // misal: mysql2 pool

const router = express.Router();

// 1) GET /mylist
router.get('/', async (req, res) => {
  const userId = req.user.id; // asumsi ada middleware auth
  const [rows] = await pool.query(`
    SELECT ml.movie_id, ml.added_at,
           m.title, m.image, m.image1, m.rating, m.duration, m.progress, m.genres
      FROM mylist ml
      JOIN movies m ON m.id = ml.movie_id
     WHERE ml.user_id = ?
     ORDER BY ml.added_at DESC
  `, [userId]);
  // ubah format genres dari JSON string ke array
  const data = rows.map(r => ({
    movie_id: r.movie_id,
    added_at: r.added_at,
    movie: {
      title: r.title,
      image: r.image,
      image1: r.image1,
      rating: r.rating,
      duration: r.duration,
      progress: r.progress,
      genres: JSON.parse(r.genres)
    }
  }));
  res.json(data);
});

// 2) POST /mylist
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { movie_id } = req.body;
  await pool.query(
    'INSERT IGNORE INTO mylist (user_id, movie_id) VALUES (?, ?)',
    [userId, movie_id]
  );
  res.status(201).json({ user_id: userId, movie_id, added_at: new Date() });
});

// 3) DELETE /mylist/:movieId
router.delete('/:movieId', async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.params;
  await pool.query(
    'DELETE FROM mylist WHERE user_id = ? AND movie_id = ?',
    [userId, movieId]
  );
  res.status(204).end();
});

export default router;
