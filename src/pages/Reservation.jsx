import Sidebar from "../components/Sidebar";

function Reservation({ onLogout }) {
  return (
    <div className="dashboard-layout">

      <Sidebar onLogout={onLogout} />

      <main className="main-content">

        <h2>Reservations</h2>

        <p>
          konwari may page
        </p>

      </main>

    </div>
  );
}

export default Reservation;
