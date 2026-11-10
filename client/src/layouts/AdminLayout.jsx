import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/admin.css';

export default function AdminLayout() {
  // Basic protection: Check if user is admin
  const role = localStorage.getItem('userRole');
  
  // If not admin, kick them back to login
  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <Outlet /> {/* This renders the specific admin page (Dashboard, Items, etc.) */}
      </div>
    </div>
  );
}