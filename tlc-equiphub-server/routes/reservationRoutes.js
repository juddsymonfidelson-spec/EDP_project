const express = require('express');
const router = express.Router();
const { 
  getAllReservations, 
  getStats, 
  acceptReservation, 
  declineReservation, 
  cancelReservation, 
  sendReminder, 
  sendMessage 
} = require('../controllers/reservationController');
const { checkAdmin } = require('../middleware/checkAdmin');
const { db } = require('../config/db');

// =====================================================
// PUBLIC CLIENT ROUTES (No Admin Check Needed)
// =====================================================

// Client submits a new reservation
router.post('/', async (req, res) => {
  try {
    const { user_id, item_id, quantity, start_date, end_date } = req.body;
    if (!user_id || !item_id) {
      return res.status(400).json({ error: 'user_id and item_id are required' });
    }

    const [result] = await db.query(
      `INSERT INTO reservations (user_id, item_id, quantity, start_date, end_date, status) 
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [user_id, item_id, quantity || 1, start_date, end_date]
    );

    res.status(201).json({ message: 'Reservation created!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client views their own reservations
router.get('/my-reservations/:userId', async (req, res) => {
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

// Client cancels their own reservation (optional reason)
router.put('/:id/cancel', cancelReservation);

// =====================================================
// ADMIN ROUTES (Protected)
// =====================================================

router.use(checkAdmin);

router.get('/', getAllReservations);
router.get('/stats', getStats);

router.get('/notifications', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.id, r.created_at, u.UserName AS client_name, i.name AS item_name 
       FROM reservations r 
       JOIN users u ON r.user_id = u.ID 
       JOIN items i ON r.item_id = i.id 
       WHERE r.status = 'Pending' 
       ORDER BY r.created_at DESC 
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/accept', acceptReservation);
router.put('/:id/decline', declineReservation);
router.post('/:id/remind', sendReminder);
router.post('/message', sendMessage);

module.exports = router;