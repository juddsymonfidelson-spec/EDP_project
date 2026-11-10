import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', stock: 0, description: '', image_url: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await API.put(`/items/${editId}`, form);
      } else {
        await API.post('/items', form);
      }
      setForm({ name: '', category: '', stock: 0, description: '', image_url: '' });
      setEditId(null);
      fetchItems(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.error || 'Cannot delete item');
      }
    }
  };

  // Handle Edit click (populate form)
  const handleEditClick = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      description: item.description || '',
      image_url: item.image_url || ''
    });
    setEditId(item.id);
  };

  return (
    <div>
      <h1>Manage Items</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>{editId ? 'Edit Item' : 'Add New Item'}</h3>
        <div>
          <input 
            placeholder="Name" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            required 
          />
          <input 
            placeholder="Category" 
            value={form.category} 
            onChange={(e) => setForm({...form, category: e.target.value})} 
            required 
          />
          <input 
            type="number" 
            placeholder="Stock" 
            value={form.stock} 
            onChange={(e) => setForm({...form, stock: e.target.value})} 
            required 
          />
          <input 
            placeholder="Image URL (optional)" 
            value={form.image_url} 
            onChange={(e) => setForm({...form, image_url: e.target.value})} 
          />
        </div>
        <div>
          <textarea 
            placeholder="Description" 
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})} 
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editId ? 'Update Item' : 'Add Item'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ name: '', category: '', stock: 0, description: '', image_url: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.stock}</td>
              <td>{item.is_available ? 'Available' : 'Out of Stock'}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEditClick(item)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}