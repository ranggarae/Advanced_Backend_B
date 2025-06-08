// seed.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const data = require('./data.json'); // array of movie objects

async function runSeed() {
  const conn = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const insertQuery = `
    INSERT INTO movies 
      (title, image, image1, rating, duration, progress, genres)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  for (const m of data) {
    await conn.query(insertQuery, [
      m.title,
      m.image,
      m.image1,
      m.rating,
      m.duration,
      m.progress,
      JSON.stringify(m.genres)
    ]);
  }

  console.log('Seeding selesai');
  process.exit(0);
}

runSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
