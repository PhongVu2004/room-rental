import { fetchApi } from '../lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async () => {
  return fetchApi('/notifications');
};

export const markAsRead = async (id: string) => {
  return fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
};
