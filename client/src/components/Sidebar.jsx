import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCalendarCheck, FaSignOutAlt } from "react-icons/fa";

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2>TLC EquipHub</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/reservation"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaCalendarCheck />
            <span>Reservations</span>
          </NavLink>
        </nav>
      </div>

      <button onClick={onLogout} className="logout-btn">
        <FaSignOutAlt style={{ marginRight: "8px" }} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;