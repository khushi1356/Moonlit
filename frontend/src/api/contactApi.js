import apiClient from './client';

export const submitContact = async (data) => {
  const response = await apiClient.post('/contact', data);
  return response.data;
};
