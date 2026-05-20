import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Scissors, Clock, IndianRupee, Tag } from 'lucide-react';
import { getServices, createService, updateService, deleteService, getCategories } from '../api/adminApi';
import toast from 'react-hot-toast';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', categoryId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([getServices(), getCategories()]);
      setServices(sRes.data || sRes || []);
      setCategories(cRes.data || cRes || []);
    } catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', duration: '', categoryId: '' });
    setImageFile(null); setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || '', price: s.price, duration: s.duration || '', categoryId: s.categoryId?._id || s.categoryId || '' });
    setImageFile(null); setImagePreview(s.image || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      fd.append('mrp', form.price); 
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await updateService(editing._id, fd); toast.success('Service updated'); }
      else { await createService(fd); toast.success('Service created'); }
      setIsModalOpen(false);
      fetchData();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save service'); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await deleteService(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {}
      <div className="page-header">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-sub">{services.length} services available</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {services.length > 0 ? services.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ overflow: 'hidden' }}
            >
              {}
              <div style={{
                height: '140px', background: s.image
                  ? `url(${s.image}) center/cover no-repeat`
                  : 'linear-gradient(135deg, rgba(244,114,182,0.1), rgba(167,139,250,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid var(--border)',
              }}>
                {!s.image && <Scissors size={32} style={{ color: 'var(--rose)', opacity: 0.6 }} />}
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3 }}>{s.name}</h3>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-edit" style={{ padding: '5px 10px' }} onClick={() => openEdit(s)}>
                      <Edit2 size={12} />
                    </button>
                    <button className="btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(s._id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rose)', fontWeight: '800', fontSize: '20px' }}>
                    <IndianRupee size={16} strokeWidth={2.5} />
                    {s.price}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {s.duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <Clock size={12} /> {s.duration} min
                      </span>
                    )}
                    {s.categoryId && (
                      <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Tag size={9} /> {s.categoryId?.name || s.categoryId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Scissors size={40} />
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)' }}>No services yet</p>
              <p style={{ fontSize: '13px' }}>Add your first service to get started</p>
              <button className="btn-primary" onClick={openAdd} style={{ marginTop: '8px' }}>
                <Plus size={14} /> Add Service
              </button>
            </div>
          )}
        </div>
      )}

      {}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="modal-box"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {editing ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px',
                  padding: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label htmlFor="imgUpload" className="img-upload-box">
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" />
                      : <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                    }
                  </label>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Service Image</p>
                    <input id="imgUpload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="imgUpload" style={{
                      cursor: 'pointer', fontSize: '12px', color: 'var(--rose)',
                      background: 'var(--rose-dim)', padding: '6px 14px', borderRadius: '8px',
                      border: '1px solid rgba(244,114,182,0.25)', fontWeight: '600',
                    }}>
                      Choose File
                    </label>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Service Name *</label>
                  <input required placeholder="e.g. Deep Cleansing Facial" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
                  <textarea placeholder="Describe this service..." value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} className="input" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Price (₹) *</label>
                    <input required type="number" placeholder="500" value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duration (min) *</label>
                    <input required type="number" placeholder="60" value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })} className="input" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</label>
                  <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="input">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : (editing ? 'Update Service' : 'Create Service')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesPage;
