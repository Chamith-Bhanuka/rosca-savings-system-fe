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

export const raiseDispute = async (
  groupId: string,
  subject: string,
  description: string,
  image: null | File
) => {
  const formData = new FormData();
  formData.append('groupId', groupId);
  formData.append('subject', subject);
  formData.append('description', description);
  if (image) formData.append('image', image);

  const res = await api.post(`/dispute`, formData);
  return res.data;
};
