import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { submitContact } from '../api/contactApi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(formData);
      toast.success("Message dispatched. We shall respond shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[var(--color-bg-light)] text-[var(--color-primary)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-6"
          >
            Inquiries
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif uppercase tracking-tighter"
          >
            Connect <span className="italic text-gray-400">With Us</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[var(--color-surface-light)] p-12 md:p-16 shadow-xl rounded-xl">
            <h3 className="text-2xl font-serif uppercase tracking-wide mb-12 border-b border-[var(--color-primary)]/10 pb-4 text-[var(--color-primary)]">Correspondence</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs tracking-widest uppercase font-bold text-gray-500 mb-4">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pb-4 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[var(--color-rose)] outline-none font-serif italic text-lg transition-colors"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-bold text-gray-500 mb-4">Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pb-4 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[var(--color-rose)] outline-none font-serif italic text-lg transition-colors"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs tracking-widest uppercase font-bold text-gray-500 mb-4">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full pb-4 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[var(--color-rose)] outline-none font-serif italic text-lg transition-colors"
                  placeholder="Reason for inquiry"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase font-bold text-gray-500 mb-4">Message</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full py-4 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[var(--color-rose)] outline-none resize-none font-serif italic text-lg transition-colors"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 bg-[var(--color-rose)] text-white text-xs tracking-widest font-bold uppercase hover:bg-[var(--color-primary)] hover:text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-4 mt-8 rounded-lg ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Transmitting...' : <><Send className="w-4 h-4" /> Dispatch Message</>}
              </button>
            </form>
          </motion.div>

          {/* Contact Information & Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-12 flex flex-col justify-between">
            <div className="space-y-12">
              <div className="border-l border-[var(--color-primary)]/10 pl-8">
                <h4 className="text-xs tracking-widest uppercase font-bold text-gray-500 mb-2 flex items-center gap-3"><MapPin className="w-4 h-4" /> The Atelier</h4>
                <p className="font-serif italic text-2xl">123 Serenity Avenue<br />Beverly Hills, CA 90210</p>
              </div>

              <div className="border-l border-[var(--color-primary)]/10 pl-8">
                <h4 className="text-xs tracking-widest uppercase font-bold text-gray-500 mb-2 flex items-center gap-3"><Phone className="w-4 h-4" /> Direct Line</h4>
                <p className="font-serif italic text-2xl">+1 (555) 123-4567</p>
                <p className="text-xs tracking-widest text-gray-400 mt-2">MON-SUN: 9:00 AM - 8:00 PM</p>
              </div>

              <div className="border-l border-[var(--color-primary)]/10 pl-8">
                <h4 className="text-xs tracking-widest uppercase font-bold text-gray-500 mb-2 flex items-center gap-3"><Mail className="w-4 h-4" /> Digital</h4>
                <p className="font-serif italic text-2xl">hello@moonlit.studio<br />bookings@moonlit.studio</p>
              </div>
            </div>

            {/* Minimalist Map Placeholder */}
            <div className="h-64 bg-gray-100 grayscale hover:grayscale-0 transition-all duration-1000 w-full mt-8">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.341490226344!2d-118.403487384784!3d34.08636498059632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
