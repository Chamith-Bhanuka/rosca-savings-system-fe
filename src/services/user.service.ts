import api from './api';

export const fetchUserWallet = async () => {
  const res = await api.get(`/user/wallet`);
  return res;
};

export const getAnalytics = async () => {
  const res = await api.get(`/user/analytics`);
  return res.data;
};

export const getDashboard = async () => {
  const res = await api.get(`/user/dashboard`);
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await api.get(`/user/leaderboard`);
  return res.data;
};

export const updateProfile = async (
  firstName: string,
  lastName: string,
  phone: string,
  bankAccount: string,
  bankName: string,
  image: null | File
) => {
  const data = new FormData();

  data.append('firstName', firstName);
  data.append('lastName', lastName);
  data.append('phone', phone);

  const bankDetails = {
    accountNumber: bankAccount,
    bankName: bankName,
  };
  data.append('bankDetails', JSON.stringify(bankDetails));

  if (image) {
    data.append('image', image);
  }

  const res = await api.put(`/user/profile`, data);
  return res.data;
};

export const deleteProfile = async () => {
  const res = await api.delete(`/user/profile`);
  return res.data;
};
