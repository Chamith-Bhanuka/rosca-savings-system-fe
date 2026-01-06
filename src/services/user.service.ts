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
