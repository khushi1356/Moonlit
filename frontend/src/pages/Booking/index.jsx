import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import useBooking from '../../hooks/useBooking';
import BookingStepIndicator from './components/BookingStepIndicator';
import ServiceStep from './steps/ServiceStep';
import StylistStep from './steps/StylistStep';
import ScheduleStep from './steps/ScheduleStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmStep from './steps/ConfirmStep';

const Booking = React.memo(() => {
  const {
    currentStep, loading,
    services, stylists,
    selectedService, setSelectedService,
    selectedStylist, setSelectedStylist,
    selectedDate, setSelectedDate,
    selectedTimeSlot, setSelectedTimeSlot,
    couponCode, setCouponCode,
    discount, finalAmount,
    handleApplyCoupon, nextStep, prevStep,
  } = useBooking();

  return (
    <div className="min-h-screen pt-32 pb-10 bg-[var(--color-bg-light)] text-[var(--color-primary)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
      <SEO
        title="Book Appointment"
        description="Reserve your appointment at Moonlit Salon & Spa. Choose your service, select your stylist, and schedule a time that works for you."
      />
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
        <BookingStepIndicator currentStep={currentStep} />

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <ServiceStep services={services} selectedService={selectedService} onSelect={setSelectedService} />}
            {currentStep === 2 && <StylistStep stylists={stylists} selectedStylist={selectedStylist} onSelect={setSelectedStylist} />}
            {currentStep === 3 && (
              <ScheduleStep
                selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot} setSelectedTimeSlot={setSelectedTimeSlot}
              />
            )}
            {currentStep === 4 && (
              <PaymentStep
                selectedService={selectedService} selectedStylist={selectedStylist}
                selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot}
                couponCode={couponCode} setCouponCode={setCouponCode}
                discount={discount} finalAmount={finalAmount}
                onApplyCoupon={handleApplyCoupon}
              />
            )}
            {currentStep === 5 && <ConfirmStep />}
          </AnimatePresence>
        </div>

        {currentStep < 5 && (
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
            <button onClick={prevStep} disabled={currentStep === 1} className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-[var(--color-primary)]'}`}>
              Back
            </button>
            <button onClick={nextStep} disabled={loading} className="group relative px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-[var(--color-primary)] flex items-center gap-3 overflow-hidden shadow-md hover:shadow-xl transition-all">
              <span className="relative z-10">{loading ? 'Processing' : currentStep === 4 ? 'Confirm & Pay' : 'Next'}</span>
              {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-[#3AA89B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default Booking;
