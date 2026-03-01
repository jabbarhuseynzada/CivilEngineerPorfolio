import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { api } from '../../api';
import ImageField from '../components/ImageField';

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    api.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      await api.updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <div className="text-charcoal-400 text-center py-20">Yüklənir...</div>;

  const tabs = [
    { id: 'company',      label: 'Şirkət' },
    { id: 'images',       label: 'Şəkillər' },
    { id: 'stats',        label: 'Statistika' },
    { id: 'achievements', label: 'Nailiyyətlər' },
    { id: 'contact',      label: 'Əlaqə' },
    { id: 'hours',        label: 'İş Saatları' },
    { id: 'social',       label: 'Sosial' },
  ];

  // helpers for heroImages / aboutImages arrays
  const setHeroImage = (i, val) => {
    const arr = [...(settings.heroImages ?? [])];
    arr[i] = val;
    setSettings({ ...settings, heroImages: arr });
  };
  const setAboutImage = (i, val) => {
    const arr = [...(settings.aboutImages ?? [])];
    arr[i] = val;
    setSettings({ ...settings, aboutImages: arr });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Sayt Ayarları</h1>
          <p className="text-charcoal-400 mt-1">Saytın məlumatlarını idarə edin</p>
        </div>
        <button onClick={save} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-600 text-white rounded-xl font-semibold hover:bg-terracotta-700 transition-all disabled:opacity-60">
          <FaSave /> {saved ? 'Saxlanıldı ✓' : loading ? 'Saxlanılır...' : 'Saxla'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${activeTab === t.id ? 'bg-terracotta-600 text-white' : 'bg-charcoal-900 text-charcoal-400 hover:text-white border border-charcoal-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6">

        {/* ── Company ───────────────────────────────────────────────────── */}
        {activeTab === 'company' && (
          <div className="space-y-5">
            <h2 className="text-white font-display font-bold text-lg mb-4">Şirkət Məlumatları</h2>
            <Field label="Şirkət Adı" value={settings.companyName} onChange={(v) => setSettings({ ...settings, companyName: v })} />
            <Field label="Şirkət Haqqında (Footer)" value={settings.companyDescription} onChange={(v) => setSettings({ ...settings, companyDescription: v })} textarea />

            <hr className="border-charcoal-800" />
            <h3 className="text-white font-semibold">Açılış Bölməsi <span className="text-charcoal-500 font-normal text-sm">(sayta girəndə ilk görünən hissə)</span></h3>
            <Field label="Üst Kiçik Yazı" value={settings.heroTagline ?? ''} onChange={(v) => setSettings({ ...settings, heroTagline: v })} placeholder="Professional Tikinti Xidmətləri" />
            <Field label="Böyük Başlıq" value={settings.heroTitle ?? ''} onChange={(v) => setSettings({ ...settings, heroTitle: v })} />
            <Field label="Açıqlama Mətni" value={settings.heroSubtitle ?? ''} onChange={(v) => setSettings({ ...settings, heroSubtitle: v })} textarea />

            <hr className="border-charcoal-800" />
            <h3 className="text-white font-semibold">Haqqımızda Bölməsi</h3>
            <Field label="Bölmə Başlığı" value={settings.aboutHeading ?? ''} onChange={(v) => setSettings({ ...settings, aboutHeading: v })} />
            <Field label="Haqqımızda Mətn 1" value={settings.aboutText1} onChange={(v) => setSettings({ ...settings, aboutText1: v })} textarea />
            <Field label="Haqqımızda Mətn 2" value={settings.aboutText2} onChange={(v) => setSettings({ ...settings, aboutText2: v })} textarea />

            <div>
              <label className="block text-charcoal-300 font-medium mb-2 text-sm">Əsas Dəyərlər</label>
              <div className="space-y-2">
                {settings.coreValues.map((val, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={val} onChange={(e) => {
                      const arr = [...settings.coreValues]; arr[i] = e.target.value;
                      setSettings({ ...settings, coreValues: arr });
                    }} className={inputCls} />
                    <button onClick={() => {
                      const arr = settings.coreValues.filter((_, idx) => idx !== i);
                      setSettings({ ...settings, coreValues: arr });
                    }} className="p-2.5 bg-charcoal-800 text-charcoal-400 rounded-xl hover:text-red-400 transition-colors">
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setSettings({ ...settings, coreValues: [...settings.coreValues, ''] })}
                  className="flex items-center gap-2 text-terracotta-400 hover:text-terracotta-300 text-sm font-medium mt-2">
                  <FaPlus className="text-xs" /> Əlavə et
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Images ────────────────────────────────────────────────────── */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-white font-display font-bold text-lg mb-1">Açılış Şəkilləri</h2>
              <p className="text-charcoal-500 text-sm mb-4">Sayta girəndə ilk görünən bölmənin sağ tərəfindəki şəkillər</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <ImageField label="Şəkil 1 — sağ üst"
                  value={(settings.heroImages ?? [])[0] ?? ''}
                  onChange={(v) => setHeroImage(0, v)} />
                <ImageField label="Şəkil 2 — sağ alt"
                  value={(settings.heroImages ?? [])[1] ?? ''}
                  onChange={(v) => setHeroImage(1, v)} />
              </div>
            </div>

            <hr className="border-charcoal-800" />

            <div>
              <h2 className="text-white font-display font-bold text-lg mb-1">Haqqımızda Şəkilləri</h2>
              <p className="text-charcoal-500 text-sm mb-4">«Haqqımızda» bölməsinin sol tərəfindəki şəkillər</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <ImageField label="Haqqımızda Şəkil 1 (sol üst)"
                  value={(settings.aboutImages ?? [])[0] ?? ''}
                  onChange={(v) => setAboutImage(0, v)} />
                <ImageField label="Haqqımızda Şəkil 2 (sağ alt)"
                  value={(settings.aboutImages ?? [])[1] ?? ''}
                  onChange={(v) => setAboutImage(1, v)} />
                <ImageField label="Haqqımızda Şəkil 3 (kiçik orta)"
                  value={(settings.aboutImages ?? [])[2] ?? ''}
                  onChange={(v) => setAboutImage(2, v)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-white font-display font-bold text-lg mb-1">Rəqəmsal Göstəricilər</h2>
            <p className="text-charcoal-500 text-sm mb-4">Açılış bölməsindəki say məlumatları (məs: 20+ il, 500+ layihə)</p>
            <div className="space-y-3">
              {settings.stats.map((stat, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input value={stat.value} placeholder="20+" onChange={(e) => {
                    const arr = [...settings.stats]; arr[i] = { ...arr[i], value: e.target.value };
                    setSettings({ ...settings, stats: arr });
                  }} className={`${inputCls} w-32`} />
                  <input value={stat.label} placeholder="İl Təcrübə" onChange={(e) => {
                    const arr = [...settings.stats]; arr[i] = { ...arr[i], label: e.target.value };
                    setSettings({ ...settings, stats: arr });
                  }} className={inputCls} />
                  <button onClick={() => setSettings({ ...settings, stats: settings.stats.filter((_, idx) => idx !== i) })}
                    className="p-2.5 bg-charcoal-800 text-charcoal-400 rounded-xl hover:text-red-400 transition-colors flex-shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
              <button onClick={() => setSettings({ ...settings, stats: [...settings.stats, { value: '', label: '' }] })}
                className="flex items-center gap-2 text-terracotta-400 hover:text-terracotta-300 text-sm font-medium mt-2">
                <FaPlus className="text-xs" /> Əlavə et
              </button>
            </div>
          </div>
        )}

        {/* ── Achievements ──────────────────────────────────────────────── */}
        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-white font-display font-bold text-lg mb-4">Nailiyyətlər (Haqqımızda bölməsi)</h2>
            <div className="space-y-3">
              {settings.achievements.map((ach, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input value={ach.number} placeholder="20+" onChange={(e) => {
                    const arr = [...settings.achievements]; arr[i] = { ...arr[i], number: e.target.value };
                    setSettings({ ...settings, achievements: arr });
                  }} className={`${inputCls} w-28`} />
                  <input value={ach.label} placeholder="İllik Təcrübə" onChange={(e) => {
                    const arr = [...settings.achievements]; arr[i] = { ...arr[i], label: e.target.value };
                    setSettings({ ...settings, achievements: arr });
                  }} className={inputCls} />
                  <button onClick={() => setSettings({ ...settings, achievements: settings.achievements.filter((_, idx) => idx !== i) })}
                    className="p-2.5 bg-charcoal-800 text-charcoal-400 rounded-xl hover:text-red-400 transition-colors flex-shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
              <button onClick={() => setSettings({ ...settings, achievements: [...settings.achievements, { number: '', label: '', icon: 'FaAward' }] })}
                className="flex items-center gap-2 text-terracotta-400 hover:text-terracotta-300 text-sm font-medium mt-2">
                <FaPlus className="text-xs" /> Əlavə et
              </button>
            </div>
          </div>
        )}

        {/* ── Contact ───────────────────────────────────────────────────── */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="text-white font-display font-bold text-lg mb-4">Əlaqə Məlumatları</h2>
            <Field label="Telefon" value={settings.contactInfo.phone} onChange={(v) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: v } })} />
            <Field label="WhatsApp" value={settings.contactInfo.whatsApp} onChange={(v) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, whatsApp: v } })} />
            <Field label="Email" value={settings.contactInfo.email} onChange={(v) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: v } })} />
            <Field label="Ünvan" value={settings.contactInfo.address} onChange={(v) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: v } })} />
          </div>
        )}

        {/* ── Working Hours ─────────────────────────────────────────────── */}
        {activeTab === 'hours' && (
          <div>
            <h2 className="text-white font-display font-bold text-lg mb-4">İş Saatları</h2>
            <div className="space-y-3">
              {settings.workingHours.map((wh, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input value={wh.days} placeholder="Bazar ertəsi - Cümə" onChange={(e) => {
                    const arr = [...settings.workingHours]; arr[i] = { ...arr[i], days: e.target.value };
                    setSettings({ ...settings, workingHours: arr });
                  }} className={inputCls} />
                  <input value={wh.hours} placeholder="09:00 - 18:00" onChange={(e) => {
                    const arr = [...settings.workingHours]; arr[i] = { ...arr[i], hours: e.target.value };
                    setSettings({ ...settings, workingHours: arr });
                  }} className={`${inputCls} w-40`} />
                  <button onClick={() => setSettings({ ...settings, workingHours: settings.workingHours.filter((_, idx) => idx !== i) })}
                    className="p-2.5 bg-charcoal-800 text-charcoal-400 rounded-xl hover:text-red-400 transition-colors flex-shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
              <button onClick={() => setSettings({ ...settings, workingHours: [...settings.workingHours, { days: '', hours: '', isWorkingDay: true }] })}
                className="flex items-center gap-2 text-terracotta-400 hover:text-terracotta-300 text-sm font-medium mt-2">
                <FaPlus className="text-xs" /> Əlavə et
              </button>
            </div>
          </div>
        )}

        {/* ── Social ────────────────────────────────────────────────────── */}
        {activeTab === 'social' && (
          <div>
            <h2 className="text-white font-display font-bold text-lg mb-4">Sosial Şəbəkələr</h2>
            <div className="space-y-3">
              {settings.socialLinks.map((sl, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input value={sl.platform} placeholder="WhatsApp" onChange={(e) => {
                    const arr = [...settings.socialLinks]; arr[i] = { ...arr[i], platform: e.target.value };
                    setSettings({ ...settings, socialLinks: arr });
                  }} className={`${inputCls} w-36`} />
                  <input value={sl.url} placeholder="https://..." onChange={(e) => {
                    const arr = [...settings.socialLinks]; arr[i] = { ...arr[i], url: e.target.value };
                    setSettings({ ...settings, socialLinks: arr });
                  }} className={inputCls} />
                  <button onClick={() => setSettings({ ...settings, socialLinks: settings.socialLinks.filter((_, idx) => idx !== i) })}
                    className="p-2.5 bg-charcoal-800 text-charcoal-400 rounded-xl hover:text-red-400 transition-colors flex-shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
              <button onClick={() => setSettings({ ...settings, socialLinks: [...settings.socialLinks, { platform: '', url: '' }] })}
                className="flex items-center gap-2 text-terracotta-400 hover:text-terracotta-300 text-sm font-medium mt-2">
                <FaPlus className="text-xs" /> Əlavə et
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputCls = 'flex-1 px-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-xl focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-charcoal-600';

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <div>
      <label className="block text-charcoal-300 font-medium mb-1.5 text-sm">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className={`${inputCls} w-full resize-none`} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} w-full`} />
      }
    </div>
  );
}
