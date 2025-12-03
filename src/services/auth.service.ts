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
