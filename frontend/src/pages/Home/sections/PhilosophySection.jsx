import { Link } from 'react-router-dom';
import { FadeUp } from '../../../components/animations';
import { RevealText } from '../../../components/animations';

const PhilosophySection = () => (
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
);

export default PhilosophySection;
