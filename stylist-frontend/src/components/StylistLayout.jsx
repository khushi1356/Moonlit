import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Toaster } from 'react-hot-toast';

const StylistLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }
        }}
      />
      
      <div className="desktop-only">
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {isSidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex' }}>
          <div 
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div style={{ position: 'relative', zIndex: 50, height: '100%' }}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar toggleSidebar={toggleSidebar} />
        <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StylistLayout;
