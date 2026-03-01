import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { api } from '../api';

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="services" className="py-24 bg-charcoal-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-terracotta-600 font-semibold text-sm tracking-[0.3em] uppercase mb-4"
          >
            Xidmətlərimiz
          </motion.p>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal-950 mb-6">
            Təklif Etdiyimiz{' '}
            <span className="text-terracotta-600">Xidmətlər</span>
          </h2>

          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Tikinti sahəsində tam spektrli xidmətlər. Kiçik təmirdən böyük tikinti layihələrinə qədər.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent"></div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-display font-bold text-charcoal-950 mb-3">
                  {service.title}
                </h3>
                <p className="text-charcoal-600 leading-relaxed">{service.description}</p>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="mt-4 text-terracotta-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Ətraflı <span>→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-terracotta-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-terracotta-700 transition-all"
          >
            Pulsuz Məsləhət Alın
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
