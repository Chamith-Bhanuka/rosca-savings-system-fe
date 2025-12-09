// const {
//     groupName,
//     description,
//     amountPerCycle,
//     paymentFrequency,
//     startDate,
//     totalMembers,
//     autoAccept,
//     settings = {},
// } = req.body;

import api from './api.ts';

export const createGroup = async (
  groupName: string,
  description: string,
  amountPerCycle: number,
  paymentFrequency: string,
  startDate: Date,
  totalMembers: number,
  autoAccept: boolean
) => {
  const res = await api.post('/group/create', {
    groupName,
    description,
    amountPerCycle,
    paymentFrequency,
    startDate,
    totalMembers,
    autoAccept,
  });
  return res.data;
};
