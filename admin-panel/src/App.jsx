import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  console.log('📱 App.jsx - Current loggedIn state:', loggedIn);
  console.log('📱 App.jsx - Token in localStorage:', !!localStorage.getItem('adminToken'));

  if (!loggedIn) {
    return <Login onLogin={(value) => {
      console.log('🔄 Login callback triggered with value:', value);
      setLoggedIn(value);
    }} />;
  }

  console.log('✅ User is logged in, showing Dashboard');

  return (
    <Dashboard
      onLogout={() => {
        console.log('🚪 Logout triggered');
        localStorage.removeItem('adminToken');
        setLoggedIn(false);
      }}
    />
  );
}
