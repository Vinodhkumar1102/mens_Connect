import { useEffect, useState } from 'react';
import api from '../../services/api';
import './BloodRequests.css';

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

export default function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = () => {
    api.get('/api/blood-requests')
      .then(res => setRequests(res.data.data))
      .catch(() => showToast('Failed to load blood requests', 'error'));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await api.patch(`/api/blood-requests/${id}`, { status: 'approved' });
      showToast('✅ Request approved! User notified.');
      fetchRequests();
    } catch (err) {
      showToast('❌ Failed to approve request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id) => {
    setLoading(false);
    try {
      await api.patch(`/api/blood-requests/${id}`, { status: 'declined' });
      showToast('✅ Request declined!');
      fetchRequests();
    } catch (err) {
      showToast('❌ Failed to decline request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requests-wrap">
      <h2>🩸 Blood Requests</h2>

      <div className="requests-table-wrap">
        <table className="requests-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Location</th>
              <th>Hospital</th>
              <th>Urgency</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, idx) => {
              const location = r.location || r.city || r.address || r.district || '—';
              return (
                <tr key={r._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{r.fullName}</td>
                  <td>{r.bloodGroup}</td>
                  <td>{location}</td>
                  <td>{r.hospital}</td>
                  <td>{r.urgency}</td>
                  <td>{r.contact}</td>
                  <td>
                    {r.status === 'pending' ? (
                      <div className="action-buttons">
                        <button 
                          className="btn-approve" 
                          onClick={() => handleApprove(r._id)}
                          disabled={loading}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="btn-decline" 
                          onClick={() => handleDecline(r._id)}
                          disabled={loading}
                        >
                          ✕ Decline
                        </button>
                      </div>
                    ) : (
                      <span className={`status-badge status-${r.status}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
