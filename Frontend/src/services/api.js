import axios from 'axios';

// Create axios instance with default configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Vendor Auth API
export const vendorAuthAPI = {
  login: (credentials) => api.post('/vendor/auth/login', credentials),
  register: (userData) => api.post('/vendor/auth/register', userData),
  getProfile: () => api.get('/vendor/auth/profile'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Vendor Products API
export const vendorProductsAPI = {
  getAll: () => api.get('/vendor/products'),
  getById: (id) => api.get(`/vendor/products/${id}`),
  create: (data) => api.post('/vendor/products', data),
  update: (id, data) => api.put(`/vendor/products/${id}`, data),
  delete: (id) => api.delete(`/vendor/products/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Group Orders API
export const groupOrdersAPI = {
  getAll: () => api.get('/group-orders'),
  getById: (id) => api.get(`/group-orders/${id}`),
  create: (data) => api.post('/group-orders', data),
  update: (id, data) => api.put(`/group-orders/${id}`, data),
  delete: (id) => api.delete(`/group-orders/${id}`),
};

// Vendor Group Orders API
export const vendorGroupOrdersAPI = {
  getAll: () => api.get('/vendor/group-orders'),
  getById: (id) => api.get(`/vendor/group-orders/${id}`),
  join: (id, data) => api.post(`/vendor/group-orders/${id}/join`, data),
  leave: (id) => api.post(`/vendor/group-orders/${id}/leave`),
};

// Transport API
export const transportAPI = {
  getAll: () => api.get('/transports'),
  getById: (id) => api.get(`/transports/${id}`),
  create: (data) => api.post('/transports', data),
  update: (id, data) => api.put(`/transports/${id}`, data),
  delete: (id) => api.delete(`/transports/${id}`),
};

// Delivery API
export const deliveryAPI = {
  getAll: () => api.get('/vendor/delivery'),
  getById: (id) => api.get(`/vendor/delivery/${id}`),
  updateStatus: (id, status) => api.put(`/vendor/delivery/${id}/status`, { status }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 