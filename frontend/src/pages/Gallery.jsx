import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { getGallery } from '../api/galleryApi';
import { FadeUp, RevealText } from '../components/Animations';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [galleryImages, setGalleryImages] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getGallery();
        const data = response.data || response || [];
        setGalleryImages(data);
        if(data.length > 0) {
          const uniqueCats = [...new Set(data.map(item => item.category || 'Other'))];
          setCategories(['All', ...uniqueCats]);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeTab === 'All' ? galleryImages : galleryImages.filter(img => (img.category || 'Other') === activeTab);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[var(--color-bg-light)] text-[var(--color-primary)]">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 flex flex-col items-center text-center">
        <FadeUp>
          <p className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-6">
            The Archive
          </p>
        </FadeUp>
        <RevealText as="h1" text="Visual Poetry" className="text-6xl md:text-8xl font-serif uppercase tracking-tighter justify-center" />

        {/* Filter Tabs */}
        {!loading && categories.length > 1 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-16"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`text-xs tracking-widest uppercase font-bold transition-all duration-300 pb-2 border-b-2 ${
                  activeTab === category ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-400 hover:text-[var(--color-primary)]'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Masonry Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={`bg-gray-100 animate-pulse ${i % 2 === 0 ? 'h-[400px]' : 'h-[600px]'}`} />)}
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="py-20 text-center border-y border-[var(--color-primary)]/10">
            <h3 className="text-2xl font-serif italic text-gray-400">The archive is currently empty.</h3>
          </div>
        ) : (
          <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map((image, i) => (
                <motion.div
                  layout
                  key={image._id || image.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  className="relative group overflow-hidden break-inside-avoid cursor-pointer bg-gray-100"
                  onClick={() => setSelectedImg(image.imageUrl)}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={image.caption} 
                    className="w-full h-auto transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[var(--color-primary)]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 mix-blend-multiply">
                    <span className="text-white text-xs tracking-widest font-bold uppercase mb-2">
                      {image.category || 'Portfolio'}
                    </span>
                    <h3 className="text-white text-2xl font-serif italic">
                      {image.caption}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--color-primary)] flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white hover:text-[var(--color-rose)] hover:rotate-90 transition-all duration-300"
              onClick={() => setSelectedImg(null)}
            >
              <X className="w-10 h-10" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              src={selectedImg} 
              alt="Archive View" 
              className="max-w-full max-h-full object-contain" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* High Fashion Video Teaser Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-32">
        <div className="relative overflow-hidden h-[50vh] md:h-[70vh] flex items-center justify-center group cursor-pointer">
          {/* USER: PUT AI VIDEO URL HERE OR AI GENERATED SALON VIDEO GIF */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516975080661-46bfa2c281c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')" }}
          />
          <div className="absolute inset-0 bg-[var(--color-primary)]/40 mix-blend-multiply group-hover:bg-[var(--color-primary)]/60 transition-colors duration-700" />
          
          <div className="relative z-10 text-center text-white transform group-hover:scale-110 transition-transform duration-700">
            <button className="w-24 h-24 border border-white text-white rounded-full flex items-center justify-center mx-auto mb-8 bg-transparent backdrop-blur-md hover:bg-white hover:text-[var(--color-primary)] transition-colors duration-500">
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </button>
            <h2 className="text-xs tracking-widest font-bold uppercase">View Film</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
