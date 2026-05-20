import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Spinner from '../components/ui/Spinner';

const Home = React.lazy(() => import('../pages/Home'));
const Services = React.lazy(() => import('../pages/Services'));
const Stylists = React.lazy(() => import('../pages/Stylists'));
const Gallery = React.lazy(() => import('../pages/Gallery'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Booking = React.lazy(() => import('../pages/Booking'));
const Login = React.lazy(() => import('../pages/Login'));
const Profile = React.lazy(() => import('../pages/Profile'));
const AuthSuccess = React.lazy(() => import('../pages/AuthSuccess'));
const About = React.lazy(() => import('../pages/About'));

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="stylists" element={<Stylists />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="about" element={<About />} />
        <Route path="auth-success" element={<AuthSuccess />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
