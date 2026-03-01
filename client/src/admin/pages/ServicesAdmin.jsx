import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { api } from '../../api';
import ImageField from '../components/ImageField';

const empty = { title: '', description: '', imageUrl: '', order: 0, isActive: true };

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | service object
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  const load = () => {
    setLoadError('');
    api.getServicesAdmin().then(setServices).catch((e) => setLoadError(e.message));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setModal('add'); setError(''); };
  const openEdit = (s) => { setForm({ ...s }); setModal(s); setError(''); };
  const close = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (modal === 'add') await api.createService(form);
      else await api.updateService(modal.id, form);
      close();
      load();
    } catch {
      setError('Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (id, direction) => {
    await api.moveService(id, direction);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmək istədiyinizdən əminsiniz?')) return;
    await api.deleteService(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Xidmətlər</h1>
          <p className="text-charcoal-400 mt-1">Saytda göstərilən xidmətləri idarə edin</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-600 text-white rounded-xl font-semibold hover:bg-terracotta-700 transition-all">
          <FaPlus /> Yeni Xidmət
        </button>
      </div>

      {loadError && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700 text-red-400 rounded-xl text-sm">
          Xidmətlər yüklənmədi: {loadError}
        </div>
      )}

      <div className="grid gap-4">
        {services.map((s, index) => (
          <div key={s.id} className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-5 flex items-center gap-4">
            {/* Order arrows */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                onClick={() => handleMove(s.id, 'up')}
                disabled={index === 0}
                title="Yuxarı apar"
                className="p-1.5 bg-charcoal-800 text-charcoal-400 rounded-lg hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <FaArrowUp className="text-xs" />
              </button>
              <button
                onClick={() => handleMove(s.id, 'down')}
                disabled={index === services.length - 1}
                title="Aşağı apar"
                className="p-1.5 bg-charcoal-800 text-charcoal-400 rounded-lg hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <FaArrowDown className="text-xs" />
              </button>
            </div>
            <img src={s.imageUrl} alt={s.title} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{s.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive ? 'bg-green-900 text-green-400' : 'bg-charcoal-700 text-charcoal-400'}`}>
                  {s.isActive ? 'Aktiv' : 'Gizli'}
                </span>
              </div>
              <p className="text-charcoal-400 text-sm mt-1 truncate">{s.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(s)} className="p-2.5 bg-charcoal-800 text-charcoal-300 rounded-xl hover:text-white transition-colors">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(s.id)} className="p-2.5 bg-charcoal-800 text-charcoal-300 rounded-xl hover:text-red-400 transition-colors">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="text-center py-16 text-charcoal-500">Heç bir xidmət yoxdur</div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-charcoal-800">
              <h2 className="text-white font-display font-bold text-xl">
                {modal === 'add' ? 'Yeni Xidmət' : 'Xidməti Düzəlt'}
              </h2>
              <button onClick={close} className="text-charcoal-400 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <Field label="Başlıq" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Açıqlama" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea required />
              <ImageField label="Şəkil" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
              <Field label="Sıra (Order)" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: Number(v) })} />
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.isActive ? 'bg-terracotta-600' : 'bg-charcoal-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-charcoal-300 font-medium">Aktiv</span>
              </label>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={close} className="flex-1 py-3 bg-charcoal-800 text-charcoal-300 rounded-xl font-semibold hover:bg-charcoal-700 transition-all">Ləğv et</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-terracotta-600 text-white rounded-xl font-semibold hover:bg-terracotta-700 transition-all disabled:opacity-60">
                  {loading ? 'Saxlanılır...' : 'Saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', textarea, required }) {
  const cls = 'w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-xl focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-charcoal-600';
  return (
    <div>
      <label className="block text-charcoal-300 font-medium mb-1.5 text-sm">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={3} className={cls} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cls} />
      }
    </div>
  );
}
