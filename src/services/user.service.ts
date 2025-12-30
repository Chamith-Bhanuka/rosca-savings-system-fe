import api from './api';

export const fetchUserWallet = async () => {
  const res = await api.get(`/user/wallet`);
  return res;
};
