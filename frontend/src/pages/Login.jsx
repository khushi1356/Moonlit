import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowLeft, Key } from 'lucide-react';
import { loginUser, registerUser, verifyOtp, resetPassword } from '../api/authApi';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
    newPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error("Provide email.");
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(`${baseURL}/auth/forgot-password`, { email: formData.email });
      toast.success("OTP dispatched.");
      setIsForgotPassword(false);
      setIsResetPassword(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword });
      toast.success("Credentials updated.");
      setIsResetPassword(false);
      setIsLogin(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ email: formData.email, otp: formData.otp });
      toast.success("Verification complete.");
      setIsVerifyOtp(false);
      setIsLogin(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
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
        toast.success("Access Granted.");
        navigate('/');
      } else {
        await registerUser(formData);
        toast.success("OTP Dispatched. Awaiting verification.");
        setIsVerifyOtp(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally { setLoading(false); }
  };

  const renderFormContent = () => {
    if (isForgotPassword) {
      return (
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <div>
            <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400" placeholder="Enter email" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-md ${loading ? 'opacity-50' : 'hover:bg-[#3AA89B]'}`}>
            {loading ? 'Processing...' : 'Send OTP'}
          </button>
          <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-[10px] tracking-widest font-bold text-gray-500 uppercase hover:text-[var(--color-primary)] transition-colors">
            Back to Authentication
          </button>
        </form>
      );
    }

    if (isResetPassword) {
      return (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">OTP Code</label>
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400 tracking-[0.5em] text-center font-bold text-lg" placeholder="• • • • •" />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-md ${loading ? 'opacity-50' : 'hover:bg-[#3AA89B]'}`}>
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
          <button type="button" onClick={() => { setIsResetPassword(false); setIsLogin(true); }} className="w-full text-[10px] tracking-widest font-bold text-gray-500 uppercase hover:text-[var(--color-primary)] transition-colors">
            Back to Authentication
          </button>
        </form>
      );
    }

    if (isVerifyOtp) {
      return (
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <div>
            <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Enter OTP</label>
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400 tracking-[0.5em] text-center font-bold text-lg" placeholder="• • • • •" />
            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest text-center">Sent to {formData.email}</p>
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-md ${loading ? 'opacity-50' : 'hover:bg-[#3AA89B]'}`}>
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
          <button type="button" onClick={() => setIsVerifyOtp(false)} className="w-full text-[10px] tracking-widest font-bold text-gray-500 uppercase hover:text-[var(--color-primary)] transition-colors">
            Modify Details
          </button>
        </form>
      );
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required={!isLogin} className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400" placeholder="Full Name" />
          </div>
        )}
        
        <div>
          <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400" placeholder="Email Address" />
        </div>

        <div>
          <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400" placeholder="••••••••" />
        </div>

        {isLogin && (
          <div className="flex justify-between items-center text-[10px] tracking-widest font-bold text-gray-500 uppercase">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-3 h-3 border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded bg-gray-50" />
              <span>Remember me</span>
            </label>
            <button type="button" onClick={() => setIsForgotPassword(true)} className="hover:text-[var(--color-primary)] transition-colors">Forgot Password?</button>
          </div>
        )}

        <button type="submit" disabled={loading} className={`w-full py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-md mt-2 ${loading ? 'opacity-50' : 'hover:bg-[#3AA89B]'}`}>
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
        
        <button type="button" onClick={handleGoogleLogin} className="w-full py-3 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:border-gray-300 hover:text-[var(--color-primary)] hover:bg-gray-50 transition-all flex items-center justify-center space-x-3 rounded-lg bg-white shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue via Google</span>
        </button>
      </form>
    );
  };

  return (
    <div className="h-screen pt-20 flex bg-[var(--color-bg-light)] relative overflow-hidden font-sans">
      
      {/* Image / Brand Side */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80')" }}
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/20 mix-blend-multiply" />
        <div className="relative z-10 text-center p-10 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <Link to="/">
            <h1 className="font-serif text-5xl font-bold uppercase tracking-widest text-[var(--color-primary)] mb-3">Moonlit.</h1>
          </Link>
          <p className="text-gray-800 tracking-[0.3em] text-[10px] uppercase font-bold">The Future of Beauty</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-8 relative z-10 bg-[var(--color-bg-light)] h-full overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[#3AA89B] transition-colors text-[10px] uppercase tracking-widest font-bold mb-6 lg:hidden">
              <span>Back to Home</span>
            </Link>
            
            {isForgotPassword ? (
              <>
                <h2 className="text-2xl font-serif uppercase tracking-widest mb-1 text-[var(--color-primary)]">Reset</h2>
                <p className="text-[10px] tracking-widest font-bold uppercase text-gray-500">Secure password recovery.</p>
              </>
            ) : isResetPassword ? (
              <>
                <h2 className="text-2xl font-serif uppercase tracking-widest mb-1 text-[var(--color-primary)]">New Key</h2>
                <p className="text-[10px] tracking-widest font-bold uppercase text-gray-500">Create new password.</p>
              </>
            ) : isVerifyOtp ? (
              <>
                <h2 className="text-2xl font-serif uppercase tracking-widest mb-1 text-[var(--color-primary)]">Verify</h2>
                <p className="text-[10px] tracking-widest font-bold uppercase text-gray-500">Authenticate identity.</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-serif uppercase tracking-widest mb-1 text-[var(--color-primary)]">
                  {isLogin ? <span>Welcome</span> : <span>Join Us</span>}
                </h2>
                <p className="text-[10px] tracking-widest font-bold uppercase text-gray-500">
                  {isLogin ? 'Sign in to your account.' : 'Sign up for an account.'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {renderFormContent()}
          </div>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <span className="text-[10px] tracking-widest font-bold uppercase text-gray-500 mr-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); }}
              className="text-[10px] tracking-widest font-bold uppercase text-[var(--color-primary)] hover:text-[#3AA89B] transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
