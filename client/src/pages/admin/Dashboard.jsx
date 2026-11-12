import { useEffect, useState } from 'react';
import API from '../../services/api';
import { FaClock, FaCheckCircle, FaBox, FaUsers } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, totalItems: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reservations/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '40px', fontSize: '1.2rem' }}>Loading dashboard...</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: 0 }}>Dashboard Overview</h1>
      </div>

      {/* CSS GRID LAYOUT FOR CARDS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', /* 4 equal columns */
        gap: '25px', 
        width: '100%' 
      }}>
        
        {/* Card 1 */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '10px' }}>
            <FaClock size={24} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '2.5rem', color: '#1e293b', margin: '15px 0 5px 0' }}>{stats.pending}</h3>
          <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>Pending Requests</p>
        </div>
        
        {/* Card 2 */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '10px' }}>
            <FaCheckCircle size={24} color="#22c55e" />
          </div>
          <h3 style={{ fontSize: '2.5rem', color: '#1e293b', margin: '15px 0 5px 0' }}>{stats.accepted}</h3>
          <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>Active Reservations</p>
        </div>
        
        {/* Card 3 */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ backgroundColor: '#e0f2fe', padding: '12px', borderRadius: '10px' }}>
            <FaBox size={24} color="#0ea5e9" />
          </div>
          <h3 style={{ fontSize: '2.5rem', color: '#1e293b', margin: '15px 0 5px 0' }}>{stats.totalItems}</h3>
          <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>Total Equipment</p>
        </div>

        {/* Card 4 */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ backgroundColor: '#f3e8ff', padding: '12px', borderRadius: '10px' }}>
            <FaUsers size={24} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '2.5rem', color: '#1e293b', margin: '15px 0 5px 0' }}>{stats.totalUsers}</h3>
          <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>Registered Users</p>
        </div>

      </div>
    </div>
  );
}