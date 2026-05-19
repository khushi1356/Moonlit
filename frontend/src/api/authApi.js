import apiClient from './client';

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await apiClient.put('/auth/update-profile', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await apiClient.post('/auth/verify-otp', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};
