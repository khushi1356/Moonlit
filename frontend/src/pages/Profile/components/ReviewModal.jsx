import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, reviewData, setReviewData, onSubmit, submitting }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white p-9 shadow-2xl rounded-xl border border-gray-100">
          <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-[var(--color-primary)] transition-all"><X className="w-5 h-5" /></button>
          <h2 className="text-2xl font-serif uppercase tracking-widest mb-1.5 text-center text-[var(--color-primary)]">Leave a Review</h2>
          <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-7 text-center">Share your experience</p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center py-5 border-y border-gray-100">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} onClick={() => setReviewData({ ...reviewData, rating: star })} className={`w-7 h-7 cursor-pointer transition-transform hover:scale-125 ${star <= reviewData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <textarea required rows="4" value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-none rounded-lg transition-all" placeholder="Your thoughts..." />
            <button type="submit" disabled={submitting} className={`w-full py-4 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-sm hover:bg-[var(--color-primary)]/90 ${submitting ? 'opacity-50' : ''}`}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ReviewModal;
