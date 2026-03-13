import axios from 'axios';
import { refreshToken } from './auth.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // não adicionar token em rotas de autenticação
  if (config.url.includes('/auth')) {
    return config;
  }

  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// refresh automático
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ❗ se não existe token, não tentar refresh
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return Promise.reject(error);
    }

    // ❗ não tentar refresh na própria rota refresh
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        localStorage.setItem('accessToken', newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
