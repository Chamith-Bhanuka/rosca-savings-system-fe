import api from './api.ts';

export const getAllNotifications = async (
  pageNumber: number,
  filter: string
) => {
  const unreadQuery = filter === 'unread' ? '&unread=true' : '';
  const res = await api.get(
    `/notifications?limit=10&page=${pageNumber}${unreadQuery}`
  );
  return res.data;
};

export const markAsRead = async (id: string) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};
