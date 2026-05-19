import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Scissors, Calendar, Briefcase,
  MessageSquare, Image, Tag, CreditCard, Mail, Star,
  FolderOpen, LogOut, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Bookings', icon: Calendar, path: '/bookings' },
      { name: 'Payments', icon: CreditCard, path: '/payments' },
    ]
  },
  {
    label: 'Manage',
    items: [
      { name: 'Services', icon: Scissors, path: '/services' },
      { name: 'Categories', icon: FolderOpen, path: '/categories' },
      { name: 'Stylists', icon: Briefcase, path: '/stylists' },
      { name: 'Gallery', icon: Image, path: '/gallery' },
      { name: 'Coupons', icon: Tag, path: '/coupons' },
    ]
  },
  {
    label: 'People',
    items: [
      { name: 'Users', icon: Users, path: '/users' },
      { name: 'Reviews', icon: Star, path: '/reviews' },
      { name: 'Messages', icon: MessageSquare, path: '/messages' },
      { name: 'Marketing', icon: Mail, path: '/marketing' },
    ]
  }
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
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
              ADMIN PANEL
            </span>
          </div>
        </Link>
        <button onClick={() => onClose && onClose()} className="mobile-only" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {menuGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              padding: '0 12px', marginBottom: '6px'
            }}>{group.label}</p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.path} onClick={() => onClose && onClose()} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
                  textDecoration: 'none', transition: 'all 0.15s ease',
                  background: isActive ? 'var(--rose-dim)' : 'transparent',
                  color: isActive ? 'var(--rose)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '13.5px',
                  position: 'relative',
                }}>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {isActive && <ChevronRight size={12} style={{ opacity: 0.6 }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout & Credit */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.08)', color: '#f87171',
          border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer',
          fontSize: '13.5px', fontWeight: '500', transition: 'all 0.15s'
        }}>
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
