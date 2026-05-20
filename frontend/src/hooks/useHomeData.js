import { useState, useEffect, useCallback } from 'react';
import { getCategories, getServices } from '../api/servicesApi';
import { getStylists } from '../api/stylistApi';
import { getGallery } from '../api/galleryApi';
import { submitContact } from '../api/contactApi';
import toast from 'react-hot-toast';

const useHomeData = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const openLightbox = useCallback((index) => setLightbox({ open: true, index }), []);
  const closeLightbox = useCallback(() => setLightbox({ open: false, index: 0 }), []);
  const prevImage = useCallback(() => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + gallery.length) % gallery.length })), [gallery.length]);
  const nextImage = useCallback(() => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % gallery.length })), [gallery.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, styRes, galRes, servRes] = await Promise.all([
          getCategories().catch(() => ({ data: [] })),
          getStylists().catch(() => ({ data: [] })),
          getGallery().catch(() => ({ data: [] })),
          getServices().catch(() => ({ data: [] })),
        ]);
        setCategories((catRes.data || catRes || []).slice(0, 5));
        setServices((servRes.data || servRes || []).slice(0, 4));
        setStylists((styRes.data || styRes || []).slice(0, 4));
        setGallery(galRes.data || galRes || []);
      } catch (error) {
        console.error('Data fetch error', error);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(formData);
      toast.success('Message sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return {
    categories, services, stylists, gallery,
    lightbox, openLightbox, closeLightbox, prevImage, nextImage,
    formData, setFormData, loading, handleContactSubmit,
  };
};

export default useHomeData;
