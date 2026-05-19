import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      axios.get(`${baseURL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          const user = res.data?.data || res.data;
          localStorage.setItem('user', JSON.stringify(user));
          toast.success(`Welcome, ${user.name || 'User'}!`);
          navigate('/');
        })
        .catch(() => {
          toast.success('Google login successful!');
          navigate('/');
        });
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="text-center relative z-10 bg-white p-12 rounded-2xl shadow-xl border border-gray-100">
        <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-sm" />
        <p className="text-[var(--color-primary)] font-bold tracking-[0.3em] text-[10px] uppercase">Authenticating via Google...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
