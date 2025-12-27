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

export const getAllGroups = async (page: number, limit: number) => {
  const res = await api.get(`/group?page=${page}&limit=${limit}`);
  return res.data;
};

export const joinUser = async (group: any) => {
  console.log(group.id);
  const res = await api.post(`/group/${group.id}/join`);
  return res.data;
};

export const getGroupById = async (groupId: string) => {
  console.log('GroupID from service: ', groupId);
  const res = await api.get(`/group/${groupId}`);
  console.log(res.data);
  return res;
};

export const acceptJoinRequest = async (groupId: string, userId: string) => {
  const res = await api.post(`/group/${groupId}/pending/${userId}/accept`);
  return res;
};

export const declineJoinRequest = async (groupId: string, userId: string) => {
  const res = await api.post(`/group/${groupId}/pending/${userId}/decline`);
  return res;
};

export const triggerGroupDraw = async (groupId: string) => {
  const res = await api.post(`/group/${groupId}/draw`);
  return res;
};

export const getGroupContributions = async (groupId: string, cycle: number) => {
  const res = await api.get(`/payment/${groupId}/contributions?cycle=${cycle}`);
  return res;
};

export const verifyContribution = async (
  contributionId: string,
  action: 'APPROVE' | 'REJECT',
  reason?: string
) => {
  console.log(contributionId, reason, action);
};
