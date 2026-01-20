import React, { useEffect, useState } from 'react';
import './DashboardNavbar.css';
import logo from '../assets/lg.jpg';
import { FaBell } from 'react-icons/fa';
import api from '../../services/api';

export default function DashboardNavbar({ onNotifyClick }) {
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending blood requests count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await api.get('/api/blood-requests/count/pending');
        console.log('📊 Pending count response:', response.data);
        if (response.data.success) {
          setPendingCount(response.data.count);
          console.log('✅ Pending blood requests:', response.data.count);
        }
      } catch (error) {
        console.error('❌ Failed to fetch pending count:', error);
      }
    };

    fetchPendingCount();
    // Refresh count every 10 seconds
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNotify = (e) => {
    e.preventDefault();
    if (typeof onNotifyClick === 'function') onNotifyClick();
  };

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
      </div>

      <div className="navbar-center">Admin Administration</div>

      <div className="navbar-right">
        <button type="button" className="nav-notif" onClick={handleNotify} aria-label="Notifications">
          <FaBell />
          {pendingCount > 0 && <span className="notif-badge">{pendingCount}</span>}
        </button>
      </div>
    </header>
  );
}
