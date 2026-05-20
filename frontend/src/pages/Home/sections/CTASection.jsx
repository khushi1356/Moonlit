import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { FadeUp } from '../../../components/animations';

const CTASection = () => (
  <section className="w-full bg-white pb-0 pt-12">
    <div className="w-full bg-[var(--color-primary)] rounded-t-[3rem] text-center pt-24 pb-20 overflow-hidden relative flex flex-col items-center">
      <FadeUp>
        <h2 className="font-serif text-white uppercase tracking-tighter leading-[0.9] z-10 relative" style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}>
          Ready to<br />
          <span className="italic font-light text-[#3AA89B]">Transform?</span>
        </h2>
        <p className="mt-6 text-white/60 font-light text-lg max-w-md mx-auto z-10 relative">
          Book your next appointment and step into a world of premium beauty.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center z-10 relative">
          <Link to="/booking" className="inline-flex items-center gap-3 bg-white text-[var(--color-primary)] px-8 py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#3AA89B] hover:text-white hover:shadow-xl hover:-translate-y-0.5 group">
            <Calendar className="w-4 h-4" /> Book Appointment
          </Link>
          <Link to="/services" className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-500 hover:border-white hover:bg-white/10 hover:-translate-y-0.5 group">
            Explore Services <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </FadeUp>
    </div>
  </section>
);

export default CTASection;
