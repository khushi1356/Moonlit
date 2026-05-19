import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { getReviews, addReview } from '../api/reviewApi';
import toast from 'react-hot-toast';

const StarRating = ({ value, onChange, readOnly = false }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => !readOnly && onChange && onChange(star)}
        style={{
          background: 'none', border: 'none', cursor: readOnly ? 'default' : 'pointer', padding: '2px',
          color: star <= value ? 'var(--color-rose)' : 'var(--color-primary)',
          opacity: star <= value ? 1 : 0.2,
          transition: 'all 0.2s'
        }}
      >
        <Star size={readOnly ? 14 : 20} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ serviceId, serviceName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getReviews(serviceId);
      setReviews(res.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !user) {
      toast.error('Please login to leave a review.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment.');
      return;
    }
    try {
      setSubmitting(true);
      await addReview({ serviceId, rating, comment });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-8 pt-8 border-t border-[var(--color-primary)]/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm tracking-widest uppercase font-bold text-[var(--color-primary)]">Reviews</h4>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(parseFloat(avgRating))} readOnly />
              <span className="text-xs text-gray-400 font-bold">{avgRating} / 5 ({reviews.length})</span>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (!token || !user) {
              toast.error('Please login to leave a review.');
              return;
            }
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-[10px] md:text-xs tracking-widest uppercase font-bold rounded-lg hover:bg-[var(--color-primary-light)] active:scale-95 transition-all shadow-md"
        >
          {showForm ? <><ChevronUp size={14} /> Cancel</> : <><Star size={14} /> Write Review</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onSubmit={handleSubmit}
              className="relative z-[71] w-full max-w-md p-6 border border-[var(--color-primary)]/10 rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-bold text-[var(--color-primary)]">Write a Review</h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-[var(--color-primary)]">
                  <ChevronUp className="w-5 h-5 rotate-180" />
                </button>
              </div>
            <p className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-4">Your Rating</p>
            <StarRating value={rating} onChange={setRating} />
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={`Share your experience with ${serviceName}...`}
              rows={3}
              className="w-full mt-4 p-4 border border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] text-sm focus:border-[var(--color-rose)] outline-none resize-none font-sans rounded-lg"
            />
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full flex justify-center items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
              >
                <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <p className="text-xs text-gray-400 italic font-serif">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-gray-400 italic font-serif">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {(r.userId?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[var(--color-primary)]">{r.userId?.name || 'Guest'}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <StarRating value={r.rating} readOnly />
                <p className="text-sm text-gray-500 font-light mt-2 leading-relaxed">{r.comment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
