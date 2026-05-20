import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, Clock, Sparkles, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const stylist = JSON.parse(localStorage.getItem('stylistUser') || '{}');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'My Schedule', icon: Calendar, path: '/schedule' },
    { name: 'My Profile', icon: User, path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('stylistToken');
    localStorage.removeItem('stylistUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
    }}>
      
      {}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" onClick={() => onClose && onClose()} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div
            style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '24px', letterSpacing: '0.22em', color: 'var(--text-primary)', lineHeight: 1 }}
          >
            MOONLIT<span style={{ color: '#3AA89B', fontWeight: 400 }}>.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', width: '100%' }}>
            <div style={{ height: '0.5px', background: 'var(--text-primary)', flex: 1, opacity: 0.2 }} />
            <span
              style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '7px', letterSpacing: '0.38em', color: 'var(--text-primary)' }}
            >
              STYLIST PORTAL
            </span>
          </div>
        </Link>
        <button onClick={() => onClose && onClose()} className="mobile-only" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {}
      {stylist.name && (
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {stylist.profilePic ? (
              <img
                src={stylist.profilePic}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                alt={stylist.name}
              />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--rose-dim)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
                {stylist.name.charAt(0)}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stylist.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stylist.email}</p>
            </div>
          </div>
        </div>
      )}

      {}
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => onClose && onClose()}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s',
                background: isActive ? 'var(--rose-dim)' : 'transparent',
                color: isActive ? 'var(--rose)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
              }}
              onMouseEnter={(e) => {
                if (!isActive) { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }
              }}
              onMouseLeave={(e) => {
                if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }
              }}
            >
              <Icon size={18} />
              <span style={{ fontSize: '14px' }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {}
      <div style={{ padding: '20px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <p style={{ textAlign: 'center', fontSize: '9px', fontFamily: "'Outfit', 'Inter', sans-serif", color: 'var(--text-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          developed by <span style={{ color: '#3AA89B', fontWeight: 600 }}>Khushi Kalathiya</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
