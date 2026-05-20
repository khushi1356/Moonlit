import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { TIME_SLOTS } from '../../../constants';

const ScheduleStep = ({ selectedDate, setSelectedDate, selectedTimeSlot, setSelectedTimeSlot }) => (
  <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <div className="text-center mb-10">
      <h2 className="text-sm tracking-[0.2em] uppercase font-light text-gray-500 mb-2">03 / Schedule</h2>
      <p className="text-xl font-serif">Reserve your time</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
      <div className="p-8 border border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold">Available Slots</h3>
        </div>
        {selectedDate ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {TIME_SLOTS.map((time) => (
              <button key={time} onClick={() => setSelectedTimeSlot(time)} className={`p-3 text-[10px] font-bold tracking-widest uppercase border transition-all duration-300 ${selectedTimeSlot === time ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md' : 'border-gray-200 text-gray-500 hover:border-gray-800 hover:text-gray-800 bg-white'}`}>
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
);

export default ScheduleStep;
