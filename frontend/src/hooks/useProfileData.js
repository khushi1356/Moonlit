import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProfile, logoutUser, updateProfile } from '../api/authApi';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { getNotifications, markNotificationRead } from '../api/notificationApi';
import { addReview } from '../api/reviewApi';

const useProfileData = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ serviceId: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, bookingsRes, notifsRes] = await Promise.all([
          getProfile().catch(() => ({ data: JSON.parse(localStorage.getItem('user')) || null })),
          getMyBookings().catch(() => []),
          getNotifications().catch(() => []),
        ]);
        const userData = profileRes.data || profileRes;
        setUser(userData);
        setEditForm({ name: userData?.name || '', phone: userData?.phone || '' });
        setBookings(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes?.data || []);
        const notifs = Array.isArray(notifsRes) ? notifsRes : notifsRes?.notifications || notifsRes?.data || [];
        setNotifications(notifs);
      } catch {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = useCallback(async () => {
    try { await logoutUser(); } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Disconnected.');
    navigate('/');
  }, [navigate]);

  const handleUpdateProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await updateProfile(editForm);
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
      setIsEditing(false);
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  }, [editForm]);

  const handleMarkNotifRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      for (const n of notifications.filter(n => !n.isRead)) {
        await markNotificationRead(n._id);
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch {}
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully.');
      const bookingsRes = await getMyBookings();
      setBookings(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleOpenReview = (booking) => {
    const sId = booking.serviceIds?.[0];
    if (!sId) return toast.error('Could not find service details.');
    setReviewData({ serviceId: sId._id || sId, rating: 5, comment: '' });
    setIsReviewOpen(true);
  };

  const submitReview = useCallback(async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await addReview(reviewData);
      toast.success('Thank you for your feedback.');
      setIsReviewOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  }, [reviewData]);

  return {
    user, setUser, bookings, notifications,
    loading, isEditing, setIsEditing,
    editForm, setEditForm,
    isReviewOpen, setIsReviewOpen,
    reviewData, setReviewData,
    submittingReview,
    handleLogout, handleUpdateProfile,
    handleMarkNotifRead, handleMarkAllRead,
    handleCancelBooking, handleOpenReview, submitReview,
    navigate,
  };
};

export default useProfileData;
