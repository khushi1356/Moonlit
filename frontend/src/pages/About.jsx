import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scissors, Heart, Award, Users, Sparkles, ArrowRight } from 'lucide-react';
import { FadeUp, RevealText } from '../components/Animations';
import about1 from '../assets/about1.avif';
import about2 from '../assets/about2.avif';

const values = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Crafted with Passion',
    desc: 'Every service is delivered with genuine care and love for the craft of beauty.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Unmatched Excellence',
    desc: 'We use only premium products and stay ahead of global beauty trends.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Client First, Always',
    desc: 'Your comfort, preferences, and satisfaction are at the heart of everything we do.',
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: 'Master Artisans',
    desc: 'Our team of certified experts brings years of training and artistry to each appointment.',
  },
];

const timeline = [
  { year: '2015', title: 'The Beginning', desc: 'Moonlit Studios opened its doors on Serenity Avenue with a small but passionate team of three stylists.' },
  { year: '2017', title: 'Growing Family', desc: 'Expanded to a full team of 10 specialists and introduced our signature spa treatments.' },
  { year: '2019', title: 'Award Winning', desc: 'Recognized as the "Best Salon & Spa" in the region by the Beauty Excellence Awards.' },
  { year: '2021', title: 'Digital Evolution', desc: 'Launched our online booking platform to make luxury beauty more accessible than ever.' },
  { year: '2024', title: 'A New Chapter', desc: 'Renovated our studio into a world-class sanctuary, setting a new standard in premium beauty.' },
];

const About = () => {
  return (
    <div className="w-full bg-[var(--color-secondary)] text-[var(--color-text-dark)] overflow-hidden font-sans">

      {/* ====== HERO ====== */}
      <section className="relative w-full min-h-[70vh] flex items-end overflow-hidden">
        <img
          src={about1}
          alt="About Moonlit"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,43,73,0.85) 0%, rgba(26,43,73,0.3) 60%, transparent 100%)' }} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-20 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-[#3AA89B] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Our Story
            </span>
            <div className="font-serif text-white uppercase tracking-tighter leading-[0.88] flex flex-col" style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)' }}>
              <RevealText text="The Soul Behind" delay={0.1} className="block" />
              <RevealText text="Moonlit Studios" delay={0.3} className="italic font-light text-[#3AA89B] block" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== PHILOSOPHY ====== */}
      <section className="w-full bg-white py-28 px-8 md:px-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col items-start">
            <FadeUp><span className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-400 block mb-6">Who We Are</span></FadeUp>
            <RevealText as="h2" text="A sanctuary where beauty is treated as an art form." className="font-serif text-[var(--color-primary)] leading-snug" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)' }} />
            <FadeUp>
              <p className="mt-6 text-gray-500 font-light text-lg leading-relaxed">
                At Moonlit Studios, we believe that beauty is not just about appearance — it's about how you feel. Since 2015, we have been crafting transformative experiences that blend expert technique with genuine warmth.
              </p>
              <p className="mt-4 text-gray-500 font-light text-lg leading-relaxed">
                Every visit to our studio is a moment to pause, be nurtured, and rediscover your most confident self. We are not just a salon — we are your personal sanctuary.
              </p>
              <Link
                to="/booking"
                className="mt-10 inline-flex items-center gap-3 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#3AA89B] hover:shadow-xl hover:shadow-[#3AA89B]/30 hover:-translate-y-0.5 group"
              >
                Book Your Experience
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          </div>

          <FadeUp delay={0.2} direction="left">
            <div className="relative">
              <img
                src={about2}
                alt="Salon interior"
                className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl"
              />
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="absolute -bottom-8 -left-8 bg-[var(--color-primary)] text-white px-8 py-6 rounded-2xl shadow-2xl"
              >
                <p className="font-serif text-4xl font-bold">8+</p>
                <p className="text-[11px] tracking-widest uppercase text-white/70 mt-1">Years of Excellence</p>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ====== VALUES ====== */}
      <section className="w-full bg-[var(--color-accent)] py-28 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <FadeUp><span className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-400 block mb-4">What Drives Us</span></FadeUp>
            <RevealText as="h2" text="Our Core Values" className="font-serif text-[var(--color-primary)] uppercase tracking-tighter justify-center" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group h-full">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:bg-[#3AA89B] group-hover:text-white transition-all duration-500">
                    {v.icon}
                  </div>
                  <h3 className="font-serif text-xl text-[var(--color-primary)] mb-3">{v.title}</h3>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TIMELINE ====== */}
      <section className="w-full bg-[var(--color-primary)] py-28 px-8 md:px-16">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <FadeUp><span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#3AA89B] block mb-4">Our Journey</span></FadeUp>
            <RevealText as="h2" text="A Decade of Beauty" className="font-serif text-white uppercase tracking-tighter justify-center" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }} />
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="flex gap-8 items-start group">
                    <div className="shrink-0 w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#3AA89B] group-hover:border-[#3AA89B] transition-all duration-500 z-10">
                      <span className="font-serif text-white text-sm font-bold">{item.year.slice(2)}</span>
                    </div>
                    <div className="flex-1 pt-3">
                      <span className="text-[#3AA89B] text-[11px] font-bold tracking-widest uppercase">{item.year}</span>
                      <h3 className="font-serif text-white text-2xl mt-1 mb-2">{item.title}</h3>
                      <p className="text-white/60 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS STRIP ====== */}
      <section className="w-full bg-white py-20 px-8 md:px-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { num: '5,000+', label: 'Happy Clients' },
            { num: '10+', label: 'Expert Stylists' },
            { num: '8+', label: 'Years of Service' },
            { num: '20+', label: 'Awards Won' },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <p className="font-serif text-5xl text-[var(--color-primary)] font-bold">{s.num}</p>
              <p className="text-[11px] text-gray-400 tracking-widest uppercase mt-2">{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ====== TWO IMAGES + QUOTE ====== */}
      <section className="w-full bg-[var(--color-accent)] py-28 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <blockquote className="font-serif text-[var(--color-primary)] leading-snug" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)' }}>
              "We don't just style hair — we sculpt confidence and celebrate the unique beauty in every person who walks through our doors."
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=200&q=80" alt="founder" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-[var(--color-primary)] text-sm">Aanya Sharma</p>
                <p className="text-[11px] text-gray-400 tracking-widest uppercase">Founder & Lead Stylist</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80" alt="salon" className="w-full aspect-square object-cover rounded-2xl" />
              <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&q=80" alt="salon" className="w-full aspect-square object-cover rounded-2xl mt-8" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="w-full bg-[var(--color-primary)] py-24 px-8 md:px-16 text-center flex flex-col items-center">
        <RevealText as="h2" text="Ready to Experience the Moonlit Difference?" className="font-serif text-white uppercase tracking-tighter justify-center mb-10" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }} />
        <FadeUp>
          <Link
            to="/booking"
            className="mt-10 inline-flex items-center gap-3 bg-white text-[var(--color-primary)] px-10 py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#3AA89B] hover:text-white hover:shadow-xl hover:-translate-y-0.5 group"
          >
            Book Your Appointment
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeUp>
      </section>

    </div>
  );
};

export default About;
