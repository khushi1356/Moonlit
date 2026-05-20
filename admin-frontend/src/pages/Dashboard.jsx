import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, TrendingUp, Scissors, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { getDashboardStats, getAdminBookings } from '../api/adminApi';
import toast from 'react-hot-toast';

const statusColor = (s) => {
  if (s === 'confirmed') return 'badge-rose';
  if (s === 'completed') return 'badge-green';
  if (s === 'cancelled') return 'badge-muted';
  return 'badge-amber';
};

const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`card stat-${color}`}
    style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `var(--${color}-dim, var(--rose-dim))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: `var(--${color}, var(--rose))`,
      }}>
        <Icon size={20} strokeWidth={2} />
      </div>
      {trend !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600',
          color: trend >= 0 ? 'var(--green)' : '#f87171',
        }}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
      <h3 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</h3>
    </div>
    {trend !== undefined && (
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        {trend >= 0 ? '+' : ''}{trend}% from last month
      </p>
    )}
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          getDashboardStats(),
          getAdminBookings().catch(() => ({ data: [] }))
        ]);
        setStats(statsRes.data || statsRes);
        setRecentBookings((bookingsRes.data || bookingsRes || []).slice(0, 6));
      } catch {
        toast.error('Failed to load dashboard data');
        setStats({ revenue: 0, totalBookings: 0, users: 0, stylists: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Here's what's happening at Moonlit today.</p>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard title="Total Revenue" value={`₹${(stats?.revenue || 0).toLocaleString()}`} icon={DollarSign} trend={12.5} color="rose" delay={0.1} />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={Calendar} trend={8.2} color="teal" delay={0.15} />
        <StatCard title="Registered Users" value={stats?.users || 0} icon={Users} trend={-2.4} color="purple" delay={0.2} />
        <StatCard title="Active Stylists" value={stats?.stylists || 0} icon={Scissors} trend={5} color="amber" delay={0.25} />
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Revenue Analytics</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Monthly overview</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['1W', '1M', '3M', '1Y'].map(t => (
                <button key={t} style={{
                  padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
                  background: t === '1M' ? 'var(--rose-dim)' : 'transparent',
                  color: t === '1M' ? 'var(--rose)' : 'var(--text-muted)',
                  border: '1px solid', borderColor: t === '1M' ? 'rgba(244,114,182,0.3)' : 'var(--border)',
                  cursor: 'pointer',
                }}>{t}</button>
              ))}
            </div>
          </div>
          {}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px', padding: '10px 0' }}>
            {[65, 40, 80, 55, 90, 70, 85, 50, 75, 60, 95, 45].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%', height: `${h}%`,
                  background: i === 10
                    ? 'linear-gradient(to top, var(--rose), #a78bfa)'
                    : 'rgba(244,114,182,0.15)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }} />
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                  {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                </span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', gap: '24px', marginTop: '8px' }}>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Revenue</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--rose)' }}>₹{(stats?.revenue || 0).toLocaleString()}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Bookings</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats?.totalBookings || 0}</p>
            </div>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
          style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Bookings</h3>
            <span className="badge badge-rose">{recentBookings.length} new</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
            {recentBookings.length > 0 ? recentBookings.map((b, i) => (
              <div key={b._id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', borderRadius: '10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                    {(b.userId?.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {b.serviceIds?.[0]?.name || 'Service'}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> {new Date(b.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--rose)' }}>₹{b.totalAmount || 0}</p>
                  <span className={`badge ${statusColor(b.status)}`} style={{ fontSize: '9px', padding: '2px 7px' }}>{b.status}</span>
                </div>
              </div>
            )) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <Calendar size={28} />
                <p style={{ fontSize: '13px' }}>No bookings yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
