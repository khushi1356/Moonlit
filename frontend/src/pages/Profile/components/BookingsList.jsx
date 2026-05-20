import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Star } from 'lucide-react';
import { FadeUp } from '../../../components/animations';

const statusStyle = (status) => {
  if (status === 'confirmed') return 'border-[var(--color-primary)] text-[var(--color-primary)] bg-blue-50';
  if (status === 'completed') return 'border-green-600 text-green-600 bg-green-50';
  if (status === 'cancelled') return 'border-red-500 text-red-500 bg-red-50';
  return 'border-gray-300 text-gray-500 bg-gray-50';
};

const statusBar = (status) => {
  if (status === 'confirmed') return 'bg-[var(--color-primary)]';
  if (status === 'completed') return 'bg-green-600';
  if (status === 'cancelled') return 'bg-red-500';
  return 'bg-gray-300';
};

const BookingsList = ({ bookings, onCancel, onReview, navigate }) => (
  <div className="lg:col-span-2">
    <FadeUp><h2 className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6">Appointment History</h2></FadeUp>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {bookings.length > 0 ? bookings.map((booking) => (
        <motion.div
          key={booking._id || booking.id}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white p-5 border border-gray-100 rounded-xl relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${statusBar(booking.status)}`} />
          <div>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-serif text-base uppercase text-[var(--color-primary)]">Appointment</h3>
                <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mt-0.5">#{(booking._id || booking.id)?.slice(-8)}</p>
              </div>
              <span className={`px-2.5 py-0.5 border rounded-full text-[10px] tracking-widest font-bold uppercase ${statusStyle(booking.status)}`}>{booking.status}</span>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex items-center border-b border-gray-50 pb-2">
                <CalendarIcon className="w-3.5 h-3.5 mr-3 text-[var(--color-primary)]" />
                <span className="uppercase tracking-widest text-[11px] font-bold text-gray-700">{new Date(booking.bookingDate).toDateString()}</span>
              </div>
              {booking.timeSlot && (
                <div className="flex items-center border-b border-gray-50 pb-2">
                  <Clock className="w-3.5 h-3.5 mr-3 text-[var(--color-primary)]/60" />
                  <span className="uppercase tracking-widest text-[11px] font-bold text-gray-700">{booking.timeSlot}</span>
                </div>
              )}
              <div className="flex items-center">
                <User className="w-3.5 h-3.5 mr-3 text-gray-400" />
                <span className="uppercase tracking-widest text-[11px] font-bold text-gray-500">{booking.stylistId?.userId?.name || booking.stylistId?.name || 'Assigned Artist'}</span>
              </div>
            </div>
          </div>
          <div>
            {(booking.status === 'pending' || booking.status === 'confirmed') ? (
              <button onClick={() => onCancel(booking._id || booking.id)} className="w-full py-3 text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-lg">Cancel Booking</button>
            ) : booking.status === 'completed' ? (
              <button onClick={() => onReview(booking)} className="w-full py-3 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all flex items-center justify-center gap-2 rounded-lg shadow-sm">
                <Star className="w-3.5 h-3.5" /> Leave Review
              </button>
            ) : (
              <button onClick={() => navigate('/booking')} className="w-full py-3 text-[10px] font-bold uppercase tracking-widest border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all rounded-lg">Book Again</button>
            )}
          </div>
        </motion.div>
      )) : (
        <div className="col-span-full text-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm">
          <h3 className="text-lg font-serif text-gray-400 mb-6 tracking-widest">No appointments on record.</h3>
          <button onClick={() => navigate('/booking')} className="px-7 py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-[var(--color-primary)]/90 transition-all rounded-lg">Book Appointment</button>
        </div>
      )}
    </div>
  </div>
);

export default BookingsList;
