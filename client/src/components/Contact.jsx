import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaTelegram, FaInstagram } from 'react-icons/fa';
import { api } from '../api';

const iconMap = { WhatsApp: FaWhatsapp, Telegram: FaTelegram, Instagram: FaInstagram };
const colorMap = { WhatsApp: 'from-green-500 to-green-600', Telegram: 'from-blue-500 to-blue-600', Instagram: 'from-pink-500 to-purple-600' };

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    api.getSiteSettings().then(setSiteSettings).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      await api.submitContact(formData);
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', email: '', service: '', message: '' });
    } catch {
      setSubmitStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = siteSettings?.contactInfo ?? {
    phone: '+994 XX XXX XX XX',
    whatsApp: '+994 XX XXX XX XX',
    email: 'info@tikinti.az',
    address: 'Bakı, Azərbaycan',
  };

  const workingHours = siteSettings?.workingHours ?? [
    { days: 'Bazar ertəsi - Cümə', hours: '09:00 - 18:00', isWorkingDay: true },
    { days: 'Şənbə', hours: '10:00 - 15:00', isWorkingDay: true },
    { days: 'Bazar', hours: 'Qeyri-iş günü', isWorkingDay: false },
  ];

  const socialLinks = siteSettings?.socialLinks ?? [
    { platform: 'WhatsApp', url: '#' },
    { platform: 'Telegram', url: '#' },
    { platform: 'Instagram', url: '#' },
  ];

  const contactCards = [
    { Icon: FaPhone, title: 'Telefon', value: contactInfo.phone, link: `tel:${contactInfo.phone}`, color: 'from-terracotta-500 to-terracotta-600' },
    { Icon: FaWhatsapp, title: 'WhatsApp', value: contactInfo.whatsApp, link: `https://wa.me/${contactInfo.whatsApp?.replace(/\D/g, '')}`, color: 'from-green-500 to-green-600' },
    { Icon: FaEnvelope, title: 'Email', value: contactInfo.email, link: `mailto:${contactInfo.email}`, color: 'from-gold-500 to-gold-600' },
    { Icon: FaMapMarkerAlt, title: 'Ünvan', value: contactInfo.address, link: '#', color: 'from-charcoal-600 to-charcoal-700' },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-charcoal-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-terracotta-100 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gold-100 rounded-full filter blur-3xl opacity-20"></div>

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
            className="text-terracotta-500 font-semibold text-sm tracking-[0.3em] uppercase mb-4"
          >
            Əlaqə
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal-950 mb-6">
            Bizimlə{' '}
            <span className="text-gradient">Əlaqə Saxlayın</span>
          </h2>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Layihənizi müzakirə etmək üçün bizimlə əlaqə saxlayın. Pulsuz məsləhət və qiymət təklifi əldə edin.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2">Adınız <span className="text-terracotta-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors"
                  placeholder="Adınızı daxil edin" />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2">Telefon <span className="text-terracotta-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors"
                  placeholder="+994 XX XXX XX XX" />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors"
                  placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2">Xidmət növü <span className="text-terracotta-500">*</span></label>
                <select name="service" value={formData.service} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors">
                  <option value="">Xidmət seçin</option>
                  <option value="ev-tikintisi">Tam Ev Tikintisi</option>
                  <option value="elektrik">Elektrik İşləri</option>
                  <option value="temir">Ev Təmiri</option>
                  <option value="rengleme">Rəngləmə İşləri</option>
                  <option value="yenileme">Təmir və Yenilənmə</option>
                  <option value="layihe">Layihələndirmə</option>
                </select>
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2">Mesajınız <span className="text-terracotta-500">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                  className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors resize-none"
                  placeholder="Layihəniz haqqında qısa məlumat verin..."></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Mesajınız göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitStatus === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
              >
                {submitStatus === 'loading' ? 'Göndərilir...' : 'Mesaj Göndər'}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {contactCards.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <info.Icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-display font-bold text-charcoal-950 mb-2">{info.title}</h3>
                  <p className="text-charcoal-600">{info.value}</p>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-display font-bold mb-6">İş Saatları</h3>
              <div className="space-y-3">
                {workingHours.map((wh, i) => (
                  <div key={i} className={`flex justify-between items-center pb-3 ${i < workingHours.length - 1 ? 'border-b border-white/20' : ''}`}>
                    <span className="font-semibold">{wh.days}</span>
                    <span>{wh.hours}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm opacity-90">📞 Təcili hallar üçün 24/7 əlaqə mümkündür</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-display font-bold text-charcoal-950 mb-6">Sosial Şəbəkələr</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = iconMap[social.platform] ?? FaPhone;
                  const hoverColor = social.platform === 'WhatsApp' ? 'hover:bg-green-500' : social.platform === 'Telegram' ? 'hover:bg-blue-500' : 'hover:bg-pink-500';
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className={`w-14 h-14 bg-charcoal-100 rounded-xl flex items-center justify-center transition-all ${hoverColor} hover:text-white`}
                    >
                      <Icon className="text-2xl" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
