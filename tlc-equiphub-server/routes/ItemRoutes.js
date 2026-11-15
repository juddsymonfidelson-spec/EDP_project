const express = require('express');
const router = express.Router();
const { getAllItems, addItem, updateItem, deleteItem } = require('../controllers/itemController');
const { checkAdmin } = require('../middleware/checkAdmin');

// PUBLIC: Anyone logged in can view items
router.get('/', getAllItems);

// PROTECTED: Only admins can add, update, or delete
router.use(checkAdmin);
router.post('/', addItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;