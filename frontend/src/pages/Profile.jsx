import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar as CalendarIcon, LogOut, Edit2, X, Star, Clock, Bell, CheckCheck } from 'lucide-react';
import { getProfile, logoutUser, updateProfile } from '../api/authApi';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { getNotifications, markNotificationRead } from '../api/notificationApi';
import { addReview } from '../api/reviewApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FadeUp, RevealText } from '../components/Animations';

const Profile = () => {
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
          getNotifications().catch(() => [])
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

  const handleLogout = async () => {
    try { await logoutUser(); } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Disconnected.');
    navigate('/');
  };

  const handleUpdateProfile = async () => {
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
  };

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
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully.");
      // Refresh bookings
      const bookingsRes = await getMyBookings();
      setBookings(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const handleOpenReview = (booking) => {
    const sId = booking.serviceIds?.[0];
    if (!sId) return toast.error('Could not find service details.');
    setReviewData({ serviceId: sId._id || sId, rating: 5, comment: '' });
    setIsReviewOpen(true);
  };

  const submitReview = async (e) => {
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
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
        <div className="w-7 h-7 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center justify-center bg-[var(--color-bg-light)]">
        <h2 className="text-2xl font-serif uppercase tracking-widest mb-6 text-[var(--color-primary)]">Authentication Required</h2>
        <button onClick={() => navigate('/login')} className="px-10 py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold tracking-widest uppercase shadow-md hover:bg-[var(--color-primary)]/90 transition-all">
          Sign In
        </button>
      </div>
    );
  }

  const statusStyle = (status) => {
    if (status === 'confirmed') return 'border-[var(--color-primary)] text-[var(--color-primary)] bg-blue-50';
    if (status === 'completed') return 'border-green-600 text-green-600 bg-green-50';
    if (status === 'cancelled') return 'border-red-500 text-red-500 bg-red-50';
    return 'border-gray-300 text-gray-500 bg-gray-50';
  };

  const statusBar = (status) => {
    if (status === 'confirmed') return 'bg-[var(--color-primary)]';
    if (status === 'completed') return 'bg-green-600';
    if (status === 'cancelled') return 'bg-red-500';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-bg-light)] text-[var(--color-text-primary)] font-sans">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">

        {/* ── Profile Card ── */}
        <FadeUp>
        <div className="mb-14 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-200 pb-12">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-white">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[var(--color-primary)] text-4xl font-serif uppercase">
                {user.name?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Info / Edit Form */}
          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-sm mx-auto md:mx-0">
                <div>
                  <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Name</label>
                  <input type="text" value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 mt-1.5 bg-gray-50 border border-gray-200 text-sm text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] transition-all" />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Phone</label>
                  <input type="text" value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 mt-1.5 bg-gray-50 border border-gray-200 text-sm text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] transition-all" />
                </div>
                <div className="flex justify-center md:justify-start gap-3 pt-2">
                  <button onClick={handleUpdateProfile} disabled={loading}
                    className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-[var(--color-primary)]/90 transition-all">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-widest mb-3 text-[var(--color-primary)]">{user.name}</h1>
                <div className="flex flex-col gap-1.5 mb-6 items-center md:items-start">
                  <span className="flex items-center gap-2 tracking-widest uppercase text-[11px] font-medium text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-2 tracking-widest uppercase text-[11px] font-medium text-gray-500">
                      <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {user.phone}
                    </span>
                  )}
                </div>
                <div className="flex justify-center md:justify-start gap-3">
                  <button onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 border border-gray-200 bg-white text-gray-700 text-[10px] font-bold uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1.5 rounded-lg shadow-sm">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <button onClick={handleLogout}
                    className="px-5 py-2.5 border border-red-100 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1.5 rounded-lg">
                    <LogOut className="w-3.5 h-3.5" /> Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        </FadeUp>

        {/* ── Bookings + Notifications Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Bookings (2 col span) */}
          <div className="lg:col-span-2">
            <FadeUp><h2 className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6">Appointment History</h2></FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookings.length > 0 ? bookings.map((booking) => (
                <motion.div
                  key={booking._id || booking.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  className="bg-white p-5 border border-gray-100 rounded-xl relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${statusBar(booking.status)}`} />

                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="font-serif text-base uppercase text-[var(--color-primary)]">Appointment</h3>
                        <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mt-0.5">
                          #{(booking._id || booking.id)?.slice(-8)}
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] tracking-widest font-bold uppercase ${statusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center border-b border-gray-50 pb-2">
                        <CalendarIcon className="w-3.5 h-3.5 mr-3 text-[var(--color-primary)]" />
                        <span className="uppercase tracking-widest text-[11px] font-bold text-gray-700">
                          {new Date(booking.bookingDate).toDateString()}
                        </span>
                      </div>
                      {booking.timeSlot && (
                        <div className="flex items-center border-b border-gray-50 pb-2">
                          <Clock className="w-3.5 h-3.5 mr-3 text-[var(--color-primary)]/60" />
                          <span className="uppercase tracking-widest text-[11px] font-bold text-gray-700">{booking.timeSlot}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-3 text-gray-400" />
                        <span className="uppercase tracking-widest text-[11px] font-bold text-gray-500">
                          {booking.stylistId?.userId?.name || booking.stylistId?.name || 'Assigned Artist'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {(booking.status === 'pending' || booking.status === 'confirmed') ? (
                      <button onClick={() => handleCancelBooking(booking._id || booking.id)} className="w-full py-3 text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-lg">
                        Cancel Booking
                      </button>
                    ) : booking.status === 'completed' ? (
                      <button onClick={() => handleOpenReview(booking)}
                        className="w-full py-3 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all flex items-center justify-center gap-2 rounded-lg shadow-sm">
                        <Star className="w-3.5 h-3.5" /> Leave Review
                      </button>
                    ) : (
                      <button onClick={() => navigate('/booking')}
                        className="w-full py-3 text-[10px] font-bold uppercase tracking-widest border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all rounded-lg">
                        Book Again
                      </button>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full text-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <h3 className="text-lg font-serif text-gray-400 mb-6 tracking-widest">No appointments on record.</h3>
                  <button onClick={() => navigate('/booking')}
                    className="px-7 py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-[var(--color-primary)]/90 transition-all rounded-lg">
                    Book Appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Activity Log</h2>
              {notifications.some(n => !n.isRead) && (
                <button onClick={handleMarkAllRead}
                  className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[#3AA89B] transition-colors flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Mark Read
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[560px]">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="font-serif text-base text-[var(--color-primary)]">Notifications</h3>
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {notifications.length === 0 ? (
                  <div className="py-14 text-center">
                    <Bell className="w-7 h-7 text-gray-200 mx-auto mb-3" />
                    <p className="text-[11px] tracking-widest uppercase text-gray-400 font-bold">No recent activity</p>
                  </div>
                ) : notifications.map((notif, i) => (
                  <motion.div
                    key={notif._id || i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => !notif.isRead && handleMarkNotifRead(notif._id)}
                    className={`p-3 mb-1.5 rounded-lg cursor-pointer transition-all border ${
                      notif.isRead
                        ? 'bg-white border-transparent hover:bg-gray-50'
                        : 'bg-[#3AA89B]/5 border-[#3AA89B]/20'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${notif.isRead ? 'bg-gray-200' : 'bg-[#3AA89B]'}`} />
                      <div className="flex-1 min-w-0">
                        {/* Title — shown prominently for admin replies */}
                        {notif.title && (
                          <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 truncate ${
                            notif.isRead ? 'text-gray-400' : 'text-[var(--color-primary)]'
                          }`}>
                            {notif.title}
                          </p>
                        )}
                        {/* Message body */}
                        <p className={`text-[12px] leading-snug ${notif.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                          {notif.message}
                        </p>
                        {notif.createdAt && (
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1.5 font-bold">
                            {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      <AnimatePresence>
        {isReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsReviewOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white p-9 shadow-2xl rounded-xl border border-gray-100">
              <button onClick={() => setIsReviewOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-[var(--color-primary)] transition-all">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-serif uppercase tracking-widest mb-1.5 text-center text-[var(--color-primary)]">Leave a Review</h2>
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-7 text-center">Share your experience</p>
              <form onSubmit={submitReview} className="space-y-6">
                <div className="flex gap-2 justify-center py-5 border-y border-gray-100">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`w-7 h-7 cursor-pointer transition-transform hover:scale-125 ${star <= reviewData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <textarea required rows="4" value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-none rounded-lg transition-all"
                  placeholder="Your thoughts..." />
                <button type="submit" disabled={submittingReview}
                  className={`w-full py-4 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-sm hover:bg-[var(--color-primary)]/90 ${submittingReview ? 'opacity-50' : ''}`}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
