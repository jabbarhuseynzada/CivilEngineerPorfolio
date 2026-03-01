import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHardHat, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaTelegram, FaInstagram } from 'react-icons/fa';
import { api } from '../api';

const iconMap  = { WhatsApp: FaWhatsapp, Telegram: FaTelegram, Instagram: FaInstagram };
const colorMap = { WhatsApp: 'hover:text-green-400', Telegram: 'hover:text-blue-400', Instagram: 'hover:text-pink-400' };

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [siteSettings,   setSiteSettings]   = useState(null);
  const [footerServices, setFooterServices] = useState([
    'Tam Ev Tikintisi', 'Elektrik İşləri', 'Ev Təmiri',
    'Rəngləmə İşləri', 'Təmir və Yenilənmə', 'Layihələndirmə',
  ]);

  useEffect(() => {
    api.getSiteSettings().then(setSiteSettings).catch(() => {});
    api.getServices()
      .then((svcs) => { if (svcs?.length) setFooterServices(svcs.map((s) => s.title)); })
      .catch(() => {});
  }, []);

  const quickLinks = [
    { name: 'Ana səhifə', href: '#hero' },
    { name: 'Xidmətlər',  href: '#services' },
    { name: 'Haqqımızda', href: '#about' },
    { name: 'Layihələr',  href: '#portfolio' },
    { name: 'Əlaqə',      href: '#contact' },
  ];

  const contactInfo        = siteSettings?.contactInfo     ?? { phone: '+994 XX XXX XX XX', email: 'info@tikinti.az', address: 'Bakı, Azərbaycan' };
  const socialLinks        = siteSettings?.socialLinks     ?? [{ platform: 'WhatsApp', url: '#' }, { platform: 'Telegram', url: '#' }, { platform: 'Instagram', url: '#' }];
  const companyName        = siteSettings?.companyName     ?? '';
  const companyDescription = siteSettings?.companyDescription ?? '';

  const scrollToSection = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-gradient-to-b from-charcoal-900 to-charcoal-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-lg flex items-center justify-center">
                <FaHardHat className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">{companyName}</h3>
                <p className="text-xs text-charcoal-400 font-medium tracking-wider">PEŞƏKARİYETLƏ TİKİNTİ</p>
              </div>
            </motion.div>

            <p className="text-charcoal-400 mb-6 leading-relaxed">{companyDescription}</p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon  = iconMap[social.platform]  ?? FaWhatsapp;
                const color = colorMap[social.platform] ?? 'hover:text-white';
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    className={`w-10 h-10 bg-charcoal-800 rounded-lg flex items-center justify-center transition-colors ${color}`}
                  >
                    <Icon className="text-lg" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-6">Sürətli Keçidlər</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-charcoal-400 hover:text-terracotta-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-terracotta-400 group-hover:w-4 transition-all"></span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-6">Xidmətlər</h3>
            <ul className="space-y-3">
              {footerServices.map((service) => (
                <li key={service}>
                  <span className="text-charcoal-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-6">Əlaqə</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-charcoal-400">
                <FaPhone className="text-terracotta-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-charcoal-500">Telefon</p>
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-terracotta-400 transition-colors">{contactInfo.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-charcoal-400">
                <FaEnvelope className="text-gold-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-charcoal-500">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-gold-400 transition-colors">{contactInfo.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-charcoal-400">
                <FaMapMarkerAlt className="text-terracotta-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-charcoal-500">Ünvan</p>
                  <p>{contactInfo.address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-charcoal-400 text-sm text-center md:text-left">
              © {currentYear} {companyName}. Bütün hüquqlar qorunur.
            </p>
            <a href="https://github.com/jabbarhuseynzada" target="_blank" rel="noopener noreferrer"
              className="text-charcoal-500 hover:text-terracotta-400 transition-colors text-sm">
              Made by Jabbar H.
            </a>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-terracotta-500 via-gold-500 to-terracotta-500"></div>
    </footer>
  );
};

export default Footer;
