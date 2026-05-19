import apiClient from './client';

export const getReviews = async (serviceId) => {
  const response = await apiClient.get(`/reviews?serviceId=${serviceId}`);
  return response.data;
};

export const addReview = async (data) => {
  const response = await apiClient.post('/reviews', data);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await apiClient.delete(`/reviews/${id}`);
  return response.data;
};

