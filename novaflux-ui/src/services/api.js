const axios = require('axios');

const API_URL = process.env.VITE_API_URL || 'http://127.0.0.1:3000/api';
console.log('[API] Using API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  console.log('[API] Request:', config.method?.toUpperCase(), config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log('[API] Response:', res.config.url, res.status);
    return res;
  },
  (err) => {
    console.log('[API] Error:', err.config?.url, err.response?.status, err.message);
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const grid = {
  status: () => api.get('/grid/status'),
  region: (id) => api.get(`/grid/region/${id}`),
  substation: (id) => api.get(`/grid/substation/${id}`),
  transformer: (id) => api.get(`/grid/transformer/${id}`),
};

export const meters = {
  list: (params) => api.get('/meters', { params }),
  get: (id) => api.get(`/meters/${id}`),
  readings: (id, params) => api.get(`/meters/${id}/readings`, { params }),
  stats: (id) => api.get(`/meters/${id}/stats`),
  disconnect: (id) => api.post(`/meters/${id}/disconnect`),
  reconnect: (id) => api.post(`/meters/${id}/reconnect`),
  create: (data) => api.post('/meters', data),
};

export const billing = {
  generate: (meterId, period) => api.post('/billing/generate', { meterId, billingPeriod: period }),
  list: (meterId) => api.get(`/billing/meter/${meterId}`),
  pay: (id, amount) => api.post(`/billing/${id}/pay`, { amount }),
  revenue: (params) => api.get('/billing/revenue', { params }),
};

export const alerts = {
  list: (params) => api.get('/alerts', { params }),
  acknowledge: (id) => api.put(`/alerts/${id}/acknowledge`),
  resolve: (id) => api.put(`/alerts/${id}/resolve`),
};

export const outages = {
  list: (params) => api.get('/outages', { params }),
  stats: (params) => api.get('/outages/stats', { params }),
  report: (data) => api.post('/outages', data),
  restore: (id) => api.put(`/outages/${id}/restore`),
  complete: (id, resolution) => api.put(`/outages/${id}/complete`, { resolution }),
};

export const forecast = {
  demand: (regionId, horizon) => api.get(`/forecast/demand/${regionId}`, { params: { horizon } }),
  peak: (regionId) => api.get(`/forecast/peak/${regionId}`),
  distribution: () => api.get('/forecast/distribution'),
};

export const renewables = {
  list: (regionId) => api.get('/renewables', { params: { regionId } }),
  solarForecast: (regionId) => api.get('/renewables/solar/forecast', { params: { regionId } }),
  mix: () => api.get('/renewables/mix/optimize'),
};

export const regions = {
  list: () => api.get('/regions'),
  get: (id) => api.get(`/regions/${id}`),
};

export default api;
