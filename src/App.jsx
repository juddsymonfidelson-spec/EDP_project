import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Reservation from "./pages/Reservation";
import Equipment from "./pages/Equipment";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Routes>

      <Route
        path="/dashboard"
        element={
          <Dashboard onLogout={handleLogout} />
        }
      />

      <Route
        path="/reservation"
        element={
          <Reservation onLogout={handleLogout} />
        }
      />

      <Route
        path="/equipment"
        element={
          <Equipment onLogout={handleLogout} />
        }
      />

      <Route
        path="/login"
        element={
          <Login />
        }
      />

      <Route
        path="/"
        element={
          <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
}

export default App;