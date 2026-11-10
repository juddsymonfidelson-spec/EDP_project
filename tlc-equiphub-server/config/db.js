const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// 1. Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tlc_equiphub_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Create the promise-based wrapper
const db = pool.promise();

// 3. Export both
module.exports = { db, pool };