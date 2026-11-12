import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../services/api';

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  
  const location = useLocation();

  const fetchPending = async () => {
    try {
      const res = await API.get('/reservations?status=Pending');
      setReservations(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchPending();

    const queryParams = new URLSearchParams(location.search);
    const highlight = queryParams.get('highlight');
    
    if (highlight) {
      setHighlightId(Number(highlight));
      const timer = setTimeout(() => {
        setHighlightId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const handleAccept = async (id) => {
    setError('');
    try {
      await API.put(`/reservations/${id}/accept`);
      fetchPending();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept reservation');
    }
  };

  const handleDecline = async (id) => {
    const reason = prompt('Enter reason for declining:');
    if (reason) {
      try {
        await API.put(`/reservations/${id}/decline`, { reason });
        fetchPending();
      } catch (err) { alert('Failed to decline'); }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '30px' }}>Pending Reservations</h1>
      
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Client</th><th>Item</th><th>Qty</th><th>Start Date</th><th>End Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No pending requests at the moment.
                </td>
              </tr>
            ) : (
              reservations.map(r => (
                <tr 
                  key={r.id} 
                  style={{ 
                    backgroundColor: highlightId === r.id ? '#e2e8f0' : 'transparent',
                    transition: 'background-color 0.5s ease'
                  }}
                >
                  <td>{r.id}</td>
                  <td style={{ fontWeight: '500' }}>{r.client_name}</td>
                  <td>{r.item_name}</td>
                  <td>{r.quantity}</td>
                  <td>{formatDate(r.start_date)}</td>
                  <td>{formatDate(r.end_date)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-success" onClick={() => handleAccept(r.id)} style={{ padding: '8px 14px' }}>Accept</button>
                      <button className="btn btn-danger" onClick={() => handleDecline(r.id)} style={{ padding: '8px 14px' }}>Decline</button>
                    </div>
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