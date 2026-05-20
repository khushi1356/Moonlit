import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Bookings = React.lazy(() => import('./pages/Bookings'));
const Users = React.lazy(() => import('./pages/Users'));
const Services = React.lazy(() => import('./pages/Services'));
const Categories = React.lazy(() => import('./pages/Categories'));
const Stylists = React.lazy(() => import('./pages/Stylists'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Reviews = React.lazy(() => import('./pages/Reviews'));
const Coupons = React.lazy(() => import('./pages/Coupons'));
const Payments = React.lazy(() => import('./pages/Payments'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Marketing = React.lazy(() => import('./pages/Marketing'));
const Login = React.lazy(() => import('./pages/Login'));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-base)' }}>
    <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTop: '4px solid var(--rose)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<Users />} />
            <Route path="services" element={<Services />} />
            <Route path="categories" element={<Categories />} />
            <Route path="stylists" element={<Stylists />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="payments" element={<Payments />} />
            <Route path="messages" element={<Messages />} />
            <Route path="marketing" element={<Marketing />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
