import { useState, useRef } from 'react';
import { FaLink, FaUpload, FaSpinner } from 'react-icons/fa';
import { api } from '../../api';

const inputCls = 'w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-xl focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-charcoal-600';

export default function ImageField({ label, value, onChange }) {
  const [tab, setTab] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
      setTab('url');
    } catch {
      setError('Yükləmə uğursuz oldu.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label className="block text-charcoal-300 font-medium mb-1.5 text-sm">{label}</label>}

      <div className="flex gap-1 mb-2 bg-charcoal-800 rounded-xl p-1 w-fit">
        <button type="button" onClick={() => setTab('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'url' ? 'bg-charcoal-700 text-white' : 'text-charcoal-400 hover:text-white'}`}>
          <FaLink className="text-xs" /> URL
        </button>
        <button type="button" onClick={() => setTab('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'upload' ? 'bg-charcoal-700 text-white' : 'text-charcoal-400 hover:text-white'}`}>
          <FaUpload className="text-xs" /> Yüklə
        </button>
      </div>

      {tab === 'url' ? (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className={inputCls} placeholder="https://..." />
      ) : (
        <div className="relative">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} disabled={uploading}
            className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 text-charcoal-300 rounded-xl cursor-pointer disabled:opacity-60 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-charcoal-700 file:text-charcoal-300 file:text-xs" />
          {uploading && (
            <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta-400 animate-spin" />
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      {value && (
        <div className="mt-2 rounded-xl overflow-hidden h-20 bg-charcoal-800 border border-charcoal-700">
          <img src={value} alt="" className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}
