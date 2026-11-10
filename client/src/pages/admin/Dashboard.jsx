import { useEffect, useState } from 'react';
import API from '../../services/api'; // Make sure this path is correct
import { FaClock, FaCheckCircle, FaBox, FaUsers } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, totalItems: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from your backend
    API.get('/reservations/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <div className="card-icon" style={{ color: '#f59e0b' }}><FaClock size={30} /></div>
          <h3>{stats.pending}</h3>
          <p>Pending Requests</p>
        </div>
        
        <div className="card">
          <div className="card-icon" style={{ color: '#22c55e' }}><FaCheckCircle size={30} /></div>
          <h3>{stats.accepted}</h3>
          <p>Active Reservations</p>
        </div>
        
        <div className="card">
          <div className="card-icon" style={{ color: '#0ea5e9' }}><FaBox size={30} /></div>
          <h3>{stats.totalItems}</h3>
          <p>Total Equipment Items</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ color: '#8b5cf6' }}><FaUsers size={30} /></div>
          <h3>{stats.totalUsers}</h3>
          <p>Total Registered Users</p>
        </div>
      </div>
    </div>
  );
}