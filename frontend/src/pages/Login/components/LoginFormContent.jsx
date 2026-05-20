import { Link } from 'react-router-dom';

const LoginFormContent = ({
  isLogin, isForgotPassword, isResetPassword, isVerifyOtp,
  formData, handleChange, loading,
  handleForgotPassword, handleResetPassword, handleVerifyOtp, handleSubmit,
  setIsForgotPassword, setIsResetPassword, setIsVerifyOtp,
  handleGoogleLogin,
}) => {
  const inputCls = 'w-full p-3 bg-gray-50 border border-gray-200 text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-400';
  const btnCls = (extra = '') => `w-full py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-md ${loading ? 'opacity-50' : 'hover:bg-[#3AA89B]'} ${extra}`;

  if (isForgotPassword) return (
    <form className="space-y-4" onSubmit={handleForgotPassword}>
      <div>
        <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="Enter email" />
      </div>
      <button type="submit" disabled={loading} className={btnCls()}>{loading ? 'Processing...' : 'Send OTP'}</button>
      <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-[10px] tracking-widest font-bold text-gray-500 uppercase hover:text-[var(--color-primary)] transition-colors">Back to Authentication</button>
    </form>
  );

  if (isResetPassword) return (
    <form className="space-y-4" onSubmit={handleResetPassword}>
      <div>
        <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">OTP Code</label>
        <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className={`${inputCls} tracking-[0.5em] text-center font-bold text-lg`} placeholder="• • • • •" />
      </div>
      <div>
        <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">New Password</label>
        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required className={inputCls} placeholder="••••••••" />
      </div>
      <button type="submit" disabled={loading} className={btnCls()}>{loading ? 'Processing...' : 'Reset Password'}</button>
      <button type="button" onClick={() => { setIsResetPassword(false); }} className="w-full text-[10px] tracking-widest font-bold text-gray-500 uppercase hover:text-[var(--color-primary)] transition-colors">Back to Authentication</button>
    </form>
  );

  if (isVerifyOtp) return (
    <form className="space-y-4" onSubmit={handleVerifyOtp}>
      <div>
        <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Enter OTP</label>
        <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className={`${inputCls} tracking-[0.5em] text-center font-bold text-lg`} placeholder="• • • • •" />
        <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest text-center">Sent to {formData.email}</p>
      </div>
      <button type="submit" disabled={loading} className={btnCls()}>{loading ? 'Verifying...' : 'Verify Identity'}</button>
      <button type="button" onClick={() => setIsVerifyOtp(false)} className="w-full text-[10px] tracking-widest font-bold text-gray-500 uppercase hover:text-[var(--color-primary)] transition-colors">Modify Details</button>
    </form>
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {!isLogin && (
        <div>
          <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required={!isLogin} className={inputCls} placeholder="Full Name" />
        </div>
      )}
      <div>
        <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="Email Address" />
      </div>
      <div>
        <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputCls} placeholder="••••••••" />
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
      <button type="submit" disabled={loading} className={btnCls('mt-2')}>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</button>
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

export default LoginFormContent;
