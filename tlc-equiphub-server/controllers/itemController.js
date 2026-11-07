const { db } = require('../index');

const getAllItems = async (req, res) => {
  try {
    const { search = '', sort = 'name' } = req.query;
    const allowedSorts = ['name', 'category', 'stock', 'is_available'];
    const sortField = allowedSorts.includes(sort) ? sort : 'name';

    const [items] = await db.query(
      `SELECT * FROM items WHERE name LIKE ? OR category LIKE ? ORDER BY ${sortField} ASC`,
      [`%${search}%`, `%${search}%`]
    );
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const addItem = async (req, res) => {
  try {
    const { name, category, stock, description, image_url } = req.body;
    await db.query(
      'INSERT INTO items (name, category, stock, description, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, stock, description || '', image_url || '', stock > 0 ? 1 : 0]
    );
    res.status(201).json({ message: 'Item added' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, stock, description, image_url, is_available } = req.body;
    await db.query(
      `UPDATE items SET name = ?, category = ?, stock = ?, description = ?, image_url = ?, is_available = ? WHERE id = ?`,
      [name, category, stock, description, image_url, is_available ? 1 : 0, id]
    );
    res.json({ message: 'Item updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteItem = async (req, res) => {
  try {
    await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAllItems, addItem, updateItem, deleteItem };