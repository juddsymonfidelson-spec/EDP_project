const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 1. COMPATIBLE DATABASE POOL
// =====================================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tlc_equiphub_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// MOVE EXPORTS HERE
module.exports = { 
  db: pool.promise(), 
  pool: pool 
};

// Test connection using standard callbacks
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection pool failed: ' + err.message);
  } else {
    console.log('✅ Connected to tlc_equiphub_db connection pool successfully!');
    connection.release();
  }
});

const db = pool; 

// =====================================================
// 2. ROUTES SETUP
// =====================================================
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/admin/items', itemRoutes);
app.use('/api/admin/reservations', reservationRoutes);

//  PUBLIC USER PATHWAY
app.get('/api/users/items', require('./controllers/itemController').getAllItems);
app.post('/api/users/reservations', require('./controllers/reservationController').createReservation);
// =====================================================
// 3. GROUP MATE ROUTES (Preserved callback paths)
// =====================================================
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = "INSERT INTO users (`UserName`, `Email`, `Password`, `role`) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      console.error("SQL Registration Error:", err);
      return res.status(500).json({ error: "Database registration failed" });
    }
    res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = "SELECT * FROM users WHERE `Email` = ? AND `Password` = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("SQL Login Error:", err);
      return res.status(500).json({ error: "Database login query failed" });
    }
    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({ 
        message: "Login successful!", 
        user: { id: user.ID, username: user.UserName, role: user.role } 
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// =====================================================
// 4. START SERVER (Always at the bottom)
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});