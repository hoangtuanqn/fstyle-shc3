import axios from 'axios';
import { toast } from 'sonner';

import LocalStorage from '~/utils/localStorage';

import type { ApiResponse, RefreshResult } from '~/types/auth';

const BASE_URL = import.meta.env.VITE_API_BACKEND_API;

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

privateApi.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(privateApi(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = LocalStorage.getItem('refresh_token');
      const accessToken = LocalStorage.getItem('access_token');

      if (!refreshToken || !accessToken) {
        isRefreshing = false;
        processQueue(error, null);
        clearAuth();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<ApiResponse<RefreshResult>>(
          `${BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (!data.result) {
          throw new Error('Refresh token response missing result');
        }

        const newAccessToken = data.result.access_token;
        const newRefreshToken = data.result.refresh_token;

        LocalStorage.setItem('access_token', newAccessToken);
        LocalStorage.setItem('refresh_token', newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

function clearAuth() {
  LocalStorage.removeItem('access_token');
  LocalStorage.removeItem('refresh_token');
  LocalStorage.removeItem('role');
  window.location.href = '/login';
}
