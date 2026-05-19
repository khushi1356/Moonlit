import apiClient from './client';

export const getStylists = async () => {
  const response = await apiClient.get('/stylists');
  return response.data;
};

export const getStylistById = async (id) => {
  const response = await apiClient.get(`/stylists/${id}`);
  return response.data;
};

