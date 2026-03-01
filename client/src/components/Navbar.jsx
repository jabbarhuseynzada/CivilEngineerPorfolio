import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaHardHat } from 'react-icons/fa';
import { api } from '../api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [tagline,     setTagline]     = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.getSiteSettings().then((data) => {
      if (data?.companyName) setCompanyName(data.companyName);
      if (data?.heroTagline) setTagline(data.heroTagline);
    }).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Ana səhifə', href: '#hero' },
    { name: 'Xidmətlər', href: '#services' },
    { name: 'Haqqımda', href: '#about' },
    { name: 'Layihələr', href: '#portfolio' },
    { name: 'Əlaqə', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('#hero')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-lg flex items-center justify-center">
              <FaHardHat className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-charcoal-950">
                {companyName}
              </h1>
              {tagline && (
                <p className="text-xs text-charcoal-600 font-medium tracking-wider">
                  {tagline}
                </p>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-charcoal-800 hover:text-terracotta-500 font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta-500 to-gold-500 transition-all group-hover:w-full"></span>
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#contact')}
              className="px-6 py-2.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Əlaqə saxla
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-charcoal-950 hover:text-terracotta-500 transition-colors"
          >
            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-charcoal-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-3 text-charcoal-800 hover:text-terracotta-500 hover:bg-terracotta-50 rounded-lg transition-all font-medium"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('#contact')}
                className="w-full px-6 py-3 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-lg font-semibold"
              >
                Əlaqə saxla
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
