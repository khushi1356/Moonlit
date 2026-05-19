import apiClient from './client';

export const applyCoupon = async (code, amount) => {
  const response = await apiClient.post('/coupons/apply', { code, amount });
  return response.data;
};
