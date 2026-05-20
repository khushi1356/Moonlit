import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StylistStep = ({ stylists, selectedStylist, onSelect }) => (
  <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="text-center mb-10">
      <h2 className="text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-[var(--color-primary)]/50 mb-2">02 / Stylist</h2>
      <p className="text-xl md:text-2xl font-serif text-[var(--color-primary)]">Choose your artist</p>
    </div>
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
      {stylists.length > 0 ? stylists.map(stylist => {
        const isSelected = selectedStylist && selectedStylist._id === stylist._id;
        return (
          <div key={stylist._id} onClick={() => onSelect(stylist)} className={`group cursor-pointer p-4 md:p-6 flex flex-col items-center transition-all duration-500 rounded-2xl border ${isSelected ? 'border-[var(--color-primary)] bg-gray-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1'}`}>
            <div className={`w-full aspect-square overflow-hidden mb-5 rounded-xl transition-all duration-500 ${isSelected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
              <img src={stylist.userId?.profilePic || `https://ui-avatars.com/api/?name=${stylist.userId?.name || 'Stylist'}&background=F3F4F6&color=000`} alt="Stylist" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <h3 className={`text-xs md:text-[15px] tracking-[0.1em] uppercase text-center mb-2 font-medium ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-800'}`} style={{ fontFamily: "'Outfit','Inter',sans-serif" }}>
              {stylist.userId?.name || 'Stylist'}
            </h3>
            <div className="h-[1px] w-6 md:w-8 bg-[var(--color-primary)] mb-3 opacity-20" />
            <span className="text-[9px] md:text-[11px] tracking-[0.2em] text-gray-400 uppercase text-center font-bold">{stylist.specialty || 'Master'}</span>
          </div>
        );
      }) : <p className="text-center text-gray-400 tracking-widest text-xs uppercase font-light col-span-full">Loading artists...</p>}
    </div>
  </motion.div>
);

export default StylistStep;
