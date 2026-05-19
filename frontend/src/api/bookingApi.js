import apiClient from './client';

export const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await apiClient.get('/bookings/my');
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await apiClient.get(`/bookings/${id}`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await apiClient.delete(`/bookings/${id}`);
  return response.data;
};
