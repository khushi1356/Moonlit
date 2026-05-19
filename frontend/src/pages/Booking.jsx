import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar as CalendarIcon, Clock, ArrowRight, X } from 'lucide-react';
import { getServices } from '../api/servicesApi';
import { getStylists } from '../api/stylistApi';
import { createBooking } from '../api/bookingApi';
import { createOrder, verifyPayment } from '../api/paymentApi';
import { applyCoupon } from '../api/couponApi';
import { useRazorpay } from 'react-razorpay';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FadeUp, RevealText } from '../components/Animations';

const steps = [
  { id: 1, name: 'Service' },
  { id: 2, name: 'Stylist' },
  { id: 3, name: 'Schedule' },
  { id: 4, name: 'Payment' },
  { id: 5, name: 'Confirm' },
];

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { Razorpay } = useRazorpay();
  const location = useLocation();
  
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicesRes, stylistsRes] = await Promise.all([
          getServices().catch(() => ({ data: [] })),
          getStylists().catch(() => ({ data: [] }))
        ]);
        const srvs = servicesRes.data || servicesRes || [];
        const stys = stylistsRes.data || stylistsRes || [];
        setServices(srvs);
        setStylists(stys);

        const params = new URLSearchParams(location.search);
        const urlStylist = params.get('stylist');
        const urlService = params.get('service');

        if (urlStylist) {
          const found = stys.find(s => s._id === urlStylist || s.id === urlStylist);
          if (found) setSelectedStylist(found);
        }

        if (urlService) {
          const found = srvs.find(s => s._id === urlService || s.id === urlService);
          if (found) {
            setSelectedService(found);
            setCurrentStep(2); // Jump directly to Stylist step since Service is selected
          }
        }
      } catch (error) {}
    };
    fetchInitialData();
  }, [location.search]);

  useEffect(() => {
    if (selectedService) setFinalAmount(selectedService.price - discount);
  }, [selectedService, discount]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    if (!selectedService) {
      toast.error("Please select a service first.");
      return;
    }
    try {
      const res = await applyCoupon(couponCode, selectedService.price);
      setDiscount(res.discountAmount || 0);
      toast.success("Coupon applied.");
    } catch (error) {
      setDiscount(0);
      toast.error(error.response?.data?.message || "Invalid code");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderRes = await createOrder(finalAmount);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "MOONLIT.",
        description: `Booking for ${selectedService.name}`,
        order_id: orderRes.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            await submitBooking(response.razorpay_payment_id, 'paid');
          } catch (err) {
            toast.error("Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user'))?.name || '',
          email: JSON.parse(localStorage.getItem('user'))?.email || '',
        },
        theme: { color: "#06101E" }
      };

      const rzpay = new Razorpay(options);
      rzpay.on('payment.failed', function () {
        toast.error("Payment failed.");
        setLoading(false);
      });
      rzpay.open();
    } catch (error) {
      if(error.response?.status === 401) {
        toast.error("Please login to proceed.");
        window.location.href = '/login';
      } else {
        toast.error("Failed to initiate payment");
        setLoading(false);
      }
    }
  };

  const submitBooking = async (paymentId = null, paymentStatus = 'unpaid') => {
    if (!selectedService || !selectedStylist) {
      toast.error("Booking data is incomplete.");
      return;
    }

    try {
      await createBooking({
        serviceIds: [selectedService._id],
        stylistId: selectedStylist.userId?._id || selectedStylist.userId,
        bookingDate: selectedDate,
        timeSlot: selectedTimeSlot,
        totalAmount: finalAmount,
        status: 'pending',
        paymentStatus,
        paymentId
      });
      setCurrentStep(5);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedService) return toast.error("Select a service.");
    if (currentStep === 2 && !selectedStylist) return toast.error("Select an artist.");
    if (currentStep === 3 && (!selectedDate || !selectedTimeSlot)) return toast.error("Select schedule.");
    if (currentStep === 4) { handlePayment(); return; }
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-32 pb-10 bg-[var(--color-bg-light)] text-[var(--color-primary)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">

        {/* Custom Premium Stepper */}
        <div className="flex justify-between items-start mb-10 relative px-4 max-w-[700px] mx-auto">
          <div className="absolute top-[5px] left-[10%] right-[10%] h-[1px] bg-gray-200 -z-10">
            <motion.div 
              className="h-full bg-[var(--color-primary)] origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center bg-[var(--color-bg-light)] px-2 z-10">
                <div 
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 bg-[var(--color-bg-light)] border ${
                    isActive ? 'border-[var(--color-primary)] bg-white scale-150 ring-4 ring-gray-100' : 
                    isCompleted ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 
                    'border-gray-300'
                  }`}
                >
                  {isCompleted && <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />}
                </div>
                <span className={`mt-5 text-[9px] md:text-[10px] tracking-[0.25em] font-bold uppercase transition-colors ${
                  isActive ? 'text-[var(--color-primary)]' : 
                  isCompleted ? 'text-[var(--color-primary)]/70' : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SERVICE */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="text-center mb-10 flex flex-col items-center">
                  <FadeUp><h2 className="text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-[var(--color-primary)]/50 mb-2">01 / Service</h2></FadeUp>
                  <RevealText text="Select your treatment protocol" className="text-xl md:text-2xl font-serif text-[var(--color-primary)] justify-center" />
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {services.length > 0 ? services.map(service => {
                    // Safe ID check to prevent multiple selection bug
                    const isSelected = selectedService && selectedService._id === service._id;
                    return (
                      <div 
                        key={service._id} 
                        onClick={() => setSelectedService(service)}
                        className={`group cursor-pointer p-4 md:p-6 flex flex-col items-center transition-all duration-500 rounded-2xl border ${
                          isSelected ? 'border-[var(--color-primary)] bg-gray-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1'
                        }`}
                      >
                        <div className={`w-full aspect-square overflow-hidden mb-5 rounded-xl transition-all duration-500 ${isSelected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
                          <img 
                            src={service.image || `https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop`} 
                            alt={service.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        </div>
                        <h3 
                          className={`text-xs md:text-[15px] tracking-[0.1em] uppercase text-center mb-2 font-medium ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-800'}`}
                          style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                        >
                          {service.name}
                        </h3>
                        <div className="h-[1px] w-6 md:w-8 bg-[var(--color-primary)] mb-3 opacity-20"></div>
                        <span className="text-[9px] md:text-[11px] tracking-[0.2em] text-gray-400 uppercase text-center font-bold mb-5">
                          {service.duration} MIN
                        </span>
                        
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-auto w-full justify-between px-2">
                          <span className={`text-sm md:text-base font-medium tracking-widest ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>
                            ₹{service.price}
                          </span>
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                            isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-gray-200 text-transparent group-hover:border-[var(--color-primary)]'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    )
                  }) : <p className="text-center text-gray-400 tracking-widest text-xs uppercase font-light col-span-full">Loading protocols...</p>}
                </div>
              </motion.div>
            )}

            {/* STEP 2: STYLIST */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-[var(--color-primary)]/50 mb-2">02 / Stylist</h2>
                  <p className="text-xl md:text-2xl font-serif text-[var(--color-primary)]">Choose your artist</p>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {stylists.length > 0 ? stylists.map(stylist => {
                    const isSelected = selectedStylist && selectedStylist._id === stylist._id;
                    return (
                      <div 
                        key={stylist._id} 
                        onClick={() => setSelectedStylist(stylist)}
                        className={`group cursor-pointer p-4 md:p-6 flex flex-col items-center transition-all duration-500 rounded-2xl border ${
                          isSelected ? 'border-[var(--color-primary)] bg-gray-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1'
                        }`}
                      >
                        <div className={`w-full aspect-square overflow-hidden mb-5 rounded-xl transition-all duration-500 ${isSelected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
                          <img 
                            src={stylist.userId?.profilePic || `https://ui-avatars.com/api/?name=${stylist.userId?.name || 'Stylist'}&background=F3F4F6&color=000`} 
                            alt="Stylist" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        </div>
                        <h3 
                          className={`text-xs md:text-[15px] tracking-[0.1em] uppercase text-center mb-2 font-medium ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-800'}`}
                          style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                        >
                          {stylist.userId?.name || 'Stylist'}
                        </h3>
                        <div className="h-[1px] w-6 md:w-8 bg-[var(--color-primary)] mb-3 opacity-20"></div>
                        <span className="text-[9px] md:text-[11px] tracking-[0.2em] text-gray-400 uppercase text-center font-bold">
                          {stylist.specialty || 'Master'}
                        </span>
                      </div>
                    )
                  }) : <p className="text-center text-gray-400 tracking-widest text-xs uppercase font-light col-span-full">Loading artists...</p>}
                </div>
              </motion.div>
            )}

            {/* STEP 3: SCHEDULE */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="text-center mb-10">
                  <h2 className="text-sm tracking-[0.2em] uppercase font-light text-gray-500 mb-2">03 / Schedule</h2>
                  <p className="text-xl font-serif">Reserve your time</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Date Section */}
                  <div className="p-8 border border-gray-100 bg-gray-50/30">
                    <div className="flex items-center gap-3 mb-8">
                      <CalendarIcon className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="text-xs tracking-[0.2em] uppercase font-bold">Select Date</h3>
                    </div>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setSelectedTimeSlot(''); }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 bg-transparent border-b border-gray-300 text-lg font-light focus:border-[var(--color-primary)] outline-none rounded-none transition-colors"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>

                  {/* Time Section */}
                  <div className="p-8 border border-gray-100 bg-gray-50/30">
                    <div className="flex items-center gap-3 mb-8">
                      <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="text-xs tracking-[0.2em] uppercase font-bold">Available Slots</h3>
                    </div>
                    {selectedDate ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
                            <button 
                              key={time} 
                              onClick={() => setSelectedTimeSlot(time)}
                              className={`p-3 text-[10px] font-bold tracking-widest uppercase border transition-all duration-300 ${
                                selectedTimeSlot === time ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md' : 
                                'border-gray-200 text-gray-500 hover:border-gray-800 hover:text-gray-800 bg-white'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 border border-dashed border-gray-300">
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Select a date first</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PAYMENT */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="text-center mb-10">
                  <h2 className="text-sm tracking-[0.2em] uppercase font-light text-gray-500 mb-2">04 / Checkout</h2>
                  <p className="text-xl font-serif">Finalize your reservation</p>
                </div>
                
                <div className="max-w-2xl mx-auto border border-gray-100 p-8 md:p-12 bg-gray-50/30">
                  
                  {/* Summary Details */}
                  <div className="space-y-6 mb-10 pb-10 border-b border-gray-200">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">Service</p>
                        <p className="text-sm font-serif uppercase tracking-widest">{selectedService?.name}</p>
                      </div>
                      <p className="text-sm font-light tracking-widest">₹{selectedService?.price}</p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">Artist</p>
                        <p className="text-sm font-serif uppercase tracking-widest">{selectedStylist?.userId?.name}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">Date & Time</p>
                        <p className="text-sm font-serif uppercase tracking-widest">
                          {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <p className="text-sm font-light tracking-widest">{selectedTimeSlot}</p>
                    </div>
                  </div>

                  {/* Coupon & Total */}
                  <div>
                    <div className="flex flex-col sm:flex-row gap-3 mb-10">
                      <input 
                        type="text" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                        className="flex-1 p-3 bg-transparent border-b border-gray-300 font-bold tracking-[0.2em] uppercase focus:border-[var(--color-primary)] outline-none text-xs transition-colors" 
                        placeholder="PROMO CODE" 
                      />
                      <button 
                        onClick={handleApplyCoupon} 
                        className="px-6 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="space-y-4">
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-[#3AA89B]">
                          <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Discount</span>
                          <span className="font-light tracking-widest">-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-end pt-2">
                        <span className="font-bold tracking-[0.2em] uppercase text-xs">Total</span>
                        <span className="text-2xl font-light tracking-widest">₹{finalAmount}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 5: CONFIRM */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center mb-8 shadow-xl">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-sm tracking-[0.2em] uppercase font-light text-gray-500 mb-4">Reservation Complete</h2>
                <p className="text-3xl font-serif uppercase tracking-widest text-[var(--color-primary)] mb-10">
                  See you soon.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => window.location.href = '/profile'} className="px-8 py-4 border border-[var(--color-primary)] text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                  <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[var(--color-primary)] border border-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-colors">
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Global Navigation Footer */}
        {currentStep < 5 && (
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
            <button 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-[var(--color-primary)]'
              }`}
            >
              Back
            </button>
            
            <button 
              onClick={nextStep}
              disabled={loading}
              className="group relative px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-[var(--color-primary)] flex items-center gap-3 overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <span className="relative z-10">{loading ? 'Processing' : currentStep === 4 ? 'Confirm & Pay' : 'Next'}</span>
              {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-[#3AA89B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;
