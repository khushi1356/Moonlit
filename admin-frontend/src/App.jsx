import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import Services from './pages/Services';
import Categories from './pages/Categories';
import Stylists from './pages/Stylists';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Coupons from './pages/Coupons';
import Payments from './pages/Payments';
import Messages from './pages/Messages';
import Marketing from './pages/Marketing';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
