import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });

  localStorage.setItem('accessToken', res.data.accessToken);

  return res.data;
};

export const logout = async () => {
  await api.post('/auth/logout');

  localStorage.removeItem('accessToken');
};

export const refreshToken = async () => {
  const res = await api.post('/auth/refresh');

  localStorage.setItem('accessToken', res.data.accessToken);

  return res.data.accessToken;
};
