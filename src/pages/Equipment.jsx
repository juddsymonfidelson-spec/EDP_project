import Sidebar from "../components/Sidebar";

function Equipment({ onLogout }) {
  return (
    <div className="dashboard-layout">

      <Sidebar onLogout={onLogout} />

      <main className="main-content">

        <h2>Equipment</h2>

        <p>
          konwari page
        </p>

      </main>

    </div>
  );
}

export default Equipment;
