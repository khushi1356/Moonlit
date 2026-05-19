import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, CheckCircle, MessageSquare, Send, X, Bell, CheckCheck } from 'lucide-react';
import { getContactMessages, updateContactStatus, deleteContactMessage, replyToContact } from '../api/adminApi';
import toast from 'react-hot-toast';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getContactMessages(); setMessages(res.data || res || []); }
    catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSelect = (msg) => {
    setSelected(msg);
    setShowReplyBox(false);
    setReplyText('');
  };

  const handleMarkRead = async (id) => {
    try { await updateContactStatus(id, { status: 'read' }); fetchData(); toast.success('Marked as read'); }
    catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await deleteContactMessage(id); toast.success('Deleted'); setSelected(null); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error('Please write a reply message.');
    setReplying(true);
    try {
      const res = await replyToContact(selected._id, replyText);
      if (res.notificationSent) {
        toast.success('✅ Reply sent as in-app notification to the customer!');
      } else {
        toast.success('Reply recorded. Customer is not a registered user — no in-app notification sent.');
      }
      setReplyText('');
      setShowReplyBox(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply.');
    } finally {
      setReplying(false);
    }
  };

  const statusBadge = (status) => {
    if (status === 'replied') return { label: 'Replied', bg: 'rgba(16,185,129,0.12)', color: '#10b981' };
    if (status === 'read') return { label: 'Read', bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
    return { label: 'Unread', bg: 'rgba(239,68,68,0.12)', color: '#f87171' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Messages</h1>
          <p className="page-sub">{messages.filter(m => m.status !== 'read' && m.status !== 'replied').length} unread messages</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="messages-layout">
          <style>{`
            @media (min-width: 1024px) {
              .messages-layout { grid-template-columns: 350px 1fr !important; align-items: start; }
            }
          `}</style>
          
          {/* Message List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length > 0 ? messages.map((msg) => {
              const badge = statusBadge(msg.status);
              return (
                <motion.div key={msg._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleSelect(msg)}
                  style={{
                    padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                    background: selected?._id === msg._id ? 'var(--rose-dim)' : 'var(--bg-card)',
                    border: `1px solid ${selected?._id === msg._id ? 'var(--rose)' : 'var(--border)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{msg.name}</p>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: badge.bg, color: badge.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {badge.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{msg.email}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.subject}</p>
                </motion.div>
              );
            }) : (
              <div className="empty-state card" style={{ padding: '40px 20px' }}>
                <MessageSquare size={32} />
                <p style={{ fontSize: '14px', fontWeight: '500' }}>No messages yet.</p>
              </div>
            )}
          </div>

          {/* Message Detail Panel */}
          <div style={{ position: 'sticky', top: '90px' }}>
            {selected ? (
              <motion.div key={selected._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '32px' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{selected.subject}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      From: <strong style={{ color: 'var(--text-primary)' }}>{selected.name}</strong> ({selected.email})
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {selected.phone && `Tel: ${selected.phone} · `}{new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {selected.status !== 'read' && selected.status !== 'replied' && (
                      <button onClick={() => handleMarkRead(selected._id)} title="Mark as read"
                        style={{ padding: '8px', background: 'var(--green-dim)', color: 'var(--green)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected._id)}
                      style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', fontSize: '14px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '24px' }}>
                  {selected.message}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Bell size={16} />
                    {showReplyBox ? 'Cancel Reply' : 'Reply via Notification'}
                  </button>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', cursor: 'pointer', background: 'var(--bg-input)' }}
                  >
                    <Mail size={16} /> Reply via Email
                  </a>
                </div>

                {/* In-App Reply Box */}
                <AnimatePresence>
                  {showReplyBox && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      style={{ marginTop: '20px', overflow: 'hidden' }}
                    >
                      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <Bell size={16} style={{ color: 'var(--rose)' }} />
                          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            Send In-App Notification Reply
                          </p>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          This message will appear in <strong>{selected.name}</strong>'s notification list if they are a registered customer.
                        </p>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply here..."
                          rows={4}
                          style={{
                            width: '100%', padding: '12px', borderRadius: '10px',
                            border: '1px solid var(--border)', background: 'var(--bg-card)',
                            fontSize: '14px', color: 'var(--text-primary)', resize: 'vertical',
                            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                          <button
                            onClick={() => { setShowReplyBox(false); setReplyText(''); }}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleReply}
                            disabled={replying || !replyText.trim()}
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: replying || !replyText.trim() ? 0.6 : 1 }}
                          >
                            <Send size={14} />
                            {replying ? 'Sending...' : 'Send Notification'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            ) : (
              <div className="empty-state card" style={{ height: '400px' }}>
                <MessageSquare size={48} />
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)' }}>Select a message</p>
                <p style={{ fontSize: '13px' }}>Choose a message from the list to read and reply.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
