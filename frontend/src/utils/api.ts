// src/utils/api.ts
import axios from "axios";

const BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const isAuthRoute =
      config.url?.endsWith("/login") || config.url?.endsWith("/signup");

    if (!isAuthRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – clearing token");
      localStorage.removeItem("token");
      window.location.href = "/login"; // optional: redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
