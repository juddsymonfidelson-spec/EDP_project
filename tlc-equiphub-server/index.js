const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/db'); // Import from our new config file

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 1. LEGACY DATABASE CONNECTION (for groupmate's routes)
// =====================================================
// We use the pool for legacy routes to prevent connection leaks
const legacyDb = pool;

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed: ' + err.stack);
  } else {
    console.log('✅ Connected to tlc_equiphub_db successfully!');
    connection.release();
  }
});

// =====================================================
// 2. ADMIN ROUTES (Your work)
// =====================================================
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/admin/items', itemRoutes);
app.use('/api/admin/reservations', reservationRoutes);

// =====================================================
// 3. GROUP MATE ROUTES (Preserved)
// =====================================================
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) return res.status(400).json({ error: "All fields are required" });

  const sql = "INSERT INTO users (`UserName`, `Email`, `Password`, `role`) VALUES (?, ?, ?, ?)";
  legacyDb.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database registration failed" });
    }
    res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields are required" });

  const sql = "SELECT * FROM users WHERE `Email` = ? AND `Password` = ?";
  legacyDb.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
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
// 4. START SERVER
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});