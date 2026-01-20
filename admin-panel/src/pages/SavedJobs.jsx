import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/api/jobs')
      .then(res => setJobs(res.data.data || res.data))
      .catch(() => alert('Failed to load saved jobs'));
  }, []);

  return (
    <div className="requests-wrap">
      <h2>💾 Saved Jobs</h2>

      <div className="requests-table-wrap">
        <table className="requests-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Job Type</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Last Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j, idx) => (
              <tr key={j._id || idx}>
                <td>{idx + 1}</td>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td>{j.location}</td>
                <td>{j.jobType}</td>
                <td>{j.experience}</td>
                <td>{j.salary}</td>
                <td>{j.lastDate ? new Date(j.lastDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
