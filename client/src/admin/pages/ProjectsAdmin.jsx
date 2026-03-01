import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../../api';
import ImageField from '../components/ImageField';

const categories = [
  { id: 'ev', name: 'Ev Tikintisi' },
  { id: 'temir', name: 'Təmir İşləri' },
  { id: 'elektrik', name: 'Elektrik' },
];

const empty = { title: '', category: 'ev', location: '', date: '', area: '', description: '', imageUrl: '' };

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.getProjectsAdmin().then(setProjects).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setModal('add'); setError(''); };
  const openEdit = (p) => { setForm({ ...p }); setModal(p); setError(''); };
  const close = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (modal === 'add') await api.createProject(form);
      else await api.updateProject(modal.id, form);
      close();
      load();
    } catch {
      setError('Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmək istədiyinizdən əminsiniz?')) return;
    await api.deleteProject(id);
    load();
  };

  const catName = (id) => categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Layihələr</h1>
          <p className="text-charcoal-400 mt-1">Portfolio layihələrini idarə edin</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-600 text-white rounded-xl font-semibold hover:bg-terracotta-700 transition-all">
          <FaPlus /> Yeni Layihə
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-5 flex items-center gap-4">
            <img src={p.imageUrl} alt={p.title} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{p.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-charcoal-700 text-charcoal-300">{catName(p.category)}</span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-charcoal-400 text-sm"><FaMapMarkerAlt className="text-xs" />{p.location}</span>
                <span className="text-charcoal-400 text-sm">{p.date}</span>
                <span className="text-charcoal-400 text-sm">{p.area}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="p-2.5 bg-charcoal-800 text-charcoal-300 rounded-xl hover:text-white transition-colors">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-charcoal-800 text-charcoal-300 rounded-xl hover:text-red-400 transition-colors">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-16 text-charcoal-500">Heç bir layihə yoxdur</div>
        )}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-charcoal-800 sticky top-0 bg-charcoal-900">
              <h2 className="text-white font-display font-bold text-xl">
                {modal === 'add' ? 'Yeni Layihə' : 'Layihəni Düzəlt'}
              </h2>
              <button onClick={close} className="text-charcoal-400 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <Field label="Başlıq" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <div>
                <label className="block text-charcoal-300 font-medium mb-1.5 text-sm">Kateqoriya</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-xl focus:border-terracotta-500 focus:outline-none transition-colors">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Yer" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
                <Field label="Tarix" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="2024" />
              </div>
              <Field label="Sahə" value={form.area} onChange={(v) => setForm({ ...form, area: v })} placeholder="250 m²" />
              <Field label="Açıqlama" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
              <ImageField label="Şəkil" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
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

function Field({ label, value, onChange, type = 'text', textarea, required, placeholder }) {
  const cls = 'w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-xl focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-charcoal-600';
  return (
    <div>
      <label className="block text-charcoal-300 font-medium mb-1.5 text-sm">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={3} placeholder={placeholder} className={cls} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}
