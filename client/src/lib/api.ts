import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
// import type {CancelTokenSource } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiRequestOptions extends AxiosRequestConfig {
  signal?: AbortSignal;
}

export const apiGet = async <T>(url: string, options?: ApiRequestOptions): Promise<T> => {
  const response = await apiClient.get<T>(url, options);
  return response.data;
};

export const apiPost = async <T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<T> => {
  const response = await apiClient.post<T>(url, data, options);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<T> => {
  const response = await apiClient.put<T>(url, data, options);
  return response.data;
};

export const apiDelete = async <T>(url: string, options?: ApiRequestOptions): Promise<T> => {
  const response = await apiClient.delete<T>(url, options);
  return response.data;
};

export default apiClient;
