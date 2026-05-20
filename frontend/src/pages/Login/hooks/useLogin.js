import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { loginUser, registerUser, verifyOtp, resetPassword } from '../../../api/authApi';

const useLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '', newPassword: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error('Provide email.');
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(`${baseURL}/auth/forgot-password`, { email: formData.email });
      toast.success('OTP dispatched.');
      setIsForgotPassword(false);
      setIsResetPassword(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword });
      toast.success('Credentials updated.');
      setIsResetPassword(false);
      setIsLogin(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ email: formData.email, otp: formData.otp });
      toast.success('Verification complete.');
      setIsVerifyOtp(false);
      setIsLogin(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginUser({ email: formData.email, password: formData.password });
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success('Access Granted.');
        navigate('/');
      } else {
        await registerUser(formData);
        toast.success('OTP Dispatched. Awaiting verification.');
        setIsVerifyOtp(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  return {
    isLogin, setIsLogin,
    isForgotPassword, setIsForgotPassword,
    isVerifyOtp, setIsVerifyOtp,
    isResetPassword, setIsResetPassword,
    loading, formData, handleChange,
    handleGoogleLogin, handleForgotPassword,
    handleResetPassword, handleVerifyOtp, handleSubmit,
  };
};

export default useLogin;
