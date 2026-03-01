import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHardHat, FaLock, FaUser } from 'react-icons/fa';
import { api } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.username);
      navigate('/admin');
    } catch {
      setError('İstifadəçi adı və ya şifrə yanlışdır.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaHardHat className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-charcoal-900 rounded-2xl p-8 shadow-2xl border border-charcoal-800 space-y-6">
          <div>
            <label className="block text-charcoal-300 font-semibold mb-2 text-sm">İstifadəçi adı</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full pl-11 pr-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-charcoal-600"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-charcoal-300 font-semibold mb-2 text-sm">Şifrə</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full pl-11 pr-4 py-3 bg-charcoal-800 border border-charcoal-700 text-white rounded-lg focus:border-terracotta-500 focus:outline-none transition-colors placeholder:text-charcoal-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-lg font-semibold text-lg hover:from-terracotta-600 hover:to-terracotta-700 transition-all disabled:opacity-60"
          >
            {loading ? 'Giriş edilir...' : 'Daxil ol'}
          </button>
        </form>

      </div>
    </div>
  );
}
