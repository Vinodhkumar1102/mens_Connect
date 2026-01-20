import { useEffect, useState } from 'react';
import api from '../../services/api';

const showToast = (message, type = 'success') => {
  const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3';
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: ${bgColor};
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/profile');
      setUsers(res.data.data || []);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (phone) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await api.delete(`/api/profile/${phone}`);
      setUsers(users.filter(u => u.phone !== phone));
      showToast('✅ User deleted successfully');
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Failed to delete user'), 'error');
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="users-wrap">
      <h2>👤 Users</h2>

      {users.length === 0 && <p>No users found</p>}

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id || idx}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={u.avatar || 'https://via.placeholder.com/48'}
                    alt="avatar"
                    width="48"
                    height="48"
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                </td>
                <td>{u.fullName || '-'}</td>
                <td>{u.phone}</td>
                <td>{u.gender || '-'}</td>
                <td>{u.dob || '-'}</td>
                <td>{u.isActive ? 'Active' : 'Deleted'}</td>
                <td>
                  <button className="users-delete" onClick={() => deleteUser(u.phone)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
