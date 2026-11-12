import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { FaBell, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import API from '../services/api';
import '../styles/admin.css';

export default function AdminLayout() {
  const role = localStorage.getItem('userRole');
  const username = localStorage.getItem('username') || 'Admin';
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/reservations/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifClick = (id) => {
    setIsOpen(false);
    navigate(`/admin/reservations?highlight=${id}`);
  };

  if (role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content-area">
        
        <header className="admin-topbar">
          <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1rem' }}>
            Equipment Management
          </div>
          
          <div className="topbar-user">
            
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
              >
                <FaBell color={isOpen ? "#0ea5e9" : "#64748b"} size={20} />
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

              {isOpen && (
                <div style={{
                  position: 'absolute', top: '35px', right: '0', width: '320px',
                  backgroundColor: 'white', borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0',
                  zIndex: 10000, overflow: 'hidden'
                }}>
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#1e293b' }}>
                    Notifications
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No pending requests
                    </div>
                  ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotifClick(n.id)}
                          style={{
                            padding: '15px 20px', borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer', transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                            <div style={{ backgroundColor: '#fef3c7', padding: '5px', borderRadius: '50%' }}>
                              <FaCheckCircle color="#f59e0b" size={12} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                              New Request
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                            <strong>{n.client_name}</strong> requested <strong>{n.item_name}</strong>.
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                    <button onClick={() => { setIsOpen(false); navigate('/admin/reservations'); }} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>
                      View All Reservations
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
              <FaUserCircle size={22} color="#0ea5e9" />
              <span>Welcome, <strong>{username}</strong></span>
            </div>
          </div>
        </header>

        <main className="admin-scroll-area">
          <Outlet />
        </main>

      </div>
    </div>
  );
}