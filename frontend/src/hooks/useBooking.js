import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useRazorpay } from 'react-razorpay';
import toast from 'react-hot-toast';
import { getServices } from '../api/servicesApi';
import { getStylists } from '../api/stylistApi';
import { createBooking } from '../api/bookingApi';
import { createOrder, verifyPayment } from '../api/paymentApi';
import { applyCoupon } from '../api/couponApi';

const useBooking = () => {
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
          getStylists().catch(() => ({ data: [] })),
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
          if (found) { setSelectedService(found); setCurrentStep(2); }
        }
      } catch (error) {}
    };
    fetchInitialData();
  }, [location.search]);

  useEffect(() => {
    if (selectedService) setFinalAmount(selectedService.price - discount);
  }, [selectedService, discount]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode) return;
    if (!selectedService) { toast.error('Please select a service first.'); return; }
    try {
      const res = await applyCoupon(couponCode, selectedService.price);
      setDiscount(res.discountAmount || 0);
      toast.success('Coupon applied.');
    } catch (error) {
      setDiscount(0);
      toast.error(error.response?.data?.message || 'Invalid code');
    }
  }, [couponCode, selectedService]);

  const submitBooking = useCallback(async (paymentId = null, paymentStatus = 'unpaid') => {
    if (!selectedService || !selectedStylist) { toast.error('Booking data is incomplete.'); return; }
    try {
      await createBooking({
        serviceIds: [selectedService._id],
        stylistId: selectedStylist.userId?._id || selectedStylist.userId,
        bookingDate: selectedDate,
        timeSlot: selectedTimeSlot,
        totalAmount: finalAmount,
        status: 'pending',
        paymentStatus,
        paymentId,
      });
      setCurrentStep(5);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  }, [selectedService, selectedStylist, selectedDate, selectedTimeSlot, finalAmount]);

  const handlePayment = useCallback(async () => {
    setLoading(true);
    try {
      const orderRes = await createOrder(finalAmount);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'MOONLIT.',
        description: `Booking for ${selectedService.name}`,
        order_id: orderRes.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await submitBooking(response.razorpay_payment_id, 'paid');
          } catch (err) {
            toast.error('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user'))?.name || '',
          email: JSON.parse(localStorage.getItem('user'))?.email || '',
        },
        theme: { color: '#06101E' },
      };
      const rzpay = new Razorpay(options);
      rzpay.on('payment.failed', function () { toast.error('Payment failed.'); setLoading(false); });
      rzpay.open();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to proceed.');
        window.location.href = '/login';
      } else {
        toast.error('Failed to initiate payment');
        setLoading(false);
      }
    }
  }, [finalAmount, selectedService, Razorpay, submitBooking]);

  const nextStep = useCallback(() => {
    if (currentStep === 1 && !selectedService) return toast.error('Select a service.');
    if (currentStep === 2 && !selectedStylist) return toast.error('Select an artist.');
    if (currentStep === 3 && (!selectedDate || !selectedTimeSlot)) return toast.error('Select schedule.');
    if (currentStep === 4) { handlePayment(); return; }
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, selectedService, selectedStylist, selectedDate, selectedTimeSlot, handlePayment]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentStep, loading,
    services, stylists,
    selectedService, setSelectedService,
    selectedStylist, setSelectedStylist,
    selectedDate, setSelectedDate,
    selectedTimeSlot, setSelectedTimeSlot,
    couponCode, setCouponCode,
    discount, finalAmount,
    handleApplyCoupon, nextStep, prevStep,
  };
};

export default useBooking;
