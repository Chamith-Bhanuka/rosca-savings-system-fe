import api from './api';

export const doManualPayment = async (
  groupId: string,
  cycle: string,
  image: File
) => {
  const formData = new FormData();
  formData.append('groupId', groupId);
  formData.append('cycle', cycle);
  formData.append('image', image);

  const res = await api.post(`/contribution/manual`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};
