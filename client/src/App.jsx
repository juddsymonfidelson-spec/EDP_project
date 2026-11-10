import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Dashboard from "./pages/client/Dashboard";
import Reservation from "./pages/client/Reservation";
import SignIn from "./pages/Signin";
import Login from "./pages/Login";


import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageItems from "./pages/admin/ManageItems";
import ManageReservations from "./pages/admin/ManageReservations";
import History from "./pages/admin/History";



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
        path="/login"
        element={
          <Login />
        }
      />
      <Route
        path="/register"
        element={
          <SignIn />
      }
      />
      <Route
        path="/"
        element={
          <Navigate to="/login" replace />
        }
      />

        {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="items" element={<ManageItems />} />
        <Route path="reservations" element={<ManageReservations />} />
        <Route path="history" element={<History />} />
      </Route>

      
    </Routes>
  );
}

export default App;