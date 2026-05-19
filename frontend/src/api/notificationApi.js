import apiClient from './client';

export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await apiClient.put(`/notifications/read/${id}`);
  return response.data;
};
