import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, FolderOpen } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/adminApi';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getCategories(); setCategories(res.data || res || []); }
    catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '' }); setImageFile(null); setImagePreview(null); setIsModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setImageFile(null); setImagePreview(c.image || null); setIsModalOpen(true); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !imageFile && !form.image) return toast.error('Category image is required');
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (imageFile) formData.append('image', imageFile);

      if (editing) { await updateCategory(editing._id, formData); toast.success('Category updated'); }
      else { await createCategory(formData); toast.success('Category created'); }
      setIsModalOpen(false); fetchData();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save category'); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Delete failed'); }
  };

  const colors = ['rose', 'teal', 'purple', 'amber', 'green'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-sub">{categories.length} categories total</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Category</button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {categories.length > 0 ? categories.map((cat, i) => {
            const color = colors[i % colors.length];
            return (
              <motion.div key={cat._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="card"
                style={{ padding: '24px', borderLeft: `3px solid var(--${color})` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden',
                    background: `var(--${color}-dim)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: `var(--${color})`,
                  }}>
                    {cat.image ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FolderOpen size={20} />}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-edit" style={{ padding: '5px 10px' }} onClick={() => openEdit(cat)}><Edit2 size={12} /></button>
                    <button className="btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(cat._id)}><Trash2 size={12} /></button>
                  </div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{cat.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{cat.description || 'No description provided.'}</p>
              </motion.div>
            );
          }) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <FolderOpen size={40} />
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)' }}>No categories yet</p>
              <button className="btn-primary" onClick={openAdd} style={{ marginTop: '8px' }}><Plus size={14} /> Add Category</button>
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
                  {editing ? 'Edit Category' : 'Add Category'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label htmlFor="catImage" style={{
                    width: '72px', height: '72px', borderRadius: '12px', border: '2px dashed var(--border-hover)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-input)',
                    overflow: 'hidden', cursor: 'pointer'
                  }}>
                    {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Category" /> : <Plus size={20} style={{ color: 'var(--text-muted)' }} />}
                  </label>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category Image {!editing && '*'}</p>
                    <input id="catImage" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} required={!editing} />
                    <label htmlFor="catImage" className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }}>Browse</label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category Name *</label>
                  <input required placeholder="e.g. Hair Care" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
                  <textarea placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : (editing ? 'Update Category' : 'Create Category')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesPage;
