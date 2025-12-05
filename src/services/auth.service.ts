import api from './api';

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const res = await api.post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
  });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', {
    email,
    password,
  });
  return res.data;
};

export const getMyDetails = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const logout_user = async () => {
  const res = await api.post('/auth/logout', {}, { withCredentials: true });
  return res.data;
};
