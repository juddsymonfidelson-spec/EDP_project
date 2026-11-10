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

router.use(checkAdmin); 

router.get('/', getAllReservations);
router.get('/stats', getStats);
router.put('/:id/accept', acceptReservation);
router.put('/:id/decline', declineReservation);
router.put('/:id/cancel', cancelReservation);

router.post('/:id/remind', sendReminder);
router.post('/message', sendMessage);

module.exports = router;