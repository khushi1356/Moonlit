import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeUp, RevealText } from '../../../components/animations';

const BLOB_SHAPES = [
  '60% 40% 30% 70% / 60% 30% 70% 40%',
  '30% 70% 70% 30% / 30% 30% 70% 70%',
  '50% 50% 20% 80% / 25% 80% 20% 75%',
  '40% 60% 60% 40% / 60% 30% 70% 40%',
  '70% 30% 50% 50% / 30% 50% 50% 70%',
];

const ServicesSection = ({ categories, services }) => (
  <section className="w-full bg-white py-16 md:py-24">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
        <FadeUp><span className="text-xs tracking-[0.2em] uppercase font-bold text-gray-400 mb-4 block">Curated Treatments</span></FadeUp>
        <RevealText as="h2" text="Our Services" className="text-5xl md:text-7xl font-serif text-[var(--color-primary)] uppercase tracking-tighter justify-center" />
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-20 md:mb-32">
        {categories.map((category, i) => (
          <FadeUp key={category._id || category.id} delay={i * 0.1} className="w-[45%] sm:w-[30%] md:w-[15%] flex flex-col items-center group">
            <Link to="/services" className="flex flex-col items-center w-full">
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 overflow-hidden mb-5 border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ borderRadius: BLOB_SHAPES[i % BLOB_SHAPES.length] }}>
                <img src={category.imageUrl || category.image || 'https://images.unsplash.com/photo-1560066984-138daaa5de74?w=400&q=80'} alt={category.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              </div>
              <span className="text-xs md:text-sm tracking-widest uppercase font-bold text-[var(--color-primary)] text-center group-hover:text-[#3AA89B] transition-colors">{category.name}</span>
            </Link>
          </FadeUp>
        ))}
      </div>

      <div className="flex flex-col items-center mb-16 text-center">
        <FadeUp><span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-gray-400 mb-3 block">Customer Favorites</span></FadeUp>
        <RevealText as="h3" text="Featured Experiences" className="text-3xl md:text-5xl font-serif text-[var(--color-primary)] uppercase tracking-tighter justify-center" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
        {services.map((service, i) => (
          <FadeUp key={service._id || service.id} delay={i * 0.1}>
            <Link to={`/booking?service=${service._id}`} className="group block cursor-pointer bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 relative">
                <img src={service.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'} alt={service.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-95 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="pt-5 pb-2 flex flex-col items-center text-center">
                <h4 className="text-sm md:text-base font-serif text-[var(--color-primary)] mb-2 truncate w-full group-hover:italic transition-all">{service.name}</h4>
                <span className="text-[10px] md:text-xs tracking-widest font-bold text-[var(--color-text-muted)]">INR {service.price}</span>
              </div>
            </Link>
          </FadeUp>
        ))}
        {services.length === 0 && <p className="col-span-full text-center text-gray-400 italic font-serif text-sm">Loading services...</p>}
      </div>

      <FadeUp delay={0.4} className="flex justify-center mt-4">
        <Link to="/services" className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-white text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold rounded-sm shadow-lg hover:shadow-xl hover:bg-[var(--color-primary)]/90 transition-all duration-300">
          View Full Menu <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </FadeUp>
    </div>
  </section>
);

export default ServicesSection;
