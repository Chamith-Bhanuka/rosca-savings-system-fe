import api from './api.ts';

export const getAllDisputes = async () => {
  const res = await api.get(`/dispute/admin/all`);
  return res.data;
};

export const resolveDispute = async (
  disputeId: string,
  resolution: string,
  adminComment: string
) => {
  const res = await api.put(`/dispute/resolve`, {
    disputeId,
    resolution,
    adminComment,
  });
  return res.data;
};
