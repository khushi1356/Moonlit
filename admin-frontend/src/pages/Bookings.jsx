import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Calendar, IndianRupee, Clock } from 'lucide-react';
import { getAdminBookings, updateBookingStatus } from '../api/adminApi';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  if (s === 'confirmed') return 'badge-rose';
  if (s === 'completed') return 'badge-green';
  if (s === 'cancelled') return 'badge-muted';
  return 'badge-amber';
};

const Bookings = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAdminBookings();
      setBookings(res.data || res || []);
    } catch { toast.error('Failed to fetch bookings'); setBookings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = useMemo(() => {
    return bookings.filter(b =>
      (b._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.serviceIds?.[0]?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-sub">{bookings.length} total appointments</p>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Search by ID, client, or service..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="input" style={{ paddingLeft: '36px', padding: '9px 12px 9px 36px' }}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> entries
          </span>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="desktop-only" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((b, i) => (
                    <motion.tr
                      key={b._id || i}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ transition: 'background 0.15s' }}
                    >
                      <td>
                        <code style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '3px 7px', borderRadius: '6px' }}>
                          #{(b._id || '').slice(-6)}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                            {(b.userId?.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', fontSize: '13px' }}>{b.userId?.name || 'Client'}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.userId?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px' }}>{b.serviceIds?.[0]?.name || 'Service'}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                            <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                            {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <Clock size={10} /> {b.timeSlot || '—'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700', color: 'var(--rose)', fontSize: '14px' }}>
                          <IndianRupee size={12} strokeWidth={2.5} />{b.totalAmount || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge(b.status)}`}>{b.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                            title="Confirm"
                            style={{ background: 'var(--green-dim)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '8px', padding: '6px', color: 'var(--green)', cursor: 'pointer', display: 'flex' }}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                            title="Cancel"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px', color: '#f87171', cursor: 'pointer', display: 'flex' }}
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="7">
                        <div className="empty-state">
                          <Calendar size={36} />
                          <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No bookings found</p>
                          <p style={{ fontSize: '13px' }}>Bookings will appear here once clients start booking.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {}
            <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.length > 0 ? filtered.map((b, i) => (
                <div key={b._id || i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span className={`badge ${statusBadge(b.status)}`} style={{ marginBottom: '8px', display: 'inline-block' }}>{b.status}</span>
                      <code style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                        #{(b._id || '').slice(-6)}
                      </code>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--rose)', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <IndianRupee size={12} strokeWidth={2.5} />{b.totalAmount || 0}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {(b.userId?.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{b.userId?.name || 'Client'}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.userId?.email || ''}</p>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                    {b.serviceIds?.[0]?.name || 'Service'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-primary)' }}>
                        <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                        {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <Clock size={10} /> {b.timeSlot || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleUpdateStatus(b._id, 'confirmed')} style={{ background: 'var(--green-dim)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '8px', padding: '6px', color: 'var(--green)', cursor: 'pointer' }}>
                        <CheckCircle size={14} />
                      </button>
                      <button onClick={() => handleUpdateStatus(b._id, 'cancelled')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px', color: '#f87171', cursor: 'pointer' }}>
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Calendar size={36} />
                  <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No bookings found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Bookings;
