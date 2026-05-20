import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeHash, setActiveHash] = useState(window.location.hash || '');
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashClick = useCallback((e, hashId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const newHash = `#${hashId}`;
    setActiveHash(newHash);
    
    if (location.pathname !== '/') {
      navigate(`/${newHash}`);
      setTimeout(() => {
        document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else {
      window.history.pushState(null, '', `/${newHash}`);
      document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setActiveHash(location.hash || '');
  }, [location]);

  const checkIsActive = useCallback((link) => {
    if (link.hash) {
      return location.pathname === '/' && activeHash === `#${link.hash}`;
    } else if (link.path === '/') {
      return location.pathname === '/' && !activeHash;
    }
    return location.pathname === link.path;
  }, [location.pathname, activeHash]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SERVICES', path: '/services' },
    { name: 'STYLISTS', path: '/stylists' },
    { name: 'GALLERY', path: '/', hash: 'gallery' },
    { name: 'CONTACT', path: '/', hash: 'contact' },
  ];

  return (
    <>
      <style>{`
        .navbar-glass {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(26, 43, 73, 0.08);
        }
        .navbar-glass.scrolled {
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 4px 40px rgba(26, 43, 73, 0.08);
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #1A2B49, #3AA89B);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link-hover:hover::after, .nav-link-hover.active::after {
          width: 100%;
        }
        .book-btn {
          background: linear-gradient(135deg, #1A2B49 0%, #2A4070 100%);
          position: relative;
          overflow: hidden;
        }
        .book-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #3AA89B 0%, #1A2B49 100%);
          transition: left 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .book-btn:hover::before { left: 0; }
        .book-btn span { position: relative; z-index: 1; }
      `}</style>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full z-50 transition-all duration-500 navbar-glass ${isScrolled ? 'scrolled py-2' : 'py-3'}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">

          {}
          <Link to="/" className="relative z-50 flex flex-col items-start justify-center group shrink-0">
            <div
              className="text-[var(--color-primary)] uppercase leading-none tracking-[0.18em]"
              style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '26px', letterSpacing: '0.22em' }}
            >
              MOONLIT<span style={{ color: '#3AA89B', fontWeight: 400 }}>.</span>
            </div>
            <div className="flex items-center gap-2 mt-[5px] w-full">
              <div className="h-[0.5px] bg-[var(--color-primary)] flex-1 opacity-50" />
              <span
                className="text-[var(--color-primary)]"
                style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '7px', letterSpacing: '0.38em' }}
              >
                THE BEAUTY HUB
              </span>
              <div className="h-[0.5px] bg-[var(--color-primary)] flex-1 opacity-50" />
            </div>
          </Link>

          {}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.hash ? `/#${link.hash}` : link.path}
                onClick={link.hash ? (e) => handleHashClick(e, link.hash) : () => setActiveHash('')}
                className={`relative text-[12px] tracking-[0.18em] uppercase font-bold transition-colors duration-300 nav-link-hover ${
                  checkIsActive(link)
                    ? 'text-[var(--color-primary)] active'
                    : 'text-gray-600 hover:text-[var(--color-primary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {}
          <div className="hidden md:flex items-center space-x-6 relative z-50">

            {}
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-5 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] text-[11px] tracking-[0.15em] font-bold uppercase hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-[11px] tracking-[0.15em] font-bold uppercase hover:bg-[var(--color-primary)]/90 transition-all duration-300"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {}
          <div className="md:hidden flex items-center gap-4 z-50">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[var(--color-primary)] focus:outline-none">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 w-full h-screen z-40 flex flex-col"
            style={{ background: 'var(--color-primary)' }}
          >
            {}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-start justify-center">
                <div
                  className="text-white uppercase leading-none"
                  style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.22em' }}
                >
                  MOONLIT<span style={{ color: '#3AA89B', fontWeight: 400 }}>.</span>
                </div>
                <div className="flex items-center gap-2 mt-[5px] w-full">
                  <div className="h-[0.5px] bg-white flex-1 opacity-40" />
                  <span
                    className="text-white"
                    style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 300, fontSize: '6px', letterSpacing: '0.38em' }}
                  >
                    THE BEAUTY HUB
                  </span>
                  <div className="h-[0.5px] bg-white flex-1 opacity-40" />
                </div>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {}
            <div className="flex-1 flex flex-col justify-center px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                  className="border-b border-white/10"
                >
                  <Link
                    to={link.hash ? `/#${link.hash}` : link.path}
                    onClick={link.hash ? (e) => handleHashClick(e, link.hash) : () => { setIsMobileMenuOpen(false); setActiveHash(''); }}
                    className={`flex items-center justify-between py-4 text-[17px] md:text-xl tracking-[0.2em] uppercase transition-colors ${
                      checkIsActive(link)
                        ? 'text-white font-bold'
                        : 'text-white/60 hover:text-white font-light'
                    }`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-30" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="px-8 pb-6 md:pb-12 pt-5 md:pt-8 mt-auto border-t border-white/10 flex flex-col gap-3"
            >
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3.5 bg-[#3AA89B] text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#3AA89B]/90 transition-colors"
              >
                Book Appointment
              </Link>
              <Link
                to={isLoggedIn ? '/profile' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3.5 border border-white/20 text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                {isLoggedIn ? 'My Profile' : 'Sign In'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;
