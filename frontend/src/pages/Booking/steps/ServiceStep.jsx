import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FadeUp, RevealText } from '../../../components/animations';

const ServiceStep = ({ services, selectedService, onSelect }) => (
  <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="text-center mb-10 flex flex-col items-center">
      <FadeUp><h2 className="text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-[var(--color-primary)]/50 mb-2">01 / Service</h2></FadeUp>
      <RevealText text="Select your treatment protocol" className="text-xl md:text-2xl font-serif text-[var(--color-primary)] justify-center" />
    </div>
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
      {services.length > 0 ? services.map(service => {
        const isSelected = selectedService && selectedService._id === service._id;
        return (
          <div key={service._id} onClick={() => onSelect(service)} className={`group cursor-pointer p-4 md:p-6 flex flex-col items-center transition-all duration-500 rounded-2xl border ${isSelected ? 'border-[var(--color-primary)] bg-gray-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1'}`}>
            <div className={`w-full aspect-square overflow-hidden mb-5 rounded-xl transition-all duration-500 ${isSelected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
              <img src={service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop'} alt={service.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <h3 className={`text-xs md:text-[15px] tracking-[0.1em] uppercase text-center mb-2 font-medium ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-800'}`} style={{ fontFamily: "'Outfit','Inter',sans-serif" }}>{service.name}</h3>
            <div className="h-[1px] w-6 md:w-8 bg-[var(--color-primary)] mb-3 opacity-20" />
            <span className="text-[9px] md:text-[11px] tracking-[0.2em] text-gray-400 uppercase text-center font-bold mb-5">{service.duration} MIN</span>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-auto w-full justify-between px-2">
              <span className={`text-sm md:text-base font-medium tracking-widest ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>₹{service.price}</span>
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-gray-200 text-transparent group-hover:border-[var(--color-primary)]'}`}>
                <Check className="w-3 h-3" />
              </div>
            </div>
          </div>
        );
      }) : <p className="text-center text-gray-400 tracking-widest text-xs uppercase font-light col-span-full">Loading protocols...</p>}
    </div>
  </motion.div>
);

export default ServiceStep;
