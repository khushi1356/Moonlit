import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StylistLayout from './components/StylistLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('stylistToken');
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
            <StylistLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
