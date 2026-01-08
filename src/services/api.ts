import axios from 'axios';

const api = axios.create({
  baseURL: 'rosca-savings-system-be.vercel.app/api/v1',
  withCredentials: true,
});

export interface ApiError {
  message: string;
}

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `rosca-savings-system-be.vercel.app/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
