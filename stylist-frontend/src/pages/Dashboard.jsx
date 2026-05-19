import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, XCircle, Bell, User } from 'lucide-react';
import { getStylistBookings, updateBookingStatus, getMyNotifications, markNotificationRead } from '../api/stylistApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const stylist = JSON.parse(localStorage.getItem('stylistUser') || '{}');

  const fetchData = async () => {
    try {
      const [bRes, nRes] = await Promise.all([
        getStylistBookings().catch(() => ({ data: [] })),
        getMyNotifications().catch(() => ({ data: [] }))
      ]);
      setBookings(bRes.data || bRes || []);
      setNotifications(nRes.data || nRes || []);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status}`);
      fetchData();
    } catch { toast.error('Failed to update status'); }
  };

  const handleReadNotif = async (id) => {
    try { await markNotificationRead(id); fetchData(); } catch {}
  };

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  const todaysBookings = bookings.filter(b => new Date(b.bookingDate).toDateString() === new Date().toDateString());
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Welcome, {stylist.name || 'Stylist'}!</h1>
          <p className="page-sub">Here's your appointment overview for today.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="btn-ghost" style={{ padding: '10px 14px', position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--rose)', color: 'white', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {unreadCount}
              </span>
            )}
          </button>
          {isNotifOpen && (
            <div style={{ position: 'absolute', right: 0, top: '48px', width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Notifications</h3>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? notifications.map(notif => (
                  <div
                    key={notif._id}
                    onClick={() => handleReadNotif(notif._id)}
                    style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: notif.isRead ? 'transparent' : 'var(--rose-dim)', opacity: notif.isRead ? 0.7 : 1 }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{notif.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{notif.message}</p>
                  </div>
                )) : (
                  <p style={{ padding: '24px 16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="card stat-rose" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Today's Appointments</p>
              <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>{todaysBookings.length}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--rose-dim)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card stat-amber" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Approval</p>
              <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>{pendingBookings.length}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--amber-dim)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card stat-teal" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Bookings</p>
              <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>{bookings.length}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--teal-dim)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={20} /></div>
          </div>
        </motion.div>
      </div>

      {/* Bookings Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>My Appointments</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                        {booking.userId?.name ? booking.userId.name.charAt(0) : <User size={16} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{booking.userId?.name || 'Client'}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {booking.serviceIds?.[0]?.name || 'Service'}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.timeSlot}</p>
                  </td>
                  <td>
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-purple' :
                      booking.status === 'completed' ? 'badge-green' :
                      booking.status === 'cancelled' ? 'badge-muted' :
                      'badge-amber'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {booking.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} style={{ padding: '6px', background: 'var(--green-dim)', color: 'var(--green)', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Confirm">
                          <Check size={16} />
                        </button>
                        <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Cancel">
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => handleStatusUpdate(booking._id, 'completed')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                        Mark Done
                      </button>
                    )}
                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <Calendar size={36} />
                      <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No appointments found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
