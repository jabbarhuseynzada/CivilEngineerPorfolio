import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaAward, FaUsers, FaCheckCircle, FaCertificate, FaHardHat } from 'react-icons/fa';
import { api } from '../api';

const iconMap = { FaAward, FaUsers, FaCheckCircle, FaCertificate };

const defaultAchievements = [
  { icon: 'FaAward',       number: '20+',  label: 'İllik Təcrübə' },
  { icon: 'FaUsers',       number: '500+', label: 'Məmnun Müştəri' },
  { icon: 'FaCheckCircle', number: '100%', label: 'Keyfiyyət Zəmanəti' },
  { icon: 'FaCertificate', number: '15+',  label: 'Sertifikat' },
];

const defaultCoreValues = ['Keyfiyyət', 'Etibarlılıq', 'Şəffaflıq', 'İnnovasiya'];

const defaultAboutImages = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  'https://images.unsplash.com/photo-1590496793907-3b0bc5ffd160?w=800&q=80',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [achievements,  setAchievements]  = useState(defaultAchievements);
  const [coreValues,    setCoreValues]    = useState(defaultCoreValues);
  const [aboutText1,    setAboutText1]    = useState('Mən tikinti mühəndisi olaraq 20 ildən artıqdır ki, Azərbaycanda yüzlərlə layihəni uğurla həyata keçirmişəm. Ev tikintisindən tutmuş böyük miqyaslı təmir işlərinə qədər hər bir layihəyə peşəkarlıqla yanaşıram.');
  const [aboutText2,    setAboutText2]    = useState('Müasir texnologiyalar və ən yaxşı materiallardan istifadə edərək, hər bir müştəriyə fərdi yanaşma və maksimum keyfiyyət təmin edirəm. Mənim əsas məqsədim - müştərilərin tam məmnuniyyətidir.');
  const [aboutHeading,  setAboutHeading]  = useState('Sizin Xəyallarınızı Həyata Keçiririk');
  const [aboutImages,   setAboutImages]   = useState(defaultAboutImages);
  const [companyName,   setCompanyName]   = useState('');

  useEffect(() => {
    api.getSiteSettings().then((data) => {
      if (data?.achievements?.length)  setAchievements(data.achievements);
      if (data?.coreValues?.length)    setCoreValues(data.coreValues);
      if (data?.aboutText1)            setAboutText1(data.aboutText1);
      if (data?.aboutText2)            setAboutText2(data.aboutText2);
      if (data?.aboutHeading)          setAboutHeading(data.aboutHeading);
      if (data?.aboutImages?.length)   setAboutImages(data.aboutImages);
      if (data?.companyName)           setCompanyName(data.companyName);
    }).catch(() => {});
  }, []);

  const img0 = aboutImages[0] ?? defaultAboutImages[0];
  const img1 = aboutImages[1] ?? defaultAboutImages[1];
  const img2 = aboutImages[2] ?? defaultAboutImages[2];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Terracotta accent bar — left edge */}
      <div className="absolute left-0 top-24 bottom-24 w-1 bg-gradient-to-b from-transparent via-terracotta-500 to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">

          {/* ── LEFT: Single portrait image ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[540px] hidden lg:block"
          >
            {/* Main image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={img0}
                alt="Tikinti mühəndisi"
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-charcoal-950/70 to-transparent" />
            </motion.div>

            {/* Decorative bracket — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="absolute -top-3 -right-3 w-14 h-14"
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-terracotta-500 rounded-full" />
              <div className="absolute top-0 right-0 w-1 h-full bg-terracotta-500 rounded-full" />
            </motion.div>

            {/* Decorative bracket — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-3 -left-3 w-14 h-14"
            >
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-500 rounded-full" />
              <div className="absolute bottom-0 left-0 w-1 h-full bg-gold-500 rounded-full" />
            </motion.div>

            {/* Experience badge — bottom right, overlapping image */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
              className="absolute bottom-6 right-6 bg-charcoal-950 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaHardHat className="text-white text-lg" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-terracotta-400 leading-none">
                  {achievements[0]?.number ?? '20+'}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-charcoal-400 mt-0.5">
                  {achievements[0]?.label ?? 'İllik Təcrübə'}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Personal content ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            {/* Label with line */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-px bg-terracotta-500" />
              <span className="text-terracotta-600 font-semibold text-xs tracking-[0.35em] uppercase">
                Haqqımda
              </span>
            </motion.div>

            {/* Name */}
            {companyName && (
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 }}
                className="text-5xl lg:text-6xl font-display font-bold text-charcoal-950 leading-tight"
              >
                {companyName}
              </motion.h2>
            )}

            {/* Role title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-terracotta-600 font-semibold tracking-widest text-sm uppercase"
            >
              İnşaat Mühəndisi
            </motion.p>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-charcoal-200" />

            {/* Heading / quote */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              className="text-xl font-display text-charcoal-700 leading-snug"
            >
              {aboutHeading}
            </motion.h3>

            {/* Bio paragraphs */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-charcoal-600 leading-relaxed"
            >
              {aboutText1}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.55 }}
              className="text-charcoal-600 leading-relaxed"
            >
              {aboutText2}
            </motion.p>

            {/* Core values — pill chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {coreValues.map((value, index) => (
                <motion.span
                  key={value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.65 + index * 0.07 }}
                  className="px-4 py-2 border border-charcoal-200 text-charcoal-700 text-sm font-semibold rounded-full hover:border-terracotta-500 hover:text-terracotta-600 hover:bg-terracotta-50 transition-all cursor-default"
                >
                  {value}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Achievement stats ── */}
        <div className="border-t border-charcoal-100 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {achievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] ?? FaAward;
              return (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="flex items-center gap-4 bg-charcoal-50 p-6 rounded-2xl border border-charcoal-100 hover:border-terracotta-200 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="text-terracotta-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-charcoal-950 leading-none">
                      {achievement.number}
                    </div>
                    <div className="text-xs text-charcoal-500 font-medium mt-1">{achievement.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
