import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaPhone } from 'react-icons/fa';
import { api } from '../api';

const Hero = () => {
  const [stats, setStats] = useState([
    { value: '20+', label: 'İl Təcrübə' },
    { value: '500+', label: 'Layihə' },
    { value: '100%', label: 'Məmnuniyyət' },
  ]);
  const [heroTitle,    setHeroTitle]    = useState('Evinizi Xəyallarınızdan Həqiqətə Çeviririk');
  const [heroSubtitle, setHeroSubtitle] = useState('20 illik təcrübə ilə tam tikinti, təmir, elektrik işləri və daha çoxunu peşəkar keyfiyyətdə təqdim edirik.');
  const [heroTagline,  setHeroTagline]  = useState('Professional Tikinti Xidmətləri');
  const [heroImages,   setHeroImages]   = useState([
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
  ]);

  useEffect(() => {
    api.getSiteSettings().then((data) => {
      if (data?.stats?.length)    setStats(data.stats);
      if (data?.heroTitle)        setHeroTitle(data.heroTitle);
      if (data?.heroSubtitle)     setHeroSubtitle(data.heroSubtitle);
      if (data?.heroTagline)      setHeroTagline(data.heroTagline);
      if (data?.heroImages?.length) setHeroImages(data.heroImages);
    }).catch(() => {});
  }, []);

  const scrollToContact  = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToServices = () => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });

  const img0 = heroImages[0] ?? '';
  const img1 = heroImages[1] ?? '';

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-terracotta-600 font-semibold text-sm tracking-[0.3em] uppercase mb-4"
              >
                {heroTagline}
              </motion.p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-charcoal-950 leading-tight">
                {heroTitle}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-charcoal-600 leading-relaxed max-w-xl"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToContact}
                className="px-8 py-4 bg-terracotta-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-terracotta-700 transition-all flex items-center gap-2"
              >
                <FaPhone />
                Bizimlə Əlaqə
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToServices}
                className="px-8 py-4 bg-white text-charcoal-950 border-2 border-charcoal-200 rounded-full font-semibold text-lg hover:border-terracotta-600 transition-all"
              >
                Xidmətləri Gör
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
                  className="text-center"
                >
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-terracotta-600">
                    {stat.value}
                  </h3>
                  <p className="text-charcoal-600 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Image Grid (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative h-[500px] lg:h-[600px] hidden lg:block"
          >
            {img0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute top-0 right-0 w-3/4 h-3/5 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src={img0} alt="Tikinti" className="w-full h-full object-cover" />
              </motion.div>
            )}

            {img1 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-0 left-0 w-1/2 h-2/5 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src={img1} alt="Tikinti" className="w-full h-full object-cover" />
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              className="absolute top-1/2 left-0 bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="text-center">
                <p className="text-4xl font-display font-bold text-terracotta-600">
                  {stats[0]?.value ?? '20+'}
                </p>
                <p className="text-sm text-charcoal-600 font-semibold mt-1">
                  {stats[0]?.label ?? 'İllik Təcrübə'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button onClick={scrollToServices} className="text-charcoal-400 hover:text-terracotta-600 transition-colors">
          <FaArrowDown size={24} />
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
