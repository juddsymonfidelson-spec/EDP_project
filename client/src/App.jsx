import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Dashboard from "./pages/client/Dashboard";
import Reservation from "./pages/client/Reservation";
import EditReservation from "./pages/client/EditReservation";
import SignIn from "./pages/Signin";
import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageItems from "./pages/admin/ManageItems";
import ManageReservations from "./pages/admin/ManageReservations";
import Transactions from "./pages/admin/Transactions";

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
      {/* CLIENT ROUTES */}
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/reservation" element={<Reservation onLogout={handleLogout} />} />
      <Route path="/edit-reservation/:id" element={<EditReservation onLogout={handleLogout} />} />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignIn />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="items" element={<ManageItems />} />
        <Route path="reservations" element={<ManageReservations />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}

export default App;