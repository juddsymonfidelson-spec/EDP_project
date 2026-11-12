import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaClipboardList, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>TLC</div>
        <h2 style={{ fontSize: '1.2rem', color: 'white', fontWeight: '600', margin: 0 }}>Admin</h2>
      </div>
      
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <FaTachometerAlt /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/items" className={({ isActive }) => isActive ? "active" : ""}>
            <FaBox /> Manage Items
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/reservations" className={({ isActive }) => isActive ? "active" : ""}>
            <FaClipboardList /> Reservations
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/transactions" className={({ isActive }) => isActive ? "active" : ""}>
            <FaExchangeAlt /> Transactions
          </NavLink>
        </li>
      </ul>

      {/* Logout Button at the bottom of the sidebar */}
      <div style={{ padding: '20px 12px', borderTop: '1px solid #1e293b' }}>
        <button 
          onClick={handleLogout} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            width: '100%', 
            padding: '12px 16px', 
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '600', 
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}