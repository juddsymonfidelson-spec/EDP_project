import axios from 'axios';

// Admin API instance
const API = axios.create({ baseURL: 'http://localhost:5000/api/admin' });

API.interceptors.request.use((config) => {
  const role = localStorage.getItem('userRole');
  if (role) config.headers['x-user-role'] = role;
  return config;
});

// Client API instance (public routes)
export const ClientAPI = axios.create({ baseURL: 'http://localhost:5000/api/client' });

export default API;