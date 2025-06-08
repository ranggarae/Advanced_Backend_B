const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",          // ← isi sesuai password MySQL kamu
  database: "movieapp"   // ← pastikan nama database sesuai
});

module.exports = conn;
