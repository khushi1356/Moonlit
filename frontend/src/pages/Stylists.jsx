import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStylists } from '../api/stylistApi';
import { FadeUp, RevealText } from '../components/animations';
import SEO from '../components/seo/SEO';

const Stylists = React.memo(() => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await getStylists();
        const data = response.data || response || [];
        setStylists(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchStylists();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[var(--color-bg-light)] text-[var(--color-primary)]">
      <SEO 
        title="Stylists" 
        description="Meet the master stylists at Moonlit Salon. Our dedicated experts are here to elevate your natural beauty."
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col items-center text-center mb-12 md:mb-16">
        <FadeUp>
          <p className="text-[10px] md:text-xs tracking-widest uppercase font-bold text-[var(--color-text-muted)] mb-4 md:mb-6">
            Our Artists
          </p>
        </FadeUp>
        <RevealText as="h1" text="The Masters" className="text-4xl md:text-6xl font-serif uppercase tracking-tighter justify-center" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-gray-100 animate-pulse rounded-lg" />)}
          </div>
        ) : stylists.length === 0 ? (
          <div className="py-20 text-center border-y border-[var(--color-primary)]/10">
            <h3 className="text-2xl font-serif italic text-gray-400">Our artists roster is currently being updated.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {stylists.map((stylist, index) => (
              <motion.div
                key={stylist._id || stylist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: (index % 4) * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden mb-3 md:mb-4 relative rounded-md shadow-lg">
                  <img 
                    src={stylist.userId?.profilePic || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'} 
                    alt={stylist.userId?.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[var(--color-primary)]/50 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-2">
                    <Link 
                      to={`/booking?stylist=${stylist._id}`}
                      className="px-3 py-2 md:px-6 md:py-3 border border-white text-white text-[9px] md:text-xs tracking-widest uppercase font-bold hover:bg-white hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 md:gap-2 transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-lg text-center backdrop-blur-sm"
                    >
                      Book <span className="hidden md:inline">Session</span> <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </div>

                <div className="text-left flex-1 flex flex-col">
                  <p className="text-[9px] md:text-xs tracking-widest uppercase font-bold text-gray-400 mb-1 truncate">
                    {(stylist.specialization && stylist.specialization.length > 0) ? stylist.specialization[0] : 'Master Stylist'}
                  </p>
                  <h3 className="text-lg md:text-2xl font-serif uppercase tracking-wide group-hover:italic transition-all mb-1 text-[var(--color-primary)] truncate">
                    {stylist.userId?.name || 'Stylist'}
                  </h3>
                  <p className="text-[10px] md:text-sm font-light text-gray-500 line-clamp-2 md:line-clamp-3 flex-1 mb-3">
                    {stylist.bio || 'Dedicated to the craft of perfect styling and unparalleled client care.'}
                  </p>
                  <div className="mt-auto text-[9px] md:text-xs tracking-widest font-bold text-[var(--color-primary)] border-t border-[var(--color-primary)]/10 pt-3 flex justify-between items-center">
                    <span>EXP: {stylist.experience || 0}Y</span>
                    <span className="flex items-center gap-1">★ {stylist.rating || 5.0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default Stylists;
