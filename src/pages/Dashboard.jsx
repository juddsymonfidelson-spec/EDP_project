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

            <button
              className="primary-button"
              onClick={() => navigate("/reservation")}
            >
              + New Reservation
            </button>

          </div>


          <div className="dashboard-grid">


            <section className="content-card reservations-card">

              <div className="card-header">

                {/* <div>
                  <p>Recent equipment reservations</p>
                </div> */}

                <button
                  className="view-all"
                  onClick={() => navigate("/reservation")}
                >
                  View All Reservations nang ibang human peopol
                </button>

              </div>




            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
