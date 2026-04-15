import axios from 'axios';

// Set the base URL for the API
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Normalize URL: Ensure it doesn't end with a slash, and then ensure it ends with /api
API_URL = API_URL.replace(/\/$/, ""); 
if (!API_URL.endsWith("/api")) {
    API_URL = `${API_URL}/api`;
}

const api = axios.create({
    baseURL: API_URL,
});

/**
 * setupApiInterceptors
 * This function is used to inject the Clerk getToken function into our axios instance.
 * It's called once from a component that has access to the useAuth() hook.
 */
export const setupApiInterceptors = (getToken) => {
    api.interceptors.request.use(async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error fetching auth token:", error);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
};

export default api;

