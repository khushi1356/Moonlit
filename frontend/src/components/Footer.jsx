import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/client';

const subscribeNewsletter = async (email) => {
  const response = await apiClient.post('/email-campaign/subscribe', { email });
  return response.data;
};

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribing(true);
    try {
      await subscribeNewsletter(newsletterEmail);
      toast.success("Subscribed successfully.");
      setNewsletterEmail('');
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'The Artists', path: '/stylists' },
    { name: 'Lookbook', path: '/#gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Booking', path: '/booking' },
  ];

  return (
    <footer className="bg-[var(--color-primary)] text-white pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          
          {}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="relative flex flex-col items-start justify-center group shrink-0 mb-8">
                <div
                  className="text-white uppercase leading-none tracking-[0.18em]"
                  style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '32px', letterSpacing: '0.22em' }}
                >
                  MOONLIT<span style={{ color: '#3AA89B', fontWeight: 400 }}>.</span>
                </div>
                <div className="flex items-center gap-2 mt-[6px] w-full max-w-[220px]">
                  <div className="h-[0.5px] bg-white flex-1 opacity-30" />
                  <span
                    className="text-white opacity-90"
                    style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '8px', letterSpacing: '0.38em' }}
                  >
                    THE BEAUTY HUB
                  </span>
                  <div className="h-[0.5px] bg-white flex-1 opacity-30" />
                </div>
              </Link>
              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
                An unparalleled sanctuary for beauty and wellness. Dedicated to the craft of perfect styling.
              </p>
            </div>
          </div>

          {}
          <div className="hidden md:block md:col-span-1" />

          {}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] text-gray-500">Explore</h4>
            <ul className="space-y-4">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-lg text-gray-300 hover:text-white hover:italic transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="md:col-span-1">
            <h4 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] text-gray-500">Social</h4>
            <ul className="space-y-4">
              {['Instagram', 'Pinterest', 'Facebook'].map(social => (
                <li key={social}>
                  <a href="#" className="text-lg text-gray-300 hover:text-white hover:italic transition-all">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] text-gray-500">The List</h4>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light">
              Join our exclusive mailing list for early access to bookings and seasonal treatments.
            </p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-gray-700 py-3 pr-10 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors tracking-widest text-xs"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white transition-colors disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
        
        {}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-xs tracking-[0.1em] uppercase text-gray-500 gap-6">
          <div className="flex flex-col gap-3">
            <p>&copy; {new Date().getFullYear()} MOONLIT STUDIO. ALL RIGHTS RESERVED.</p>
            <p style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontSize: '10px', color: 'white', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              developed by <span style={{ color: '#3AA89B', fontWeight: 600 }}>Khushi Kalathiya</span>
            </p>
            <div className="flex space-x-6 text-[10px]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] mr-2 text-gray-600">SECURE PAYMENTS</span>
            {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(pay => (
              <div key={pay} className="px-3 py-1.5 border border-gray-700/50 rounded-sm text-[9px] tracking-widest text-gray-400 bg-white/5 hover:bg-white/10 hover:border-gray-500 hover:text-white transition-all cursor-default">
                {pay}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
