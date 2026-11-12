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

router.use(checkAdmin);

router.get('/', getAllReservations);
router.get('/stats', getStats);

// Fetch the actual list of pending reservations for the dropdown
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
router.put('/:id/cancel', cancelReservation);
router.post('/:id/remind', sendReminder);
router.post('/message', sendMessage);

module.exports = router;