import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.clear(); 
    
    let cleanMessage = "An unexpected error occurred. Please try again.";
    
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        
        // --- NEW SAFETY CHECK FOR FASTAPI 422 ERRORS ---
        if (Array.isArray(error.response.data.detail)) {
          // Extract the exact field that failed and its message
          const validationError = error.response.data.detail[0];
          const fieldName = validationError.loc[validationError.loc.length - 1];
          cleanMessage = `Validation Error: '${fieldName}' - ${validationError.msg}`;
        } else {
          // Standard string error
          cleanMessage = error.response.data.detail;
        }
        // ------------------------------------------------

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