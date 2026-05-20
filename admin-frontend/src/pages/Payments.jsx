import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { getAllPayments } from '../api/adminApi';
import toast from 'react-hot-toast';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllPayments();
        setPayments(res.data || res || []);
      } catch { toast.error('Failed to load payments'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const capturedPayments = payments.filter(p => p.status === 'captured');
  const totalRevenue = capturedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments Ledger</h1>
          <p className="page-sub">{payments.length} transactions recorded</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="card stat-rose" style={{ padding: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Revenue</p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IndianRupee size={24} style={{ color: 'var(--rose)' }} />
            {totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card stat-teal" style={{ padding: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Successful</p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--teal)' }}>
            {payments.filter(p => p.status === 'captured').length}
          </h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card stat-amber" style={{ padding: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Failed / Pending</p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#f87171' }}>
            {payments.filter(p => p.status !== 'captured').length}
          </h3>
        </motion.div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card" style={{ overflow: 'hidden' }}>
          <>
            <div className="desktop-only" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {capturedPayments.length > 0 ? capturedPayments.map((p, i) => (
                    <tr key={p._id || i}>
                      <td>
                        <code style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px' }}>
                          {p.razorpay_payment_id || (p._id && `pay_${p._id.slice(-8)}`) || '—'}
                        </code>
                      </td>
                      <td><span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.razorpay_order_id || '—'}</span></td>
                      <td style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                        ₹{(p.amount || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'captured' ? 'badge-green' : p.status === 'failed' ? 'badge-muted' : 'badge-amber'}`} style={{ display: 'inline-flex', gap: '4px' }}>
                          {p.status === 'captured' ? <CheckCircle size={12} /> : p.status === 'failed' ? <XCircle size={12} /> : <Clock size={12} />}
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <IndianRupee size={36} />
                          <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No payments found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {}
            <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {capturedPayments.length > 0 ? capturedPayments.map((p, i) => (
                <div key={p._id || i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span className={`badge ${p.status === 'captured' ? 'badge-green' : p.status === 'failed' ? 'badge-muted' : 'badge-amber'}`} style={{ display: 'inline-flex', gap: '4px' }}>
                      {p.status === 'captured' ? <CheckCircle size={12} /> : p.status === 'failed' ? <XCircle size={12} /> : <Clock size={12} />}
                      {p.status}
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                      ₹{(p.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payment ID</span>
                      <code style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.razorpay_payment_id || (p._id && `pay_${p._id.slice(-8)}`) || '—'}</code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Order ID</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.razorpay_order_id || '—'}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <IndianRupee size={36} />
                  <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No payments found</p>
                </div>
              )}
            </div>
          </>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentsPage;
