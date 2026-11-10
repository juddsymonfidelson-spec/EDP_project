import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function History() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/reservations');
      // Filter out 'Pending' so we only see processed ones
      const processed = res.data.filter(r => r.status !== 'Pending');
      setHistory(processed);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleCancel = async (id) => {
    const reason = prompt('Enter reason for cancelling this reservation:');
    if (reason) {
      try {
        await API.put(`/reservations/${id}/cancel`, { reason });
        fetchHistory();
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

  return (
    <div>
      <h1>Reservation History</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Client</th><th>Item</th><th>Status</th><th>Dates</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr><td colSpan="6">No history yet.</td></tr>
          ) : (
            history.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.client_name}</td>
                <td>{r.item_name}</td>
                <td><strong>{r.status}</strong></td>
                <td>{r.start_date} to {r.end_date}</td>
                <td>
                  {r.status === 'Accepted' && (
                    <>
                      <button className="btn btn-primary" onClick={() => handleRemind(r.id)} style={{ marginRight: '5px' }}>
                        Send Reminder
                      </button>
                      <button className="btn btn-danger" onClick={() => handleCancel(r.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}