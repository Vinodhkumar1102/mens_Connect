import { useState } from 'react';
import api from '../../services/api';
import './Login.css';
import bgImage from '../assets/bg.jpeg'; // correct relative path to assets
import logo from '../assets/lg.jpg';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/admin/login', { email, password });
      console.log('✅ Login successful, token:', res.data.token);
      localStorage.setItem('adminToken', res.data.token);
      console.log('💾 Token saved to localStorage');
      console.log('🔄 Calling onLogin callback...');
      onLogin(true);
      console.log('✅ onLogin callback completed');
    } catch (err) {
      console.error('❌ Login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="admin-navbar">
        <div className="nav-left">
          <img src={logo} alt="logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <div className="nav-title">Blood Management System</div>
        </div>
        <div className="nav-right" />
      </header>

      <div className="login-block">
        <div className="login-card">
          <h2>🔐 Admin Login</h2>

          <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
          <div className="quote">“Donate blood, save lives.”</div>
        </div>

        <div className="below-card-text">GIVE BLOOD - SAVE LIFE</div>
      </div>
      <footer className="site-footer">© 2026 ALL Rights Reserved By Datavibes SofttTech Pvt Ltd</footer>
    </div>
  );
}
