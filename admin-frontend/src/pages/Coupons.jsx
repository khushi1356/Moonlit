import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api/adminApi';
import toast from 'react-hot-toast';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxUses: '', expiry: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getCoupons(); setCoupons(res.data || res || []); }
    catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxUses: '', expiry: '', isActive: true }); setIsModalOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ code: c.code, discountType: c.discountType || 'percentage', discountValue: c.discountValue, minOrderValue: c.minOrderValue || '', maxUses: c.maxUses || '', expiry: c.expiry ? new Date(c.expiry).toISOString().split('T')[0] : '', isActive: c.isActive });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await updateCoupon(editing._id, form); toast.success('Coupon updated'); }
      else { await createCoupon(form); toast.success('Coupon created'); }
      setIsModalOpen(false); fetchData();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save coupon'); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try { await deleteCoupon(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-sub">{coupons.length} discount codes</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Create Coupon</button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {coupons.length > 0 ? coupons.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card" style={{ padding: '24px', opacity: c.isActive ? 1 : 0.6 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span className={`badge ${c.isActive ? 'badge-green' : 'badge-muted'}`} style={{ fontSize: '13px', padding: '5px 12px' }}>
                  {c.code}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-edit" style={{ padding: '5px 10px' }} onClick={() => openEdit(c)}><Edit2 size={12} /></button>
                  <button className="btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(c._id)}><Trash2 size={12} /></button>
                </div>
              </div>

              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--rose)', marginBottom: '16px', lineHeight: 1 }}>
                {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500', marginLeft: '6px' }}>OFF</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {c.minOrderValue > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}><span>Min Order</span> <span style={{ fontWeight: '600' }}>₹{c.minOrderValue}</span></div>}
                {c.maxUses && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}><span>Max Uses</span> <span style={{ fontWeight: '600' }}>{c.maxUses}</span></div>}
                {c.usedCount !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}><span>Used</span> <span style={{ fontWeight: '600' }}>{c.usedCount} times</span></div>}
                {c.expiry && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}><span>Expires</span> <span style={{ fontWeight: '600' }}>{new Date(c.expiry).toLocaleDateString()}</span></div>}
              </div>
            </motion.div>
          )) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Tag size={40} />
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)' }}>No coupons yet</p>
              <button className="btn-primary" onClick={openAdd} style={{ marginTop: '8px' }}><Plus size={14} /> Create Coupon</button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              className="modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {editing ? 'Edit Coupon' : 'Create Coupon'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Coupon Code *</label>
                  <input required placeholder="e.g. SUMMER20" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input" style={{ fontFamily: 'monospace', fontSize: '15px', letterSpacing: '2px', fontWeight: '600', color: 'var(--rose)' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type</label>
                    <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="input">
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Value *</label>
                    <input required type="number" placeholder="20" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} className="input" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Min Order</label>
                    <input type="number" placeholder="0" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Max Uses</label>
                    <input type="number" placeholder="Unlimited" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} className="input" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Expiry Date</label>
                  <input type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} className="input" />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: 'var(--rose)', width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Coupon is Active</span>
                </label>

                <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : (editing ? 'Update Coupon' : 'Create Coupon')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponsPage;
