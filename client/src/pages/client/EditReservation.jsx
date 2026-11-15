import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ClientAPI } from '../../services/api';
import '../../App.css';

function EditReservation({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const existing = location.state?.reservation;

  const [quantity, setQuantity] = useState(1);
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setQuantity(existing.quantity || 1);
      setReservationDate(existing.reservation_date ? existing.reservation_date.split('T')[0] : '');
      setStartTime(existing.start_time ? existing.start_time.substring(0, 5) : '');
      setEndTime(existing.end_time ? existing.end_time.substring(0, 5) : '');
    }
  }, [existing]);

  if (!existing) {
    return (
      <div className="dashboard-layout">
        <Sidebar onLogout={onLogout} />
        <main className="main-content">
          <p>No reservation found.</p>
          <button onClick={() => navigate('/dashboard')}>Back</button>
        </main>
      </div>
    );
  }

  const handleSave = async () => {
    if (!reservationDate || !startTime || !endTime) {
      alert('Please select date, start time, and end time.');
      return;
    }
    if (endTime <= startTime) {
      alert('End time must be after start time.');
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    setSaving(true);

    try {
      await ClientAPI.put(`/reservations/${existing.id}`, {
        user_id: savedUser.id,
        quantity: Number(quantity),
        reservation_date: reservationDate,
        start_time: startTime,
        end_time: endTime
      });
      setSubmitMessage('✅ Updated successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setSubmitMessage('❌ Failed: ' + (err.response?.data?.error || err.message));
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation request?')) return;
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    setSaving(true);

    try {
      await ClientAPI.delete(`/reservations/${existing.id}`, {
        data: { userId: savedUser.id }
      });
      setSubmitMessage('🗑️ Reservation cancelled. Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setSubmitMessage('❌ Failed to cancel: ' + (err.response?.data?.error || err.message));
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      <main className="main-content">
        <h2>Edit Reservation</h2>
        {submitMessage && <p style={{ color: 'green', marginBottom: 20 }}>{submitMessage}</p>}

        <div style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <h4>📦 Equipment</h4>
          <strong>{existing.item_name}</strong> — Status: {existing.status}
        </div>

        <div style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <h4>🔢 Quantity</h4>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} 
            style={{ width: 120, padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>

        <div style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <h4>📅 Date & Time</h4>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label>Date</label>
              <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 5 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 5 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label>End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 5 }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleSave} disabled={saving} className="submit-btn" style={{ width: 'auto', padding: '12px 24px' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleCancel} disabled={saving} style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            Cancel
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            Back
          </button>
        </div>
      </main>
    </div>
  );
}

export default EditReservation;