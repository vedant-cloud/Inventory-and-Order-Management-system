import axios from 'axios';

// Pulls securely from Docker environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global Error Interceptor (Hides raw logs, returns clean UI messages)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.clear(); // Prevents red tracebacks in the browser console
    
    let cleanMessage = "An unexpected error occurred. Please try again.";
    
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        cleanMessage = error.response.data.detail;
      } else if (error.response.status === 404) {
        cleanMessage = "The requested resource was not found.";
      } else if (error.response.status >= 500) {
        cleanMessage = "Server error. Please try again later.";
      }
    } else if (error.request) {
      cleanMessage = "Network error. Please check your connection.";
    }

    return Promise.reject(cleanMessage);
  }
);

export default api;