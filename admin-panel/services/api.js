import axios from 'axios';

/**
 * API base URL
 * - Uses environment variable in production (Render / Vercel)
 * - Falls back to Render backend if env is missing
 */
const API_BASE =
  import.meta.env.VITE_API_BASE || 'https://mens-connect.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // optional but recommended
});

/**
 * Automatically attach admin token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Optional: global response error handler
 * (you can expand this later)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: token expired / unauthorized
    if (error?.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // window.location.href = '/login'; // optional auto-logout
    }
    return Promise.reject(error);
  }
);

export default api;
