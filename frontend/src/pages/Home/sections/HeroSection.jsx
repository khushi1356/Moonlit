import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RevealText } from '../../../components/animations';
import heroImage from '../../../assets/herosalon.avif';

const HeroSection = () => (
  <section className="relative w-full overflow-hidden bg-white flex items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#3AA89B]/5 blur-3xl" />

    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
      <div className="lg:col-span-7 flex flex-col justify-center pt-10 lg:pt-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="font-['Syne'] text-[var(--color-primary)] leading-[1.05] tracking-tighter mb-8 flex flex-col">
            <RevealText text="Unveil Your" delay={0.1} className="text-[clamp(3rem,6vw,5.5rem)] font-bold block" />
            <RevealText text="Radiant Grace" delay={0.3} className="text-[clamp(3.5rem,7vw,6.5rem)] font-light block" />
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-gray-500 font-light text-base md:text-lg max-w-lg mb-12 leading-relaxed">
            Step into a world where luxury meets artistry. Our expert stylists curate personalized experiences to enhance your natural beauty and elevate your spirit.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-wrap items-center gap-6">
            <Link to="/booking" className="group relative overflow-hidden bg-[var(--color-primary)] text-white px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-primary)]/20">
              <span className="relative z-10 flex items-center gap-3">Book Appointment<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
              <div className="absolute inset-0 bg-[#3AA89B] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
            <Link to="/services" className="group flex items-center gap-3 text-[var(--color-primary)] px-6 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#3AA89B]">
              Explore Services
              <div className="w-8 h-px bg-[var(--color-primary)] transition-all duration-300 group-hover:w-12 group-hover:bg-[#3AA89B]" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="lg:col-span-5 relative h-[50vh] lg:h-[75vh] w-full mt-10 lg:mt-0 mb-10 lg:mb-0">
        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="absolute inset-0 rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl">
          <img src={heroImage} alt="Salon Experience" fetchpriority="high" loading="eager" decoding="async" width="800" height="1067" className="w-full h-full object-cover transition-transform duration-[15s] hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 to-transparent" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="absolute -bottom-6 -left-4 md:bottom-12 md:-left-16 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 max-w-[220px]">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#3AA89B]/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-[#3AA89B]" /></div>
            <div><p className="text-[var(--color-primary)] font-bold text-xl">5.0</p><div className="flex text-[#3AA89B] text-xs">★★★★★</div></div>
          </div>
          <p className="text-gray-500 text-[11px] font-medium leading-relaxed">Trusted by hundreds for flawless aesthetics & care.</p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
