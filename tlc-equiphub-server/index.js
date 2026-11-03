const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Leave blank if you are using default XAMPP
  database: 'tlc equiphub_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to tlc equiphub_db successfully!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// save signin info to database
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      console.error("SQL Registration Error:", err);
      return res.status(500).json({ error: "Database registration failed" });
    }
    res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
  });
});

//login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("SQL Login Error:", err);
      return res.status(500).json({ error: "Database login query failed" });
    }

    if (results.length > 0) {
      // User found matching credentials
      const user = results[0];
      res.status(200).json({ 
        message: "Login successful!", 
        user: { id: user.id, username: user.username, role: user.role } 
      });
    } else {
      // No match found
      res.status(401).json({ error: "Invalid email or password configuration" });
    }
  });
});



