import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryLightbox = ({ lightbox, gallery, onClose, onPrev, onNext }) => {
  return (
    <AnimatePresence>
      {lightbox.open && gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button onClick={onClose} className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm p-2 rounded-full">
            <X size={22} />
          </button>
          <div className="absolute top-5 left-5 text-white/40 text-xs tracking-widest font-bold z-10">
            {String(lightbox.index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '00')}
          </div>
          <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20">
            <ChevronLeft size={24} />
          </button>
          <motion.div
            key={lightbox.index}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={gallery[lightbox.index]?.imageUrl || gallery[lightbox.index]?.image}
              alt={gallery[lightbox.index]?.title || 'Gallery'}
              className="max-w-full max-h-[78vh] object-contain rounded-sm shadow-2xl"
            />
            {gallery[lightbox.index]?.title && (
              <p className="text-white/60 text-xs tracking-widest uppercase font-bold mt-4">{gallery[lightbox.index].title}</p>
            )}
          </motion.div>
          <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20">
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
