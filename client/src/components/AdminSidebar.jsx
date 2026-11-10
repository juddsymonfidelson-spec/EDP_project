import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaClipboardList, FaHistory, FaSignOutAlt } from 'react-icons/fa';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <h2>TLC Admin</h2>
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
          <NavLink to="/admin/history" className={({ isActive }) => isActive ? "active" : ""}>
            <FaHistory /> History
          </NavLink>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}