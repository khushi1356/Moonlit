import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Send, Mail } from 'lucide-react';
import { getCampaigns, createCampaign, deleteCampaign } from '../api/adminApi';
import toast from 'react-hot-toast';

const MarketingPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: '', body: '', targetAudience: 'all' });

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getCampaigns(); setCampaigns(res.data || res || []); }
    catch { toast.error('Failed to load campaigns'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createCampaign({ subject: form.subject, bodyHtml: form.body, targetAudience: form.targetAudience });
      toast.success('Campaign sent successfully!');
      setIsModalOpen(false); setForm({ subject: '', body: '', targetAudience: 'all' }); fetchData();
    } catch { toast.error('Failed to send campaign'); }
    finally { setSending(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try { await deleteCampaign(id); toast.success('Campaign deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Marketing</h1>
          <p className="page-sub">{campaigns.length} campaigns sent</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={15} /> New Campaign
        </button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : campaigns.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {campaigns.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--amber-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{c.subject}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.body}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rose)' }} /> Audience: {c.targetAudience || 'all'}</span>
                    {c.targetUsersCount !== undefined && <span>Sent to: {c.targetUsersCount}</span>}
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="btn-danger hover-opacity" style={{ padding: '8px' }} onClick={() => handleDelete(c._id)}>
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
          <style>{`.hover-opacity { opacity: 0.3; transition: opacity 0.2s; } .card:hover .hover-opacity { opacity: 1; }`}</style>
        </div>
      ) : (
        <div className="empty-state card" style={{ padding: '60px 20px' }}>
          <Mail size={48} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>No Campaigns Yet</h3>
          <p style={{ fontSize: '14px' }}>Send your first email campaign to engage your customers.</p>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '16px' }}>Create Campaign</button>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }} className="modal-box" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Compose Campaign</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Target Audience</label>
                  <select value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} className="input">
                    <option value="all">All Users</option>
                    <option value="premium">Premium Users</option>
                    <option value="inactive">Inactive Users (30+ days)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject</label>
                  <input required placeholder="Flash Sale: 20% off all haircuts!" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Body</label>
                  <textarea required rows={8} placeholder="Write your message here..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="input" style={{ fontFamily: 'monospace', fontSize: '13px' }} />
                </div>
                <button type="submit" disabled={sending} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', opacity: sending ? 0.7 : 1 }}>
                  <Send size={16} /> {sending ? 'Sending...' : 'Send Campaign Now'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketingPage;
