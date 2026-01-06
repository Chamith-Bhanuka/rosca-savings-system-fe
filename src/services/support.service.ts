import api from './api.ts';

export const contactAdmin = async (formData: any) => {
  const res = await api.post('/support/contact', formData);
  return res.data;
};

export const subscribeNewsletter = async (email: string) => {
  const res = await api.post('/support/subscribe', { email: email });
  return res.data;
};
