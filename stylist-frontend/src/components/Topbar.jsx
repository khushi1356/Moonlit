import { Menu, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('stylistUser');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch(e){}
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/schedule')) return 'My Schedule';
    if (path.startsWith('/availability')) return 'Availability';
    if (path.startsWith('/profile')) return 'My Profile';
    return 'Stylist Portal';
  };

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={toggleSidebar}
          className="mobile-only"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
        >
          <Menu size={24} />
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }} className="desktop-only">
          {getPageTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
          {user?.profilePic ? (
             <img src={user.profilePic} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
          ) : (
            <div className="avatar">
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
