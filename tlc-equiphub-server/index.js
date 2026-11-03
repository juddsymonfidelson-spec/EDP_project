const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 1. LEGACY DATABASE (for groupmate's login/register)
// =====================================================
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tlc equiphub_db'
});

db.connect((err) => {
  if (err) console.error('Database connection failed: ' + err.stack);
  else console.log('✅ Connected to tlc equiphub_db successfully!');
});

// =====================================================
// 2. ADMIN ROUTES (Your work)
// =====================================================
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/admin/items', itemRoutes);
app.use('/api/admin/reservations', reservationRoutes);

// =====================================================
// 3. GROUP MATE ROUTES (Preserved but updated for your schema)
// =====================================================
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Note the backticks around UserName, Email, Password to match your table
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

  // Note the backticks around Email and Password
  const sql = "SELECT * FROM users WHERE `Email` = ? AND `Password` = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("SQL Login Error:", err);
      return res.status(500).json({ error: "Database login query failed" });
    }

    if (results.length > 0) {
      const user = results[0];
      // Return the correct column names so React can use them
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