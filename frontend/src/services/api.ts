import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't set JSON content type for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    api.post('/auth/register', { name, email, password, role }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const requestsAPI = {
  createRequest: (formData: FormData) =>
    api.post('/requests', formData),
  getRequest: (id: string) => api.get(`/requests/${id}`),
  listRequests: (page: number = 1, filters: Record<string, any> = {}) =>
    api.get('/requests', { params: { page, ...filters } }),
  updateStatus: (id: string, data: any) =>
    api.patch(`/requests/${id}/status`, data),
  assignVolunteer: (id: string, userId: string) =>
    api.post(`/requests/${id}/assign`, { userId }),
  getStatistics: () => api.get('/requests/dashboard/stats'),
};

export default api;
