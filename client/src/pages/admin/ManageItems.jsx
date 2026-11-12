import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', stock: 0, description: '', image_url: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  
  // State for the image zoom modal
  const [zoomImage, setZoomImage] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Fix: Ensure stock is a number and availability is correctly calculated
      const payload = {
        ...form,
        stock: Number(form.stock),
        is_available: Number(form.stock) > 0 ? 1 : 0
      };

      if (editId) {
        await API.put(`/items/${editId}`, payload);
      } else {
        await API.post('/items', payload);
      }
      
      setForm({ name: '', category: '', stock: 0, description: '', image_url: '' });
      setEditId(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await API.delete(`/items/${id}`);
      fetchItems();
    }
  };

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
      <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '30px' }}>Manage Items</h1>
      
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h3 style={{ gridColumn: 'span 2', margin: '0 0 10px 0', color: '#1e293b' }}>
          {editId ? 'Edit Item' : 'Add New Item'}
        </h3>
        
        <input placeholder="Item Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required />
        
        {/* Fixed: Added explicit "Stock" placeholder */}
        <input 
          type="number" 
          placeholder="Stock" 
          value={form.stock} 
          onChange={(e) => setForm({...form, stock: e.target.value})} 
          required 
        />
        
        <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{ gridColumn: 'span 2', minHeight: '80px' }} />
        
        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px' }}>
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Item' : 'Add Item'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ name: '', category: '', stock: 0, description: '', image_url: '' }); }} className="btn" style={{ backgroundColor: '#64748b' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      width="50" 
                      height="50" 
                      style={{ objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} 
                      onClick={() => setZoomImage(item.image_url)}
                    />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}></div>
                  )}
                </td>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td>{item.category}</td>
                
                {/* Fixed: Added Description column */}
                <td style={{ maxWidth: '250px', whiteSpace: 'normal', fontSize: '0.8rem', color: '#64748b' }}>
                  {item.description || '—'}
                </td>
                
                <td>{item.stock}</td>
                <td>
                  <span className={`badge ${item.is_available ? 'badge-available' : 'badge-unavailable'}`}>
                    {item.is_available ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" onClick={() => handleEditClick(item)} style={{ padding: '8px 14px' }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)} style={{ padding: '8px 14px' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IMAGE ZOOM MODAL */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', zIndex: 99999,
            cursor: 'pointer'
          }}
        >
          <img 
            src={zoomImage} 
            alt="Zoomed" 
            style={{ 
              maxWidth: '90%', maxHeight: '90%', 
              borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
            }} 
          />
        </div>
      )}
    </div>
  );
}