import apiClient from './client';

export const getGallery = async () => {
  const response = await apiClient.get('/gallery');
  return response.data;
};
