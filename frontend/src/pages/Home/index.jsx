import React from 'react';
import SEO from '../../components/seo/SEO';
import useHomeData from '../../hooks/useHomeData';
import HeroSection from './sections/HeroSection';
import PhilosophySection from './sections/PhilosophySection';
import ServicesSection from './sections/ServicesSection';
import StylistsSection from './sections/StylistsSection';
import GallerySection from './sections/GallerySection';
import ContactSection from './sections/ContactSection';
import CTASection from './sections/CTASection';
import MarqueeStrip from './components/MarqueeStrip';
import GalleryLightbox from './components/GalleryLightbox';

const Home = React.memo(() => {
  const {
    categories, services, stylists, gallery,
    lightbox, openLightbox, closeLightbox, prevImage, nextImage,
    formData, setFormData, loading, handleContactSubmit,
  } = useHomeData();

  return (
    <div className="w-full bg-[var(--color-secondary)] text-[var(--color-text-dark)] overflow-hidden font-sans">
      <SEO
        title="Home"
        description="Experience luxury at Moonlit Salon & Spa. Book an appointment today for premium hair, skin, and nail treatments."
      />
      <HeroSection />
      <MarqueeStrip />
      <PhilosophySection />
      <ServicesSection categories={categories} services={services} />
      <StylistsSection stylists={stylists} />
      <GallerySection gallery={gallery} onOpenLightbox={openLightbox} />
      <GalleryLightbox
        lightbox={lightbox}
        gallery={gallery}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
      <ContactSection
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleContactSubmit}
        loading={loading}
      />
      <CTASection />
    </div>
  );
});

export default Home;
