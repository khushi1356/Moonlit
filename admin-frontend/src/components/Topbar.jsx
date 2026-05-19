import { Menu, Bell, Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/bookings': 'Bookings',
  '/payments': 'Payments',
  '/services': 'Services',
  '/categories': 'Categories',
  '/stylists': 'Stylists',
  '/gallery': 'Gallery',
  '/coupons': 'Coupons',
  '/users': 'Users',
  '/reviews': 'Reviews',
  '/messages': 'Messages',
  '/marketing': 'Marketing',
};

const Topbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Admin';
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const initials = adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A';

  return (
    <header style={{
      height: '70px',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={toggleSidebar} style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px',
          borderRadius: '8px',
        }} className="mobile-menu-btn">
          <Menu size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>{pageTitle}</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>




        {/* Admin Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid var(--border)' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--rose), var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: 'white',
          }}>{initials}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1 }}>
              {adminUser?.name || 'Admin'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Superadmin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
