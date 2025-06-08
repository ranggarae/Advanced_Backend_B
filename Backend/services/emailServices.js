// services/emailServices.js
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

// transporter SMTP (default ke Gmail)
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   Number(process.env.EMAIL_PORT)   || 465,
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// cek koneksi sekali saja pada startup
transporter.verify(err => {
  if (err)  console.error('❌ SMTP error:', err);
  else      console.log('✅ SMTP ready using', transporter.options.host);
});

async function sendVerificationEmail(userId, toEmail) {
  const token = uuidv4();
  await pool.query(
    'INSERT INTO email_verification (user_id, token, created_at) VALUES (?, ?, NOW())',
    [userId, token]
  );
  const link = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const info = await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      toEmail,
    subject: 'Verifikasi Email Anda',
    html:    `<p>Silakan klik <a href="${link}">di sini</a> untuk verifikasi.</p>`
  });
  console.log('✉️ Email sent:', info.messageId);
}

module.exports = { sendVerificationEmail };
