import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-hover)',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: 'white' } },
          error: { iconTheme: { primary: '#f87171', secondary: 'white' } },
        }}
      />

      {/* Sidebar Desktop */}
      <div className="sidebar-desktop">
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div style={{ position: 'relative', zIndex: 51 }}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '28px',
          background: 'var(--bg-base)',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
