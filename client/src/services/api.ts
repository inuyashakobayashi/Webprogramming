// src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor für API key
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('api_key');
    if (token) {
      config.headers['API-KEY'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor für Error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // Session expired
      if (error.response.status === 401 && !originalRequest._retry) {
        localStorage.removeItem('api_key');
        window.location.href = '/login';
      }

      // Server errors
      if (error.response.status >= 500) {
        console.error('Server Error:', error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;