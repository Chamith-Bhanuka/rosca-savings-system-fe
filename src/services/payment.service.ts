import api from './api.ts';

export const getClientSecret = async (groupId: any, cycle: any) => {
  const res = await api.post(`/payment/create-intent`, {
    groupId,
    cycle,
  });
  return res.data;
};

export const confirmStripePayment = async (
  groupId: any,
  cycle: any,
  paymentId: any
) => {
  const res = await api.post(`/payment/confirm`, {
    groupId,
    cycle,
    paymentIntentId: paymentId,
  });
  return res.data;
};

export const releasePayout = async (groupId: string, cycle: number) => {
  await api.post(`/payment/payout/release`, { groupId, cycle });
};
