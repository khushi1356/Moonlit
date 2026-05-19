import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { getStylistBookings, updateBookingStatus } from '../api/stylistApi';
import toast from 'react-hot-toast';

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getStylistBookings();
      setBookings(res.data || res || []);
    } catch (error) {
      toast.error('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusFilters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h1 className="page-title">My Schedule</h1>
          <p className="page-sub">{filtered.length} appointment{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', width: '100%', flexWrap: 'nowrap' }}>
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border)',
                background: filter === s ? 'var(--rose)' : 'var(--bg-card)',
                color: filter === s ? 'white' : 'var(--text-secondary)',
                boxShadow: filter === s ? '0 4px 12px rgba(58, 168, 155, 0.2)' : 'none',
                borderColor: filter === s ? 'var(--rose)' : 'var(--border)',
                flexShrink: 0,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="desktop-only" style={{ overflowX: 'auto', minHeight: '300px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((booking) => (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={booking._id || booking.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px', background: 'var(--purple-dim)', color: 'var(--purple)' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                            <CalendarIcon size={14} style={{ color: 'var(--text-muted)' }}/> {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            <Clock size={12}/> {booking.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                        ₹{booking.totalAmount}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id || booking.id, 'confirmed')}
                              style={{ padding: '6px', background: 'var(--green-dim)', color: 'var(--green)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                              title="Confirm"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id || booking.id, 'completed')}
                              className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}
                            >
                              Done
                            </button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id || booking.id, 'cancelled')}
                              style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          {(booking.status === 'completed' || booking.status === 'cancelled') && (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="6">
                        <div className="empty-state">
                          <CalendarIcon size={36} />
                          <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No {filter !== 'all' ? filter : ''} appointments found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.length > 0 ? filtered.map((booking) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`mob-${booking._id || booking.id}`} style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px', background: 'var(--purple-dim)', color: 'var(--purple)' }}>
                        {booking.userId?.name ? booking.userId.name.charAt(0) : <User size={16} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{booking.userId?.name || 'Client'}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.serviceIds?.[0]?.name || 'Service'}</p>
                      </div>
                    </div>
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-purple' :
                      booking.status === 'completed' ? 'badge-green' :
                      booking.status === 'cancelled' ? 'badge-muted' :
                      'badge-amber'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'var(--bg-base)', padding: '10px 12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        <CalendarIcon size={12} style={{ color: 'var(--text-muted)' }}/> {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <Clock size={12}/> {booking.timeSlot}
                      </span>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>₹{booking.totalAmount}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {booking.status === 'pending' && (
                      <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'confirmed')} style={{ padding: '8px 16px', background: 'var(--green-dim)', color: 'var(--green)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} /> Confirm
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'completed')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} /> Done
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'cancelled')} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="empty-state">
                  <CalendarIcon size={36} />
                  <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No {filter !== 'all' ? filter : ''} appointments found.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
