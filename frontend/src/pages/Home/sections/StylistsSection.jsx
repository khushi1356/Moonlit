import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeUp, RevealText } from '../../../components/animations';

const StylistsSection = ({ stylists }) => (
  <section className="w-full bg-[var(--color-primary)] text-white py-16 md:py-24">
    <div className="max-w-[1600px] mx-auto px-4 md:px-12">
      <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
        <FadeUp><span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-gray-400 mb-3 block">The Experts</span></FadeUp>
        <RevealText as="h2" text="Master Stylists" className="text-3xl md:text-5xl font-serif uppercase tracking-tighter justify-center" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {stylists.map((stylist, i) => (
          <FadeUp key={stylist._id || stylist.id} delay={i * 0.1} className="flex flex-col items-center text-center group">
            <div className="w-full aspect-[4/3] overflow-hidden mb-4 bg-gray-800 rounded-lg">
              <img
                src={stylist.userId?.profilePic || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'}
                alt={stylist.userId?.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />
            </div>
            <h3 className="text-sm md:text-base font-serif mb-1 w-full truncate">{stylist.userId?.name || 'Stylist'}</h3>
            <p className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 w-full truncate">
              {(stylist.specialization && stylist.specialization.length > 0) ? stylist.specialization[0] : 'Hair Expert'}
            </p>
            <Link to={`/booking?stylist=${stylist._id}`} className="px-4 py-2 border border-white/20 text-[9px] md:text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-[var(--color-primary)] transition-colors mt-auto">
              Book <span className="hidden md:inline">Session</span>
            </Link>
          </FadeUp>
        ))}
        {stylists.length === 0 && <p className="col-span-full text-center text-gray-400 italic font-serif text-xs">Loading artists...</p>}
      </div>

      <FadeUp delay={0.4} className="flex justify-center mt-8 md:mt-12">
        <Link to="/stylists" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--color-primary)] text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold rounded-sm shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300">
          Meet All Experts <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </FadeUp>
    </div>
  </section>
);

export default StylistsSection;
