import { useState } from 'react';
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

export default function AdminJobs() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    experience: '',
    salary: '',
    description: '',
    skills: '',
    lastDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      await api.post('/api/jobs', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
      });

      showToast('✅ Job posted successfully');
      setMsg('✅ Job posted successfully');
      setForm({
        title: '',
        company: '',
        location: '',
        jobType: '',
        experience: '',
        salary: '',
        description: '',
        skills: '',
        lastDate: '',
      });
    } catch (err) {
      showToast('❌ Failed to post job', 'error');
      setMsg('❌ Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Post Job</h2>

      <form onSubmit={submit} className="dc-form">
        <input name="title" placeholder="Job Title *" value={form.title} onChange={handleChange} required />
        <input name="company" placeholder="Company Name *" value={form.company} onChange={handleChange} required />
        <input name="location" placeholder="Location *" value={form.location} onChange={handleChange} required />

        <select name="jobType" value={form.jobType} onChange={handleChange} required>
          <option value="">Job Type *</option>
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>

        <input name="experience" placeholder="Experience *" value={form.experience} onChange={handleChange} required />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />

        <textarea
          name="description"
          placeholder="Job Description *"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <input
          name="skills"
          placeholder="Skills * (comma separated)"
          value={form.skills}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="lastDate"
          value={form.lastDate}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>

        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
