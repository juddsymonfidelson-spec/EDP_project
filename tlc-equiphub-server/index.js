const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, db } = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const legacyDb = pool;

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed: ' + err.stack);
  } else {
    console.log('✅ Connected to tlc_equiphub_db successfully!');
    connection.release();
  }
});

// ADMIN ROUTES
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/admin/items', itemRoutes);
app.use('/api/admin/reservations', reservationRoutes);

// PUBLIC CLIENT ROUTES
app.get('/api/client/my-reservations/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, i.name AS item_name, i.image_url AS item_image 
       FROM reservations r 
       JOIN items i ON r.item_id = i.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/client/reservations', async (req, res) => {
  try {
    const { user_id, item_id, quantity, reservation_date, start_time, end_time } = req.body;
    if (!user_id || !item_id) {
      return res.status(400).json({ error: 'user_id and item_id are required' });
    }

    const [result] = await db.query(
      `INSERT INTO reservations (user_id, item_id, quantity, reservation_date, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [user_id, item_id, quantity || 1, reservation_date, start_time, end_time]
    );

    res.status(201).json({ message: 'Reservation created!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/client/reservations/:id', async (req, res) => {
  try {
    const { user_id, quantity, reservation_date, start_time, end_time } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    const [result] = await db.query(
      `UPDATE reservations 
       SET quantity = ?, reservation_date = ?, start_time = ?, end_time = ? 
       WHERE id = ? AND user_id = ? AND status = 'Pending'`,
      [quantity, reservation_date, start_time, end_time, req.params.id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found, not yours, or not pending' });
    }

    res.json({ message: 'Reservation updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/client/reservations/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const [result] = await db.query(
      'DELETE FROM reservations WHERE id = ? AND user_id = ? AND status = "Pending"',
      [req.params.id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found, not yours, or already processed' });
    }

    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH ROUTES
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

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
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});