import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  // const reservations = [];

  return (
    <div className="dashboard-layout">

      <Sidebar onLogout={onLogout} />

      <main className="main-content">

        <div className="dashboard-content">
          <div className="welcome-banner">

            {/* <div>
            </div> */}

            <button className="primary-button"onClick={() => navigate("/reservation")}>+ New Reservation</button>
          </div>
        </div>


        <div id="reserved"> {/*hard coded muna*/}
          <h4>Item        |reserved by      |Date and time </h4>
          <p>projector    |John Doe         |19/10/20026 10:00 AM - 11:00 AM</p>
          <p>Speacker    |John Doe         |20/10/20026 10:00 AM - 11:00 AM</p>
          <p>projector    |John Doe         |30/10/20026 10:00 AM - 11:00 AM</p>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
