import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import useLogin from './hooks/useLogin';
import LoginFormContent from './components/LoginFormContent';

const HEADING_MAP = {
  forgot: { title: 'Reset', sub: 'Secure password recovery.' },
  reset: { title: 'New Key', sub: 'Create new password.' },
  otp: { title: 'Verify', sub: 'Authenticate identity.' },
};

const Login = () => {
  const {
    isLogin, setIsLogin,
    isForgotPassword, setIsForgotPassword,
    isVerifyOtp, setIsVerifyOtp,
    isResetPassword, setIsResetPassword,
    loading, formData, handleChange,
    handleGoogleLogin, handleForgotPassword,
    handleResetPassword, handleVerifyOtp, handleSubmit,
  } = useLogin();

  const getHeading = () => {
    if (isForgotPassword) return HEADING_MAP.forgot;
    if (isResetPassword) return HEADING_MAP.reset;
    if (isVerifyOtp) return HEADING_MAP.otp;
    return { title: isLogin ? 'Welcome' : 'Join Us', sub: isLogin ? 'Sign in to your account.' : 'Sign up for an account.' };
  };

  const { title, sub } = getHeading();

  return (
    <div className="h-screen pt-20 flex bg-[var(--color-bg-light)] relative overflow-hidden font-sans">
      <SEO title="Sign In" description="Sign in or create an account to book appointments at Moonlit Salon & Spa." />

      {}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center grayscale opacity-80" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80')" }} />
        <div className="absolute inset-0 bg-[var(--color-primary)]/20 mix-blend-multiply" />
        <div className="relative z-10 text-center p-10 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <Link to="/"><h1 className="font-serif text-5xl font-bold uppercase tracking-widest text-[var(--color-primary)] mb-3">Moonlit.</h1></Link>
          <p className="text-gray-800 tracking-[0.3em] text-[10px] uppercase font-bold">The Future of Beauty</p>
        </div>
      </div>

      {}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-8 relative z-10 bg-[var(--color-bg-light)] h-full overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[#3AA89B] transition-colors text-[10px] uppercase tracking-widest font-bold mb-6 lg:hidden">
              Back to Home
            </Link>
            <h2 className="text-2xl font-serif uppercase tracking-widest mb-1 text-[var(--color-primary)]">{title}</h2>
            <p className="text-[10px] tracking-widest font-bold uppercase text-gray-500">{sub}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <LoginFormContent
              isLogin={isLogin} isForgotPassword={isForgotPassword}
              isResetPassword={isResetPassword} isVerifyOtp={isVerifyOtp}
              formData={formData} handleChange={handleChange} loading={loading}
              handleForgotPassword={handleForgotPassword} handleResetPassword={handleResetPassword}
              handleVerifyOtp={handleVerifyOtp} handleSubmit={handleSubmit}
              setIsForgotPassword={setIsForgotPassword} setIsResetPassword={setIsResetPassword}
              setIsVerifyOtp={setIsVerifyOtp} handleGoogleLogin={handleGoogleLogin}
            />
          </div>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <span className="text-[10px] tracking-widest font-bold uppercase text-gray-500 mr-2">{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <button onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); }} className="text-[10px] tracking-widest font-bold uppercase text-[var(--color-primary)] hover:text-[#3AA89B] transition-colors">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
