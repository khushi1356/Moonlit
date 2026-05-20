import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeUp, RevealText } from '../../../components/animations';

const HEIGHTS = [300, 200, 380, 220, 280, 340, 190, 360, 240, 310, 180, 420, 260, 200, 320, 280];
const FALL_ANIMS = [
  { y: -180, rotate: -6 }, { y: -120, rotate: 4 }, { y: -200, rotate: -3 }, { y: -150, rotate: 7 },
  { y: -160, rotate: -5 }, { y: -220, rotate: 3 }, { y: -140, rotate: -8 }, { y: -180, rotate: 5 },
];

const GallerySection = ({ gallery, onOpenLightbox }) => (
  <section id="gallery" className="w-full bg-[var(--color-secondary)] py-16 md:py-24">
    <div className="max-w-[1600px] mx-auto px-4 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16">
        <div className="flex flex-col items-start">
          <FadeUp><span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-[var(--color-primary)]/40 mb-3 block">Visual Archive</span></FadeUp>
          <RevealText as="h2" text="The Lookbook" className="text-3xl md:text-5xl font-serif text-[var(--color-primary)] uppercase tracking-tighter" />
        </div>
        <FadeUp delay={0.2}><p className="text-gray-400 text-xs font-light italic mt-4 md:mt-0">Click any image to explore full size</p></FadeUp>
      </div>

      {gallery.length === 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
          {[280, 200, 350, 220, 300, 180, 400, 250].map((h, i) => (
            <div key={i} className="break-inside-avoid mb-3 bg-gray-200 animate-pulse rounded-sm" style={{ height: `${h}px` }} />
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
          {gallery.map((img, i) => {
            const fall = FALL_ANIMS[i % FALL_ANIMS.length];
            const h = HEIGHTS[i % HEIGHTS.length];
            return (
              <motion.div
                key={img._id || img.id || i}
                className="break-inside-avoid mb-3 md:mb-4 group relative overflow-hidden cursor-pointer shadow-md"
                style={{ height: `${h}px` }}
                initial={{ opacity: 0, y: fall.y, rotate: fall.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.1, margin: '50px' }}
                transition={{ type: 'spring', stiffness: 60, damping: 14, delay: (i % 4) * 0.12 }}
                whileHover={{ scale: 1.02, rotate: fall.rotate * 0.3, transition: { duration: 0.4 } }}
                onClick={() => onOpenLightbox(i)}
              >
                <img src={img.imageUrl || img.image} alt={img.title || `Look ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: 'linear-gradient(to top, rgba(17,30,54,0.80) 0%, transparent 65%)' }}>
                  <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400 flex items-center justify-between">
                    {img.title && <p className="text-white text-[9px] md:text-[10px] tracking-widest uppercase font-bold">{img.title}</p>}
                    <div className="ml-auto flex items-center gap-1 text-white/70"><span className="text-[8px] tracking-widest uppercase">Open</span><ArrowRight size={9} /></div>
                  </div>
                </div>
                <span className="absolute top-2 left-2 text-[9px] font-bold text-white/0 group-hover:text-white/50 transition-all duration-500">{String(i + 1).padStart(2, '0')}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  </section>
);

export default GallerySection;
