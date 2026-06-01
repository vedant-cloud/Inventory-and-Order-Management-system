import axios from 'axios';

// Vite exposes environment variables using import.meta.env
// It pulls this from the docker-compose environment setup
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;