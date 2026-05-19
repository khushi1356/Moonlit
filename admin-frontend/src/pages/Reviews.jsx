import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Search, User } from 'lucide-react';
import { getAllReviews, deleteReview } from '../api/adminApi';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllReviews();
      setReviews(res.data || res || []);
    } catch { toast.error('Failed to load reviews'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await deleteReview(id); toast.success('Review deleted'); fetchData(); }
    catch { toast.error('Failed to delete review'); }
  };

  const filtered = reviews.filter(r =>
    r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Reviews</h1>
          <p className="page-sub">{reviews.length} total customer reviews</p>
        </div>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="input" style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.length > 0 ? filtered.map((review, i) => (
            <motion.div key={review._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {review.userId?.profilePic ? (
                    <img src={review.userId.profilePic} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="avatar" style={{ width: '40px', height: '40px', background: 'var(--purple-dim)', color: 'var(--purple)', fontSize: '16px' }}>
                      {review.userId?.name ? review.userId.name.charAt(0) : <User size={20} />}
                    </div>
                  )}
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{review.userId?.name || 'Anonymous'}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <button className="btn-danger hover-opacity" style={{ padding: '8px' }} onClick={() => handleDelete(review._id)}>
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} style={{ color: s <= review.rating ? 'var(--amber)' : 'var(--border-hover)', fill: s <= review.rating ? 'var(--amber)' : 'transparent' }} />
                ))}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: '500' }}>{review.rating}/5</span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>"{review.comment}"</p>

              {review.serviceId && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <span className="badge badge-rose" style={{ display: 'inline-flex', fontSize: '10px' }}>
                    {review.serviceId?.name || review.serviceId}
                  </span>
                </div>
              )}
            </motion.div>
          )) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Star size={40} style={{ color: 'var(--amber)', opacity: 0.5 }} />
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '12px' }}>No reviews found.</p>
            </div>
          )}
          <style>{`.hover-opacity { opacity: 0; transition: opacity 0.2s; } .card:hover .hover-opacity { opacity: 1; }`}</style>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
