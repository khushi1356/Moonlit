import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, MapPin, Phone, Mail, Sparkles, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { getCategories, getServices } from '../api/servicesApi';
import { getStylists } from '../api/stylistApi';
import { getGallery } from '../api/galleryApi';
import { submitContact } from '../api/contactApi';
import { FadeUp, RevealText } from '../components/Animations';

import heroImage from '../assets/herosalon.avif';

const MARQUEE_ITEMS = [
  'NAILS', 'AESTHETICS', 'HAIR', 'SKIN'
];

const Marquee = () => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full overflow-hidden bg-[var(--color-primary)] py-6 border-t border-[var(--color-primary)]/10">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: [0, -50 + '%'] }}
        transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        style={{ width: 'max-content' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-white font-serif italic uppercase flex items-center"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.02em' }}
          >
            <span className="text-white not-italic mx-6 md:mx-10" style={{ fontSize: '0.5em', transform: 'translateY(-2px)' }}>•</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const prevImage = () => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + gallery.length) % gallery.length }));
  const nextImage = () => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % gallery.length }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, styRes, galRes, servRes] = await Promise.all([
          getCategories().catch(() => ({ data: [] })),
          getStylists().catch(() => ({ data: [] })),
          getGallery().catch(() => ({ data: [] })),
          getServices().catch(() => ({ data: [] }))
        ]);
        setCategories((catRes.data || catRes || []).slice(0, 5));
        setServices((servRes.data || servRes || []).slice(0, 4));
        setStylists((styRes.data || styRes || []).slice(0, 4));
        setGallery(galRes.data || galRes || []);
      } catch (error) {
        console.error("Data fetch error", error);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(formData);
      toast.success("Message sent successfully.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[var(--color-secondary)] text-[var(--color-text-dark)] overflow-hidden font-sans">

      {/* ================= HERO SECTION — Graceful & Animative ================= */}
      <section className="relative w-full overflow-hidden bg-white flex items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
        
        {/* Background Decorative Elements */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#3AA89B]/5 blur-3xl" 
        />

        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Content (Text) */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              

              <h1 className="font-['Syne'] text-[var(--color-primary)] leading-[1.05] tracking-tighter mb-8 flex flex-col">
                <RevealText 
                  text="Unveil Your" 
                  delay={0.1} 
                  className="text-[clamp(3rem,6vw,5.5rem)] font-bold block" 
                />
                <RevealText 
                  text="Radiant Grace" 
                  delay={0.3} 
                  className="text-[clamp(3.5rem,7vw,6.5rem)] font-light block" 
                />
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-gray-500 font-light text-base md:text-lg max-w-lg mb-12 leading-relaxed"
              >
                Step into a world where luxury meets artistry. Our expert stylists curate personalized experiences to enhance your natural beauty and elevate your spirit.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap items-center gap-6"
              >
                <Link
                  to="/booking"
                  className="group relative overflow-hidden bg-[var(--color-primary)] text-white px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-primary)]/20"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Book Appointment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-[#3AA89B] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                </Link>

                <Link
                  to="/services"
                  className="group flex items-center gap-3 text-[var(--color-primary)] px-6 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#3AA89B]"
                >
                  Explore Services
                  <div className="w-8 h-px bg-[var(--color-primary)] transition-all duration-300 group-hover:w-12 group-hover:bg-[#3AA89B]" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content (Image & Floating Elements) */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[75vh] w-full mt-10 lg:mt-0 mb-10 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute inset-0 rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl"
            >
              <img
                src={heroImage} 
                alt="Salon Experience"
                className="w-full h-full object-cover transition-transform duration-[15s] hover:scale-110"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 to-transparent" />
            </motion.div>

            {/* Floating Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 -left-4 md:bottom-12 md:-left-16 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 max-w-[220px]"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#3AA89B]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#3AA89B]" />
                </div>
                <div>
                  <p className="text-[var(--color-primary)] font-bold text-xl">5.0</p>
                  <div className="flex text-[#3AA89B] text-xs">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                Trusted by hundreds for flawless aesthetics & care.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <Marquee />

      {/* ================= PHILOSOPHY ================= */}
      <section className="w-full bg-[var(--color-accent)] py-20 md:py-28 px-6 md:px-12 text-center">
        <FadeUp className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-[var(--color-primary)] leading-snug">
            "A sanctuary dedicated to the <span className="italic">craft of perfect styling</span> and unparalleled client care."
          </h2>
          <div className="mt-10">
            <Link to="/about" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold border-b border-[var(--color-primary)] pb-1 hover:pr-4 transition-all duration-300">
              Discover Our Story
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ================= OUR SERVICES (Dynamic) ================= */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          
          <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
            <FadeUp><span className="text-xs tracking-[0.2em] uppercase font-bold text-gray-400 mb-4 block">Curated Treatments</span></FadeUp>
            <RevealText as="h2" text="Our Services" className="text-5xl md:text-7xl font-serif text-[var(--color-primary)] uppercase tracking-tighter justify-center" />
          </div>

          {/* Categories as Organic Blobs */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-20 md:mb-32">
            {categories.map((category, i) => {
              const shapes = [
                '60% 40% 30% 70% / 60% 30% 70% 40%',
                '30% 70% 70% 30% / 30% 30% 70% 70%',
                '50% 50% 20% 80% / 25% 80% 20% 75%',
                '40% 60% 60% 40% / 60% 30% 70% 40%',
                '70% 30% 50% 50% / 30% 50% 50% 70%'
              ];
              return (
                <FadeUp key={category._id || category.id} delay={i * 0.1} className="w-[45%] sm:w-[30%] md:w-[15%] flex flex-col items-center group">
                  <Link to="/services" className="flex flex-col items-center w-full">
                    <div 
                      className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 overflow-hidden mb-5 border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-500 shadow-lg group-hover:shadow-xl"
                      style={{ borderRadius: shapes[i % shapes.length] }}
                    >
                      <img 
                        src={category.imageUrl || category.image || "https://images.unsplash.com/photo-1560066984-138daaa5de74?w=400&q=80"} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-xs md:text-sm tracking-widest uppercase font-bold text-[var(--color-primary)] text-center group-hover:text-[#3AA89B] transition-colors">{category.name}</span>
                  </Link>
                </FadeUp>
              );
            })}
          </div>

          {/* Small Service Cards Slice */}
          <div className="flex flex-col items-center mb-16 text-center">
            <FadeUp><span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-gray-400 mb-3 block">Customer Favorites</span></FadeUp>
            <RevealText as="h3" text="Featured Experiences" className="text-3xl md:text-5xl font-serif text-[var(--color-primary)] uppercase tracking-tighter justify-center" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
            {services.map((service, i) => (
              <FadeUp key={service._id || service.id} delay={i * 0.1}>
                <Link to={`/booking?service=${service._id}`} className="group block cursor-pointer bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2">
                  <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    <img 
                      src={service.image || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-95 group-hover:opacity-100"
                    />
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

      {/* ================= THE ARTISTS (Dynamic) ================= */}
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
                    src={stylist.userId?.profilePic || "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"} 
                    alt={stylist.userId?.name} 
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

      {/* ================= THE GALLERY ================= */}
      <section id="gallery" className="w-full bg-[var(--color-secondary)] py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16">
            <div className="flex flex-col items-start">
              <FadeUp><span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-[var(--color-primary)]/40 mb-3 block">Visual Archive</span></FadeUp>
              <RevealText as="h2" text="The Lookbook" className="text-3xl md:text-5xl font-serif text-[var(--color-primary)] uppercase tracking-tighter" />
            </div>
            <FadeUp delay={0.2}>
              <p className="text-gray-400 text-xs font-light italic mt-4 md:mt-0">Click any image to explore full size</p>
            </FadeUp>
          </div>

          {gallery.length === 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
              {[280, 200, 350, 220, 300, 180, 400, 250].map((h, i) => (
                <div key={i} className="break-inside-avoid mb-3 bg-gray-200 animate-pulse rounded-sm" style={{ height: `${h}px` }} />
              ))}
            </div>
          ) : (() => {
            /* Predefined height pattern so every image is a different size */
            const heights = [300, 200, 380, 220, 280, 340, 190, 360, 240, 310, 180, 420, 260, 200, 320, 280];
            /* Each image gets its own dramatic fall direction + rotation */
            const fallAnims = [
              { y: -180, rotate: -6, x: 0 },
              { y: -120, rotate: 4, x: 0 },
              { y: -200, rotate: -3, x: 0 },
              { y: -150, rotate: 7, x: 0 },
              { y: -160, rotate: -5, x: 0 },
              { y: -220, rotate: 3, x: 0 },
              { y: -140, rotate: -8, x: 0 },
              { y: -180, rotate: 5, x: 0 },
            ];
            return (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
                {gallery.map((img, i) => {
                  const fall = fallAnims[i % fallAnims.length];
                  const h = heights[i % heights.length];
                  return (
                    <motion.div
                      key={img._id || img.id || i}
                      className="break-inside-avoid mb-3 md:mb-4 group relative overflow-hidden cursor-pointer shadow-md"
                      style={{ height: `${h}px` }}
                      initial={{ opacity: 0, y: fall.y, rotate: fall.rotate }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: false, amount: 0.1, margin: '50px' }}
                      transition={{ type: 'spring', stiffness: 60, damping: 14, delay: (i % 4) * 0.12 }}
                      whileHover={{ scale: 1.02, rotate: fall.rotate * 0.3, transition: { duration: 0.4 } }}
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={img.imageUrl || img.image}
                        alt={img.title || `Look ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{ background: 'linear-gradient(to top, rgba(17,30,54,0.80) 0%, transparent 65%)' }}>
                        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400 flex items-center justify-between">
                          {img.title && (
                            <p className="text-white text-[9px] md:text-[10px] tracking-widest uppercase font-bold">{img.title}</p>
                          )}
                          <div className="ml-auto flex items-center gap-1 text-white/70">
                            <span className="text-[8px] tracking-widest uppercase">Open</span>
                            <ArrowRight size={9} />
                          </div>
                        </div>
                      </div>
                      <span className="absolute top-2 left-2 text-[9px] font-bold text-white/0 group-hover:text-white/50 transition-all duration-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>



      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {lightbox.open && gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <X size={22} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-5 text-white/40 text-xs tracking-widest font-bold z-10">
              {String(lightbox.index + 1).padStart(2,'0')} / {String(gallery.length).padStart(2,'0')}
            </div>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={gallery[lightbox.index]?.imageUrl || gallery[lightbox.index]?.image}
                alt={gallery[lightbox.index]?.title || 'Gallery'}
                className="max-w-full max-h-[78vh] object-contain rounded-sm shadow-2xl"
              />
              {gallery[lightbox.index]?.title && (
                <p className="text-white/60 text-xs tracking-widest uppercase font-bold mt-4">{gallery[lightbox.index].title}</p>
              )}
            </motion.div>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="w-full bg-[var(--color-accent)] py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">

          {/* Heading */}
          <div className="mb-20 flex flex-col items-start">
            <FadeUp><span className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-400 block mb-4">Get In Touch</span></FadeUp>
            <RevealText as="h2" text="Connect With Us" className="font-serif text-[var(--color-primary)] uppercase tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* LEFT — Form */}
            <FadeUp>
              <form onSubmit={handleContactSubmit} className="bg-white rounded-3xl p-10 md:p-14 shadow-sm space-y-8">
                <h3 className="font-serif text-2xl text-[var(--color-primary)] mb-2">Send an Inquiry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Your Name</label>
                    <input
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Full Name"
                      className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Email Address</label>
                    <input
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Subject</label>
                  <input
                    type="text" required value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Appointment Request"
                    className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Message</label>
                  <textarea
                    required rows="4" value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help..."
                    className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className={`w-full py-4 bg-[var(--color-primary)] text-white font-bold tracking-[0.2em] uppercase text-xs rounded-xl hover:bg-[#3AA89B] transition-all duration-500 flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-[#3AA89B]/20 ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </FadeUp>

            {/* RIGHT — Info + Map */}
            <FadeUp delay={0.2} className="flex flex-col gap-8">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <MapPin className="w-5 h-5" />, label: 'Location', val: '123 Serenity Ave\nBeverly Hills, CA' },
                  { icon: <Phone className="w-5 h-5" />, label: 'Phone', val: '+1 (555) 123-4567\nMon–Sat: 9AM–8PM' },
                  { icon: <Mail className="w-5 h-5" />, label: 'Email', val: 'hello@moonlit.studio\nbookings@moonlit.studio' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow duration-300">
                    <div className="w-10 h-10 rounded-full bg-[#3AA89B]/10 flex items-center justify-center text-[#3AA89B]">
                      {item.icon}
                    </div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">{item.label}</p>
                    <p className="text-[var(--color-primary)] font-light text-sm leading-relaxed whitespace-pre-line">{item.val}</p>
                  </div>
                ))}
              </div>

              {/* Colorful Map — NO grayscale */}
              <div className="flex-1 rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: '300px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.341490226344!2d-118.403487384784!3d34.08636498059632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Moonlit Studios Location"
                />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>



      <section className="w-full bg-white pb-0 pt-12">
        <div className="w-full bg-[var(--color-primary)] rounded-t-[3rem] text-center pt-24 pb-20 overflow-hidden relative flex flex-col items-center">
          <FadeUp>
            <h2
              className="font-serif text-white uppercase tracking-tighter leading-[0.9] z-10 relative"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}
            >
              Ready to<br />
              <span className="italic font-light text-[#3AA89B]">Transform?</span>
            </h2>
            <p className="mt-6 text-white/60 font-light text-lg max-w-md mx-auto z-10 relative">
              Book your next appointment and step into a world of premium beauty.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center z-10 relative">
              <Link
                to="/booking"
                className="inline-flex items-center gap-3 bg-white text-[var(--color-primary)] px-8 py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#3AA89B] hover:text-white hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-500 hover:border-white hover:bg-white/10 hover:-translate-y-0.5 group"
              >
                Explore Services
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>


    </div>
  );
};

export default Home;
