import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BOOKING_STEPS } from '../../../constants';

const BookingStepIndicator = ({ currentStep }) => (
  <div className="flex justify-between items-start mb-10 relative px-4 max-w-[700px] mx-auto">
    <div className="absolute top-[5px] left-[10%] right-[10%] h-[1px] bg-gray-200 -z-10">
      <motion.div
        className="h-full bg-[var(--color-primary)] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: (currentStep - 1) / (BOOKING_STEPS.length - 1) }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
    {BOOKING_STEPS.map((step) => {
      const isActive = currentStep === step.id;
      const isCompleted = currentStep > step.id;
      return (
        <div key={step.id} className="flex flex-col items-center bg-[var(--color-bg-light)] px-2 z-10">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 bg-[var(--color-bg-light)] border ${
            isActive ? 'border-[var(--color-primary)] bg-white scale-150 ring-4 ring-gray-100' :
            isCompleted ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-gray-300'
          }`}>
            {isCompleted && <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />}
          </div>
          <span className={`mt-5 text-[9px] md:text-[10px] tracking-[0.25em] font-bold uppercase transition-colors ${
            isActive ? 'text-[var(--color-primary)]' : isCompleted ? 'text-[var(--color-primary)]/70' : 'text-gray-400'
          }`}>
            {step.name}
          </span>
        </div>
      );
    })}
  </div>
);

export default BookingStepIndicator;
