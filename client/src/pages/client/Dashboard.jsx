import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { ClientAPI } from '../../services/api';
import { FaBell, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import '../../App.css';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Notification Dropdown State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!savedUser || !savedUser.id) {
      setErrorMessage("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    ClientAPI.get(`/my-reservations/${savedUser.id}`)
      .then(res => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch(err => {
        setErrorMessage(`Could not load reservations: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter for notifications (Anything not pending)
  const notifications = reservations.filter(r => r.status !== 'Pending');
  // Filter for the main dashboard view (Only pending and accepted)
  const activeReservations = reservations.filter(r => r.status === 'Pending' || r.status === 'Accepted');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes = '00'] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
  };

  const formatTimeRange = (start, end) => {
    if (!start && !end) return '';
    if (!end) return formatTime(start);
    return `${formatTime(start)} – ${formatTime(end)}`;
  };

  const getStatusIcon = (status) => {
    if (status === 'Accepted') return <FaCheckCircle color="#22c55e" size={16} />;
    if (status === 'Declined') return <FaTimesCircle color="#ef4444" size={16} />;
    if (status === 'Cancelled') return <FaTimesCircle color="#f59e0b" size={16} />;
    return null;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR WITH NOTIFICATIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Dashboard</h2>
            <p style={{ margin: '5px 0 0 0' }}>Welcome to your dashboard!</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* BELL ICON */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <FaBell color={isNotifOpen ? "#0ea5e9" : "#64748b"} size={22} />
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-8px',
                    backgroundColor: '#ef4444', color: 'white',
                    fontSize: '0.65rem', fontWeight: 'bold',
                    padding: '2px 5px', borderRadius: '50%',
                    minWidth: '16px', textAlign: 'center'
                  }}>
                    {notifications.length}
                  </span>
                )}
              </div>

              {/* NOTIFICATION DROPDOWN */}
              {isNotifOpen && (
                <div style={{
                  position: 'absolute', top: '35px', right: '0', width: '350px',
                  backgroundColor: 'white', borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0',
                  zIndex: 10000, maxHeight: '400px', overflowY: 'auto'
                }}>
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#1e293b' }}>
                    Request Updates
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No new updates.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '15px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          {getStatusIcon(n.status)}
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                            {n.item_name} - {n.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                          {n.decline_reason && (
                            <div style={{ color: '#ef4444', marginTop: '4px' }}>
                              <strong>Reason:</strong> {n.decline_reason}
                            </div>
                          )}
                          <div style={{ marginTop: '4px', color: '#94a3b8' }}>
                            {formatDate(n.reservation_date)} at {formatTime(n.start_time)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button onClick={() => navigate('/reservation')} className="submit-btn" style={{ padding: '10px 20px', width: 'auto' }}>
              + New Reservation
            </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {errorMessage && <div className="error-container">{errorMessage}</div>}

        {/* MAIN DASHBOARD CONTENT (Active/Pending Only) */}
        {!loading && !errorMessage && activeReservations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
            <FaCalendarAlt size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <p>You have no active or pending reservations.</p>
          </div>
        )}

        {!loading && activeReservations.length > 0 && (
          <ul className="item-list">
            {activeReservations.map(r => (
              <li key={r.id} className="item-card">
                <div className="item-details">
                  <h4 style={{ margin: '0 0 5px 0' }}>{r.item_name} (x{r.quantity})</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Status: <span style={{ fontWeight: 'bold', color: r.status === 'Accepted' ? '#22c55e' : '#f59e0b' }}>{r.status}</span>
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    {formatDate(r.reservation_date)} | {formatTimeRange(r.start_time, r.end_time)}
                  </p>
                </div>
                {r.status === 'Pending' && (
                  <button
                    onClick={() => navigate(`/edit-reservation/${r.id}`, { state: { reservation: r } })}
                    className="submit-btn"
                    style={{ width: 'auto', padding: '8px 16px', marginTop: '10px', fontSize: '0.8rem' }}>Edit Request</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Dashboard;