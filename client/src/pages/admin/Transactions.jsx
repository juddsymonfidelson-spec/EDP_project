import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Accepted'); // Default tab

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
    if (reason) {
      try {
        await API.put(`/reservations/${id}/cancel`, { reason });
        fetchTransactions();
      } catch (err) { alert(err.response?.data?.error || 'Failed to cancel'); }
    }
  };

  const handleRemind = async (id) => {
    try {
      await API.post(`/reservations/${id}/remind`);
      alert('Reminder email sent successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reminder');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

  // Filter transactions based on the active tab
  const filteredTransactions = transactions.filter(t => t.status === activeTab);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '30px' }}>Transactions</h1>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['Accepted', 'Declined', 'Cancelled'].map(tab => (
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
              <th>Reserve Date</th>
              <th>Return Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
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
                  <td>{formatDate(r.start_date)}</td>
                  <td>{formatDate(r.end_date)}</td>
                  
                  <td style={{ color: '#64748b', fontSize: '0.85rem', whiteSpace: 'normal', maxWidth: '200px' }}>
                    {r.decline_reason || '—'}
                  </td>
                  
                  <td>
                    {r.status === 'Accepted' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary" onClick={() => handleRemind(r.id)} style={{ padding: '8px 14px' }}>Remind</button>
                        <button className="btn btn-danger" onClick={() => handleCancel(r.id)} style={{ padding: '8px 14px' }}>Cancel</button>
                      </div>
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