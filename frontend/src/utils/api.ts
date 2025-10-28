import axios from 'axios';

// ✅ Backend now runs on port 4000
const BASE_URL = 'http://localhost:4000';

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const isAuthRoute =
      config.url?.endsWith('/login') || config.url?.endsWith('/signup');

    if (!isAuthRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
