import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ConfirmStep = () => (
  <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16">
    <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center mb-8 shadow-xl">
      <Check className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-sm tracking-[0.2em] uppercase font-light text-gray-500 mb-4">Reservation Complete</h2>
    <p className="text-3xl font-serif uppercase tracking-widest text-[var(--color-primary)] mb-10">See you soon.</p>
    <div className="flex gap-4">
      <button onClick={() => window.location.href = '/profile'} className="px-8 py-4 border border-[var(--color-primary)] text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors">
        View Profile
      </button>
      <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[var(--color-primary)] border border-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-colors">
        Back to Home
      </button>
    </div>
  </motion.div>
);

export default ConfirmStep;
