import apiClient from './client';

export const getServices = async () => {
  const response = await apiClient.get('/services');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await apiClient.get(`/services/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};
