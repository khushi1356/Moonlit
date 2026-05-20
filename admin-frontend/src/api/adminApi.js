import apiClient from './client';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};
export const getAnalytics = async () => {
  const response = await apiClient.get('/admin/analytics');
  return response.data;
};
export const getRevenue = async () => {
  const response = await apiClient.get('/admin/revenue');
  return response.data;
};

export const getAdminBookings = async () => {
  const response = await apiClient.get('/bookings');
  return response.data;
};
export const updateBookingStatus = async (id, status) => {
  const response = await apiClient.patch(`/bookings/${id}/status`, { status });
  return response.data;
};
export const deleteBooking = async (id) => {
  const response = await apiClient.delete(`/bookings/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};
export const updateUser = async (id, data) => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};
export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const getServices = async () => {
  const response = await apiClient.get('/services');
  return response.data;
};
export const createService = async (data) => {
  const response = await apiClient.post('/services', data);
  return response.data;
};
export const updateService = async (id, data) => {
  const response = await apiClient.put(`/services/${id}`, data);
  return response.data;
};
export const deleteService = async (id) => {
  const response = await apiClient.delete(`/services/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};
export const createCategory = async (data) => {
  const response = await apiClient.post('/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
export const updateCategory = async (id, data) => {
  const response = await apiClient.put(`/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};

export const getStylists = async () => {
  const response = await apiClient.get('/stylists');
  return response.data;
};
export const createStylist = async (data) => {
  const response = await apiClient.post('/stylists', data);
  return response.data;
};
export const updateStylist = async (id, data) => {
  const response = await apiClient.put(`/stylists/${id}`, data);
  return response.data;
};
export const deleteStylist = async (id) => {
  const response = await apiClient.delete(`/stylists/${id}`);
  return response.data;
};

export const getGallery = async () => {
  const response = await apiClient.get('/gallery');
  return response.data;
};
export const createGalleryItem = async (data) => {
  const response = await apiClient.post('/gallery', data);
  return response.data;
};
export const deleteGalleryItem = async (id) => {
  const response = await apiClient.delete(`/gallery/${id}`);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await apiClient.get('/reviews');
  return response.data;
};
export const deleteReview = async (id) => {
  const response = await apiClient.delete(`/reviews/${id}`);
  return response.data;
};

export const getCoupons = async () => {
  const response = await apiClient.get('/coupons');
  return response.data;
};
export const createCoupon = async (data) => {
  const response = await apiClient.post('/coupons', data);
  return response.data;
};
export const updateCoupon = async (id, data) => {
  const response = await apiClient.put(`/coupons/${id}`, data);
  return response.data;
};
export const deleteCoupon = async (id) => {
  const response = await apiClient.delete(`/coupons/${id}`);
  return response.data;
};

export const getAllPayments = async () => {
  const response = await apiClient.get('/payments/history');
  return response.data;
};

export const getContactMessages = async () => {
  const response = await apiClient.get('/contact');
  return response.data;
};
export const updateContactStatus = async (id, data) => {
  const response = await apiClient.put(`/contact/${id}`, data);
  return response.data;
};
export const deleteContactMessage = async (id) => {
  const response = await apiClient.delete(`/contact/${id}`);
  return response.data;
};
export const replyToContact = async (id, replyMessage) => {
  const response = await apiClient.post(`/contact/${id}/reply`, { replyMessage });
  return response.data;
};

export const getCampaigns = async () => {
  const response = await apiClient.get('/marketing');
  return response.data;
};
export const createCampaign = async (data) => {
  const response = await apiClient.post('/marketing', data);
  return response.data;
};
export const deleteCampaign = async (id) => {
  const response = await apiClient.delete(`/marketing/${id}`);
  return response.data;
};
