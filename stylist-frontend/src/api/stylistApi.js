import apiClient from './client';

export const loginStylist = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getStylistProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const updateStylistProfile = async (data) => {
  const response = await apiClient.put('/auth/profile', data);
  return response.data;
};

export const getStylistBookings = async () => {
  const response = await apiClient.get('/bookings');
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await apiClient.put(`/bookings/${id}`, { status });
  return response.data;
};

export const getMyNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await apiClient.put(`/notifications/read/${id}`);
  return response.data;
};
