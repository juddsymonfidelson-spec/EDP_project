import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">

      <nav>

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/reservation">
          Reservations
        </NavLink>

        <NavLink to="/equipment">
          Equipment
        </NavLink>

      </nav>

      <button onClick={onLogout}>
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;
