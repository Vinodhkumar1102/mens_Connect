import { useState } from 'react';
import Users from './Users';
import BloodRequests from './BloodRequests';
import AdminJobs from '../../src/pages/Adminjobs';
import SavedJobs from './SavedJobs';
import { FaUsers, FaHeartbeat, FaSave, FaTachometerAlt, FaBriefcase } from 'react-icons/fa';
import './Dashboard.css';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../../services/api';
import { useEffect } from 'react';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('users');
  const [notifCount, setNotifCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-cards">
            <div className="dc-card">
              <div className="dc-card-title"><FaUsers /> Users</div>
              <div className="dc-card-value">{usersCount}</div>
              <button className="dc-card-action" onClick={() => setActiveTab('users')}>View Users</button>
            </div>

            <div className="dc-card">
              <div className="dc-card-title"><FaHeartbeat /> Blood Requests</div>
              <div className="dc-card-value">{notifCount}</div>
              <button className="dc-card-action" onClick={() => setActiveTab('blood')}>View Requests</button>
            </div>

            <div className="dc-card">
              <div className="dc-card-title"><FaSave /> Saved Jobs</div>
              <div className="dc-card-value">{jobsCount}</div>
              <button className="dc-card-action" onClick={() => setActiveTab('saved')}>View Jobs</button>
            </div>
          </div>
        );

      case 'users':
        return <Users />;

      case 'blood':
        return <BloodRequests />;

      case 'saved':
        return <SavedJobs />;

      case 'jobs':
        return <AdminJobs />;

      default:
        return <Users />;
    }
  };

  // Poll for blood requests count for notifications
  useEffect(() => {
    let mounted = true;
    const fetchNotif = async () => {
      try {
        const res = await api.get('/api/blood-requests');
        const count = Array.isArray(res.data) ? res.data.length : (res.data.data || []).length || 0;
        if (mounted) setNotifCount(count);
      } catch (err) {
        // ignore polling errors
      }
    };

    fetchNotif();
    const iv = setInterval(fetchNotif, 5000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  // Fetch counts for dashboard cards (users and jobs)
  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const u = await api.get('/api/profile');
        const users = Array.isArray(u.data) ? u.data.length : (u.data.data || []).length || 0;
        if (mounted) setUsersCount(users);
      } catch (err) {
        // ignore
      }

      try {
        const j = await api.get('/api/jobs');
        const jobs = Array.isArray(j.data) ? j.data.length : (j.data.data || []).length || 0;
        if (mounted) setJobsCount(jobs);
      } catch (err) {
        // ignore
      }
    };

    fetchCounts();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <DashboardNavbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onLogout={onLogout}
        notificationCount={notifCount}
        onNotifyClick={() => setActiveTab('blood')}
      />

      <div className="dc-wrap dc-with-navbar">
      {/* SIDEBAR */}
      <aside className="dc-sidebar" draggable={false}>
        <div className="dc-side-brand">MensConnect</div>

        <nav className="dc-side-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>

          <button
            className={activeTab === 'blood' ? 'active' : ''}
            onClick={() => setActiveTab('blood')}
          >
            🩸 Blood Requests
          </button>

          <button
            className={activeTab === 'jobs' ? 'active' : ''}
            onClick={() => setActiveTab('jobs')}
          >
            <FaBriefcase /> Job Alerts
          </button>

          <button
            className={activeTab === 'saved' ? 'active' : ''}
            onClick={() => setActiveTab('saved')}
          >
            <FaSave /> Saved Jobs
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="dc-side-logout"
        >
          🚪 Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dc-main">
        {/* HEADER */}
        <header className="dc-header">
          <h1 className="dc-title"></h1>

          <div className="dc-actions">
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="dc-content">
          {renderContent()}
        </section>
      </main>
      </div>
    </div>
  );
}
