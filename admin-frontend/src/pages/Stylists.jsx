import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Briefcase, Star, User } from 'lucide-react';
import { getStylists, createStylist, updateStylist, deleteStylist, getAllUsers } from '../api/adminApi';
import toast from 'react-hot-toast';

const StylistsPage = () => {
  const [stylists, setStylists] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ userId: '', specialization: '', experience: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([getStylists(), getAllUsers()]);
      setStylists(sRes.data || sRes || []);
      const allUsers = uRes.data || uRes || [];
      setUsers(allUsers.filter(u => u.role === 'stylist' || u.role === 'user'));
    } catch { toast.error('Failed to load stylists'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm({ userId: '', specialization: '', experience: '', bio: '' }); setImageFile(null); setImagePreview(null); setIsModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ userId: s.userId?._id || s.userId || '', specialization: s.specialization || '', experience: s.experience || '', bio: s.bio || '' }); setImageFile(null); setImagePreview(s.userId?.profilePic || null); setIsModalOpen(true); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !imageFile) return toast.error('Profile picture is required');
    setSaving(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (imageFile) formData.append('profilePic', imageFile);

      if (editing) { await updateStylist(editing._id, formData); toast.success('Updated'); }
      else { await createStylist(formData); toast.success('Created'); }
      setIsModalOpen(false); fetchData();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Save failed'); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete stylist?')) return;
    try { await deleteStylist(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Stylists</h1>
          <p className="page-sub">{stylists.length} team members</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Stylist</button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {stylists.length > 0 ? stylists.map((s, i) => (
            <motion.div key={s._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {s.userId?.profilePic ? (
                    <img src={s.userId.profilePic} alt={s.userId?.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                  ) : (
                    <div className="avatar" style={{ width: '64px', height: '64px', background: 'var(--amber-dim)', color: 'var(--amber)', fontSize: '24px' }}>
                      {s.userId?.name ? s.userId.name.charAt(0) : <Briefcase size={24} />}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>{s.userId?.name || 'Unnamed'}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--rose)', fontWeight: '600' }}>{s.specialization || 'General Stylist'}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.experience} yrs exp</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-edit" style={{ padding: '6px' }} onClick={() => openEdit(s)}><Edit2 size={12} /></button>
                  <button className="btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(s._id)}><Trash2 size={12} /></button>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{s.bio || 'No bio available.'}</p>
              {s.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <Star size={14} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.rating}</span>
                </div>
              )}
            </motion.div>
          )) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Briefcase size={40} style={{ color: 'var(--text-muted)' }} />
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '12px' }}>No stylists yet</p>
              <button className="btn-primary" onClick={openAdd} style={{ marginTop: '8px' }}><Plus size={14} /> Add First Stylist</button>
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
                  {editing ? 'Edit Stylist' : 'Add Stylist'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!editing && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Link User Account *</label>
                    <select required value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} className="input">
                      <option value="">Select User</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label htmlFor="dpUpload" style={{
                    width: '72px', height: '72px', borderRadius: '50%', border: '2px dashed var(--border-hover)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-input)',
                    overflow: 'hidden', cursor: 'pointer'
                  }}>
                    {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="DP" /> : <Plus size={20} style={{ color: 'var(--text-muted)' }} />}
                  </label>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Profile Picture {!editing && '*'}</p>
                    <input id="dpUpload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} required={!editing} />
                    <label htmlFor="dpUpload" className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }}>Browse</label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Specialization</label>
                    <input placeholder="e.g. Haircut" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Experience (Yrs)</label>
                    <input type="number" placeholder="5" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bio</label>
                  <textarea placeholder="Write a short bio..." rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input" />
                </div>

                <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : (editing ? 'Update Stylist' : 'Save Stylist')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StylistsPage;
