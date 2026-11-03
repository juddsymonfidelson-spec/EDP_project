const express = require('express');
const router = express.Router();
const { getAllReservations, getStats, acceptReservation, declineReservation, cancelReservation } = require('../controllers/reservationController');
const { checkAdmin } = require('../middleware/checkAdmin');

router.use(checkAdmin); // Protects all routes below

router.get('/', getAllReservations);
router.get('/stats', getStats);
router.put('/:id/accept', acceptReservation);
router.put('/:id/decline', declineReservation);
router.put('/:id/cancel', cancelReservation);

module.exports = router;