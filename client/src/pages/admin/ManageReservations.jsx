import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    try {
      const res = await API.get('/reservations?status=Pending');
      setReservations(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAccept = async (id) => {
    setError('');
    try {
      await API.put(`/reservations/${id}/accept`);
      fetchPending(); // Refresh list
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

  return (
    <div>
      <h1>Pending Reservations</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Client</th><th>Item</th><th>Qty</th><th>Dates</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr><td colSpan="6">No pending requests.</td></tr>
          ) : (
            reservations.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.client_name}</td>
                <td>{r.item_name}</td>
                <td>{r.quantity}</td>
                <td>{r.start_date} to {r.end_date}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleAccept(r.id)} style={{ marginRight: '5px' }}>Accept</button>
                  <button className="btn btn-danger" onClick={() => handleDecline(r.id)}>Decline</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}