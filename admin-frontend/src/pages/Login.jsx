import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${baseURL}/auth/login`, formData);
      if (res.data.user.role !== 'admin') {
        toast.error('Access denied. Admin accounts only.');
        return;
      }
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      toast.success('Welcome back, Admin!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: '16px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

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
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--rose), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 30px rgba(244,114,182,0.3)',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', fontWeight: '700',
            color: 'var(--text-primary)', marginBottom: '6px',
          }}>Moonlit Admin</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sign in to manage your salon</p>
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
                placeholder="admin@moonlitsalon.com"
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
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
          🔒 Restricted to authorized administrators only
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
