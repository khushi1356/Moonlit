import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, ChevronDown, ChevronUp, X, ListFilter } from 'lucide-react';
import { getServices, getCategories } from '../api/servicesApi';
import { Link } from 'react-router-dom';
import ReviewSection from '../components/common/ReviewSection';
import { FadeUp, RevealText } from '../components/animations';
import SEO from '../components/seo/SEO';

const Services = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [servicesData, setServicesData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices().catch(() => ({ data: [] })),
          getCategories().catch(() => ({ data: [] }))
        ]);

        const fetchedServices = servicesRes.data || servicesRes || [];
        const fetchedCategories = categoriesRes.data || categoriesRes || [];

        setServicesData(fetchedServices);
        setCategoryDetails(fetchedCategories);
        
        const catNames = ["All", ...fetchedCategories.map(c => c.name)];
        if (catNames.length === 1 && fetchedServices.length > 0) {
          const uniqueCats = [...new Set(fetchedServices.map(s => s.category?.name || s.categoryId?.name || "Other"))];
          setCategories(["All", ...uniqueCats]);
          setCategoryDetails(uniqueCats.map(name => ({ name })));
        } else {
          setCategories(catNames);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getServiceCategoryName = useCallback((service) => service.category?.name || service.categoryId?.name || "Other", []);
  
  const filteredServices = useMemo(() => {
    return activeCategory === "All" 
      ? servicesData 
      : servicesData.filter(service => getServiceCategoryName(service).trim().toLowerCase() === activeCategory.trim().toLowerCase());
  }, [activeCategory, servicesData, getServiceCategoryName]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[var(--color-bg-light)] text-[var(--color-primary)]">
      <SEO 
        title="Services" 
        description="Explore our curated treatments including haircuts, facials, manicures, and massages. Discover the ultimate relaxation and beauty experience at Moonlit Salon."
      />
      {}
      <div className="px-4 md:px-12 max-w-[1400px] mx-auto mb-10 md:mb-16">
        <FadeUp>
          <p className="text-xs tracking-widest uppercase font-bold text-[var(--color-text-muted)] mb-6">
            Our Curations
          </p>
        </FadeUp>
        <RevealText 
          as="h1" 
          text="Signature Services" 
          className="text-4xl md:text-6xl font-serif uppercase tracking-tighter mb-8 md:mb-12 text-[var(--color-primary)]" 
        />

        {}
        {!loading && categoryDetails.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="hidden md:flex gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x"
          >
            {}
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex-shrink-0 snap-start flex flex-col items-center gap-4 transition-all duration-300 ${
                activeCategory === "All" ? 'scale-105' : 'scale-100 hover:scale-105'
              }`}
            >
              <div className={`w-32 h-32 overflow-hidden transition-all border-2 ${
                activeCategory === "All" ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'border-gray-200 hover:border-[var(--color-primary)]/40'
              }`} style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}>
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="font-serif text-2xl text-[var(--color-primary)]">All</span>
                </div>
              </div>
              <span className={`text-xs tracking-widest uppercase font-bold text-center ${
                activeCategory === "All" ? 'text-[var(--color-primary)]' : 'text-gray-700'
              }`}>All</span>
            </button>

            {categoryDetails.map((cat, i) => (
              <button
                key={cat._id || i}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 snap-start flex flex-col items-center gap-4 transition-all duration-300 ${
                  activeCategory === cat.name ? 'scale-105' : 'scale-100 hover:scale-105'
                }`}
              >
                <div className={`w-32 h-32 overflow-hidden transition-all border-2 ${
                  activeCategory === cat.name ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'border-gray-200 hover:border-[var(--color-primary)]/40'
                }`} style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                  <img 
                    src={cat.imageUrl || cat.image || 'https://images.unsplash.com/photo-1560066984-138daaa5de74?w=400&q=80'} 
                    alt={cat.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${
                      activeCategory === cat.name ? 'brightness-100' : 'brightness-90'
                    }`}
                  />
                </div>
                <span className={`text-xs tracking-widest uppercase font-bold text-center leading-tight max-w-[120px] ${
                  activeCategory === cat.name ? 'text-[var(--color-primary)]' : 'text-gray-700'
                }`}>{cat.name}</span>
              </button>
            ))}
          </motion.div>
        )}

        {}
        {!loading && categoryDetails.length > 0 && (
          <div className="md:hidden flex items-center justify-between border-b border-[var(--color-primary)]/10 pb-4 mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
              Showing: <span className="text-[var(--color-primary)]">{activeCategory}</span>
            </span>
            <button 
              onClick={() => setIsFilterOpen(true)} 
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] bg-white shadow-sm border border-[var(--color-primary)]/10 px-4 py-2 rounded-full active:scale-95 transition-transform"
            >
              <ListFilter size={14} /> Filter
            </button>
          </div>
        )}
      </div>

      <div className="px-4 md:px-12 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />)}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center border-y border-[var(--color-primary)]/10">
            <h3 className="text-2xl font-serif italic text-gray-400">No services found in this category.</h3>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  layout
                  key={service._id || service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                  className="group flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden mb-4 md:mb-6 relative shadow-lg rounded-md">
                    <img 
                      src={service.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'} 
                      alt={service.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] md:text-xs font-bold text-[var(--color-primary)] shadow">
                      ₹{service.price}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="text-[9px] md:text-xs tracking-widest uppercase font-bold text-gray-400 mb-1 line-clamp-1">{getServiceCategoryName(service)}</p>
                    <h3 className="text-lg md:text-2xl font-serif uppercase tracking-wide group-hover:italic transition-all mb-2 line-clamp-2">{service.name}</h3>
                    
                    <p className="text-xs md:text-sm text-gray-500 font-light line-clamp-2 md:line-clamp-3 mb-4 flex-1">
                      {service.description || "An exclusive treatment designed to elevate your personal style."}
                    </p>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center border-t border-[var(--color-primary)]/10 pt-4 gap-3 md:gap-0 mt-auto">
                      <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{service.duration} MIN</span>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        <button
                          onClick={() => setExpandedServiceId(expandedServiceId === (service._id || service.id) ? null : (service._id || service.id))}
                          className="flex items-center gap-1 text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                        >
                          Reviews
                        </button>
                        <Link to={`/booking?service=${service._id}`} className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs uppercase tracking-widest font-bold text-[var(--color-primary)] hover:text-gray-400 transition-colors group/btn">
                          Book <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {}
      <AnimatePresence>
        {expandedServiceId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setExpandedServiceId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-primary)]/10">
                <h2 className="text-xl md:text-2xl font-serif text-[var(--color-primary)]">
                  {servicesData.find(s => (s._id || s.id) === expandedServiceId)?.name} Reviews
                </h2>
                <button onClick={() => setExpandedServiceId(null)} className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ReviewSection 
                serviceId={expandedServiceId} 
                serviceName={servicesData.find(s => (s._id || s.id) === expandedServiceId)?.name} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-[60] flex md:hidden">
            {}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--color-primary)]/10">
                <h3 className="text-lg font-serif font-bold text-[var(--color-primary)]">Categories</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-[var(--color-primary)] bg-gray-50 p-2 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-3 overflow-y-auto">
                <button
                  onClick={() => { setActiveCategory("All"); setIsFilterOpen(false); }}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors border ${
                    activeCategory === "All" ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-sm text-[var(--color-primary)]">All</span>
                  </div>
                  <span className="text-xs tracking-widest uppercase font-bold">All Services</span>
                </button>

                {categoryDetails.map((cat, i) => (
                  <button
                    key={cat._id || i}
                    onClick={() => { setActiveCategory(cat.name); setIsFilterOpen(false); }}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors border ${
                      activeCategory === cat.name ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={cat.imageUrl || cat.image || 'https://images.unsplash.com/photo-1560066984-138daaa5de74?w=400&q=80'} 
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs tracking-widest uppercase font-bold text-left">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Services;
