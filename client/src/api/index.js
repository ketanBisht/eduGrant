
import axios from 'axios';

// Set the base URL for the API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const api = axios.create({
    baseURL: API_URL,
});

// Optional: Add interceptors for auth if needed in the future
// api.interceptors.request.use((config) => { ... });

export default api;
