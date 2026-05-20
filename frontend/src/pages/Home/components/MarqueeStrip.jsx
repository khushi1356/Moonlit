import { motion } from 'framer-motion';
import { MARQUEE_ITEMS } from '../../../constants';

const MarqueeStrip = () => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="w-full overflow-hidden bg-[var(--color-primary)] py-6 border-t border-[var(--color-primary)]/10">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: [0, '-50%'] }}
        transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        style={{ width: 'max-content' }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-white font-serif italic uppercase flex items-center" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.02em' }}>
            <span className="text-white not-italic mx-6 md:mx-10" style={{ fontSize: '0.5em', transform: 'translateY(-2px)' }}>•</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeStrip;
