import { motion } from 'framer-motion';

const PaymentStep = ({
  selectedService, selectedStylist, selectedDate, selectedTimeSlot,
  couponCode, setCouponCode, discount, finalAmount, onApplyCoupon,
}) => (
  <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <div className="text-center mb-10">
      <h2 className="text-sm tracking-[0.2em] uppercase font-light text-gray-500 mb-2">04 / Checkout</h2>
      <p className="text-xl font-serif">Finalize your reservation</p>
    </div>
    <div className="max-w-2xl mx-auto border border-gray-100 p-8 md:p-12 bg-gray-50/30">
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

      <div>
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 p-3 bg-transparent border-b border-gray-300 font-bold tracking-[0.2em] uppercase focus:border-[var(--color-primary)] outline-none text-xs transition-colors"
            placeholder="PROMO CODE"
          />
          <button onClick={onApplyCoupon} className="px-6 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[var(--color-primary)] hover:text-white transition-all">
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
);

export default PaymentStep;
