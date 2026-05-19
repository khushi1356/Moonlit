import apiClient from './client';

export const createOrder = async (amount) => {
  const response = await apiClient.post('/payments/create-order', { amount });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await apiClient.post('/payments/verify', paymentData);
  return response.data;
};
