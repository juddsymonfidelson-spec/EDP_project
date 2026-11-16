import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Accepted');

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/reservations');
      const processed = res.data.filter(r => r.status !== 'Pending');
      setTransactions(processed);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleCancel = async (id) => {
    const reason = prompt('Enter reason for cancelling this reservation:');
    if (reason === null) return; // user clicked Cancel on the prompt
    if (!reason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    try {
      await API.put(`/reservations/${id}/cancel`, { reason });
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel');
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Confirm that the item has been returned? Stock will be added back.')) {
      try {
        await API.put(`/reservations/${id}/return`);
        fetchTransactions();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to mark as returned');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this record from the history?')) {
      try {
        await API.delete(`/reservations/${id}`);
        fetchTransactions();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete');
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Accepted: { backgroundColor: '#dcfce7', color: '#166534' },
      Declined: { backgroundColor: '#fee2e2', color: '#991b1b' },
      Cancelled: { backgroundColor: '#fef3c7', color: '#92400e' },
      Returned: { backgroundColor: '#dbeafe', color: '#1e40af' }
    };
    return (
      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', ...(styles[status] || { backgroundColor: '#f1f5f9', color: '#475569' }) }}>
        {status}
      </span>
    );
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '—';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredTransactions = transactions.filter(t => t.status === activeTab);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '30px' }}>Transactions</h1>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['Accepted', 'Declined', 'Cancelled', 'Returned'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === tab ? '#0ea5e9' : '#e2e8f0',
              color: activeTab === tab ? 'white' : '#64748b'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No {activeTab.toLowerCase()} transactions yet.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td style={{ fontWeight: '500' }}>{r.client_name}</td>
                  <td>{r.item_name}</td>
                  <td>{r.quantity}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  
                  <td>{r.reservation_date ? new Date(r.reservation_date).toLocaleDateString() : '—'}</td>
                  <td>{formatTime(r.start_time)}</td>
                  <td>{formatTime(r.end_time)}</td>
                  
                  <td style={{ color: '#64748b', fontSize: '0.85rem', whiteSpace: 'normal', maxWidth: '200px' }}>
                    {r.decline_reason || '—'}
                  </td>
                  
                  <td>
                    {r.status === 'Accepted' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-success" onClick={() => handleReturn(r.id)} style={{ padding: '8px 14px' }}>Returned</button>
                        <button className="btn btn-danger" onClick={() => handleCancel(r.id)} style={{ padding: '8px 14px' }}>Cancel</button>
                      </div>
                    ) : (
                      <button 
                        className="btn" 
                        onClick={() => handleDelete(r.id)} 
                        style={{ padding: '8px 14px', backgroundColor: '#64748b' }}
                      >
                        Delete Record
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}