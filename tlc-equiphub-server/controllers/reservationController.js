const { db, pool } = require('../config/db');

// GET FUNCTIONS
const getAllReservations = async (req, res) => {
  try {
    const { status, search = '' } = req.query;
    let sql = `
      SELECT r.*, u.UserName AS client_name, u.Email AS client_email, i.name AS item_name
      FROM reservations r
      JOIN users u ON r.user_id = u.ID
      JOIN items i ON r.item_id = i.id
      WHERE 1=1
    `;
    const params = [];
    if (status && status !== 'All') { sql += ' AND r.status = ?'; params.push(status); }
    if (search) { sql += ' AND (u.UserName LIKE ? OR i.name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    sql += ' ORDER BY r.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getStats = async (req, res) => {
  try {
    const [[{ pending }]] = await db.query("SELECT COUNT(*) AS pending FROM reservations WHERE status = 'Pending'");
    const [[{ accepted }]] = await db.query("SELECT COUNT(*) AS accepted FROM reservations WHERE status = 'Accepted'");
    const [[{ totalItems }]] = await db.query('SELECT COUNT(*) AS totalItems FROM items');
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    res.json({ pending, accepted, totalItems, totalUsers });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ACTION FUNCTIONS
const acceptReservation = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.promise().getConnection();
  try {
    await conn.beginTransaction();
    
    const [[resv]] = await conn.query(
      `SELECT r.*, i.stock, i.name AS item_name, u.UserName AS full_name 
       FROM reservations r 
       JOIN items i ON r.item_id = i.id 
       JOIN users u ON r.user_id = u.ID 
       WHERE r.id = ?`, 
      [id]
    );
    
    if (!resv) throw new Error('Reservation not found');
    if (resv.status !== 'Pending') throw new Error('Only pending can be accepted');
    
    const [overlap] = await conn.query(
      `SELECT id FROM reservations 
       WHERE item_id = ? 
         AND status = 'Accepted' 
         AND id != ? 
         AND reservation_date = ? 
         AND (start_time < ? AND end_time > ?)`,
      [resv.item_id, id, resv.reservation_date, resv.end_time, resv.start_time]
    );
    if (overlap.length > 0) throw new Error('Item already reserved for that date and time');
    
    if (resv.stock < resv.quantity) throw new Error('Not enough stock');

    await conn.query('UPDATE items SET stock = stock - ? WHERE id = ?', [resv.quantity, resv.item_id]);
    await conn.query('UPDATE items SET is_available = CASE WHEN stock <= 0 THEN FALSE ELSE TRUE END WHERE id = ?', [resv.item_id]);
    await conn.query('UPDATE reservations SET status = ? WHERE id = ?', ['Accepted', id]);

    await conn.query(
      `INSERT INTO messages (user_id, reservation_id, subject, body) VALUES (?, ?, 'Reservation Accepted', ?)`,
      [resv.user_id, id, `Your ${resv.item_name} reservation for ${resv.reservation_date} is confirmed.`]
    );
    
    await conn.commit();
    res.json({ message: 'Accepted' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally { conn.release(); }
};

const declineReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Unspecified' } = req.body;
    const [[resv]] = await db.query(
      `SELECT r.*, i.name AS item_name, u.UserName AS full_name FROM reservations r JOIN items i ON r.item_id = i.id JOIN users u ON r.user_id = u.ID WHERE r.id = ?`, [id]
    );
    if (!resv || resv.status !== 'Pending') return res.status(400).json({ error: 'Invalid reservation' });

    await db.query('UPDATE reservations SET status = ?, decline_reason = ? WHERE id = ?', ['Declined', reason, id]);
    
    await db.query(
      `INSERT INTO messages (user_id, reservation_id, subject, body) VALUES (?, ?, 'Reservation Declined', ?)`,
      [resv.user_id, id, `Reason: ${reason}`]
    );

    res.json({ message: 'Declined' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const cancelReservation = async (req, res) => {
  const { id } = req.params;
  const { reason = 'Cancelled by Admin' } = req.body || {};
  
  const conn = await pool.promise().getConnection();
  try {
    await conn.beginTransaction();
    const [[resv]] = await conn.query(
      `SELECT r.*, i.name AS item_name, u.UserName AS full_name FROM reservations r JOIN items i ON r.item_id = i.id JOIN users u ON r.user_id = u.ID WHERE r.id = ?`, [id]
    );
    if (!resv || resv.status !== 'Accepted') throw new Error('Only accepted can be cancelled');

    await conn.query('UPDATE items SET stock = stock + ? WHERE id = ?', [resv.quantity, resv.item_id]);
    await conn.query('UPDATE items SET is_available = TRUE WHERE id = ?', [resv.item_id]);
    await conn.query('UPDATE reservations SET status = ?, decline_reason = ? WHERE id = ?', ['Cancelled', reason, id]);

    await conn.query(
      `INSERT INTO messages (user_id, reservation_id, subject, body) VALUES (?, ?, 'Reservation Cancelled', ?)`,
      [resv.user_id, id, `Reason: ${reason}`]
    );
    
    await conn.commit();
    res.json({ message: 'Cancelled' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally { conn.release(); }
};

const markAsReturned = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.promise().getConnection();
  try {
    await conn.beginTransaction();
    const [[resv]] = await conn.query(
      `SELECT r.*, i.name AS item_name, u.UserName AS full_name 
       FROM reservations r 
       JOIN items i ON r.item_id = i.id 
       JOIN users u ON r.user_id = u.ID 
       WHERE r.id = ?`, 
      [id]
    );
    if (!resv || resv.status !== 'Accepted') throw new Error('Only accepted can be marked as returned');

    await conn.query('UPDATE items SET stock = stock + ? WHERE id = ?', [resv.quantity, resv.item_id]);
    await conn.query('UPDATE items SET is_available = TRUE WHERE id = ?', [resv.item_id]);
    await conn.query('UPDATE reservations SET status = ? WHERE id = ?', ['Returned', id]);
    await conn.commit();

    res.json({ message: 'Marked as returned' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally { conn.release(); }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      'DELETE FROM reservations WHERE id = ? AND status != "Pending"',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Cannot delete a pending reservation. Accept or decline it first.' });
    }

    res.json({ message: 'Transaction record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NOTIFICATION FUNCTIONS
const sendReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const [[resv]] = await db.query(
      `SELECT r.*, i.name AS item_name, u.UserName AS full_name FROM reservations r JOIN items i ON r.item_id = i.id JOIN users u ON r.user_id = u.ID WHERE r.id = ?`, [id]
    );
    if (!resv) return res.status(404).json({ error: 'Reservation not found' });

    // Instead of email, save a reminder message
    await db.query(
      `INSERT INTO messages (user_id, reservation_id, subject, body) VALUES (?, ?, 'Return Reminder', ?)`,
      [resv.user_id, id, `Reminder: Your ${resv.item_name} is scheduled for ${resv.reservation_date} at ${resv.start_time}.`]
    );

    res.json({ message: 'Reminder sent' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const sendMessage = async (req, res) => {
  try {
    const { userId, reservationId, subject, body } = req.body;
    const [[user]] = await db.query('SELECT * FROM users WHERE ID = ?', [userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await db.query(
      `INSERT INTO messages (user_id, reservation_id, subject, body) VALUES (?, ?, ?, ?)`,
      [userId, reservationId || null, subject, body]
    );

    res.json({ message: 'Message sent' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { 
  getAllReservations, 
  getStats, 
  acceptReservation, 
  declineReservation, 
  cancelReservation, 
  sendReminder,
  sendMessage,
  deleteReservation,
  markAsReturned
};