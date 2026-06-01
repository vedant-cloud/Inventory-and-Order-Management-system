import axios from 'axios';

// Pulls securely from the Docker .env variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Clear the console to hide raw backend tracebacks from the user
    console.clear(); 

    // 2. Format a clean, human-readable message
    let cleanMessage = "An unexpected error occurred. Please try again.";
    
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        cleanMessage = error.response.data.detail; // e.g., "SKU must be unique"
      } else if (error.response.status === 404) {
        cleanMessage = "The requested record was not found.";
      } else if (error.response.status === 500) {
        cleanMessage = "Server error. Our team has been notified.";
      }
    } else if (error.request) {
      cleanMessage = "Cannot connect to the server. Please check your connection.";
    }

    // 3. Reject with ONLY the clean string
    return Promise.reject(cleanMessage);
  }
);

export default api;