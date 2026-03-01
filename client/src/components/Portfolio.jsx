import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaMapMarkerAlt, FaCalendar, FaRuler } from 'react-icons/fa';
import { api } from '../api';

const categories = [
  { id: 'hamisi', name: 'Hamısı' },
  { id: 'ev', name: 'Ev Tikintisi' },
  { id: 'temir', name: 'Təmir İşləri' },
  { id: 'elektrik', name: 'Elektrik' },
];

const Portfolio = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('hamisi');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const category = activeCategory === 'hamisi' ? undefined : activeCategory;
    api.getProjects(category).then(setProjects).catch(() => {});
  }, [activeCategory]);

  return (
    <section id="portfolio" className="py-24 bg-charcoal-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-terracotta-600 font-semibold text-sm tracking-[0.3em] uppercase mb-4"
          >
            Layihələrimiz
          </motion.p>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal-950 mb-6">
            Tamamlanmış{' '}
            <span className="text-terracotta-600">Layihələr</span>
          </h2>

          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Keçmiş layihələrimizdən bəziləri. Hər bir layihə bizim keyfiyyət və peşəkarlıq standartlarımızı əks etdirir.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-terracotta-600 text-white shadow-lg'
                  : 'bg-white text-charcoal-700 hover:bg-charcoal-100 shadow'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-charcoal-950">
                  {categories.find((c) => c.id === project.category)?.name ?? project.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-display font-bold text-charcoal-950 mb-3 group-hover:text-terracotta-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-charcoal-600 mb-4 leading-relaxed">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-charcoal-700 text-sm">
                    <FaMapMarkerAlt className="text-terracotta-600" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-700 text-sm">
                    <FaCalendar className="text-terracotta-600" />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-700 text-sm">
                    <FaRuler className="text-terracotta-600" />
                    <span>{project.area}</span>
                  </div>
                </div>
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
          <p className="text-charcoal-700 text-lg mb-6">Sizin layihənizi də bu siyahıya əlavə edək?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-terracotta-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-terracotta-700 transition-all"
          >
            Layihəni Başlat
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
