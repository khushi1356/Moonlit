import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { loginStylist } from '../api/stylistApi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginStylist(formData);
      
      // Basic check, ensure user is actually a stylist or admin
      if (res.user.role === 'customer') {
         throw new Error('Unauthorized Access: Customers cannot access the Stylist Portal.');
      }

      localStorage.setItem('stylistToken', res.token);
      localStorage.setItem('stylistUser', JSON.stringify(res.user));
      
      toast.success('Stylist Login Successful');
      navigate('/');
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: '16px', position: 'relative', overflow: 'hidden',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--rose), #fb7185)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(225, 29, 72, 0.2)',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', fontWeight: '700',
            color: 'var(--text-primary)', marginBottom: '6px',
          }}>Stylist Portal</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Manage your schedule & appointments</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="input" style={{ paddingLeft: '40px' }}
                placeholder="stylist@moonlitsalon.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="input" style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '14px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
