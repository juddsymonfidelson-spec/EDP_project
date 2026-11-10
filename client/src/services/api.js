import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/admin' });

// Attach the simple header guard
API.interceptors.request.use((config) => {
  const role = localStorage.getItem('userRole');
  if (role) config.headers['x-user-role'] = role;
  return config;
});

export default API;