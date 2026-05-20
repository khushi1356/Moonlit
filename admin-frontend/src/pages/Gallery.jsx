import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Image as ImageIcon, Upload, Eye } from 'lucide-react';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../api/adminApi';
import toast from 'react-hot-toast';

const GalleryPage = React.memo(() => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewImage, setViewImage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getGallery(); setGallery(res.data || res || []); }
    catch { toast.error('Failed to load gallery'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error('Please select an image file');
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (form.title) formData.append('caption', form.title);
      if (form.category) formData.append('category', form.category);

      await createGalleryItem(formData);
      toast.success('Image uploaded');
      setIsModalOpen(false);
      setForm({ title: '', category: '' });
      setImageFile(null); setImagePreview(null);
      fetchData();
    } catch { toast.error('Failed to upload image'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image?')) return;
    try { await deleteGalleryItem(id); toast.success('Image removed'); fetchData(); }
    catch { toast.error('Failed to delete image'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery</h1>
          <p className="page-sub">{gallery.length} beautiful shots</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={15} /> Add Image
        </button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : gallery.length > 0 ? (
        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {gallery.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              style={{
                position: 'relative', aspectRatio: '1/1', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid var(--border)', background: 'var(--bg-input)'
              }}
              className="gallery-item-card"
            >
              <img src={item.imageUrl} alt={item.title || 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
              <div className="gallery-overlay" style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0,
                transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
              }}>
                {item.title && <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', textAlign: 'center', padding: '0 12px' }}>{item.title}</p>}
                {item.category && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', color: 'white', backdropFilter: 'blur(4px)' }}>{item.category}</span>}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => setViewImage(item.imageUrl)} style={{
                    padding: '8px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%',
                    border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)'
                  }}>
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{
                    padding: '8px', background: 'rgba(239,68,68,0.9)', color: 'white', borderRadius: '50%',
                    border: 'none', cursor: 'pointer'
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <style>{`
            .gallery-item-card:hover img { transform: scale(1.08); }
            .gallery-item-card:hover .gallery-overlay { opacity: 1 !important; }
            @media (max-width: 768px) {
              .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
              .gallery-item-card .gallery-overlay { opacity: 1 !important; }
            }
          `}</style>
        </div>
      ) : (
        <div className="empty-state card" style={{ padding: '60px 20px' }}>
          <ImageIcon size={48} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Gallery is Empty</h3>
          <p style={{ fontSize: '14px' }}>Add beautiful images to showcase your work.</p>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '16px' }}>Add First Image</button>
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
                  Add to Gallery
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!imagePreview ? (
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '160px', border: '2px dashed var(--border-hover)', borderRadius: '16px',
                    background: 'var(--bg-input)', cursor: 'pointer', transition: 'border-color 0.2s', gap: '12px'
                  }} className="upload-zone">
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--rose-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose)' }}>
                      <Upload size={20} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Click to upload image</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>JPG, PNG up to 5MB</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <style>{`.upload-zone:hover { border-color: var(--rose) !important; }`}</style>
                  </label>
                ) : (
                  <div style={{ position: 'relative', height: '200px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{
                      position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)',
                      color: 'white', padding: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer'
                    }}>
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title / Caption (Optional)</label>
                  <input placeholder="e.g. Bridal Makeup" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category (Optional)</label>
                  <input placeholder="e.g. Haircuts" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input" />
                </div>

                <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '8px', opacity: saving ? 0.7 : 1 }}>
                  <Upload size={16} /> {saving ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {viewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
            }}
            onClick={() => setViewImage(null)}>
            <button style={{
              position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)',
              border: 'none', color: 'white', padding: '12px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onClick={() => setViewImage(null)}>
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={viewImage} 
              style={{ maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} 
              alt="Full view" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default GalleryPage;
