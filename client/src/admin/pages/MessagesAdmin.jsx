import { useState, useEffect } from 'react';
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaPhone, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa';
import { api } from '../../api';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  const load = () => api.getMessages().then(setMessages).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleOpen = async (msg) => {
    setSelected(msg);
    setMobileView('detail');
    if (!msg.isRead) {
      await api.markAsRead(msg.id);
      load();
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Bu mesajı silmək istədiyinizdən əminsiniz?')) return;
    await api.deleteMessage(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            Mesajlar
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-terracotta-600 text-white text-sm rounded-full font-semibold">
                {unreadCount} yeni
              </span>
            )}
          </h1>
          <p className="text-charcoal-400 mt-1">Əlaqə formasından gələn mesajlar</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
        {/* List */}
        <div className={`lg:col-span-2 overflow-y-auto space-y-2 ${mobileView === 'detail' ? 'hidden lg:block' : ''}`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpen(msg)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                selected?.id === msg.id
                  ? 'bg-terracotta-600/20 border-terracotta-600'
                  : msg.isRead
                  ? 'bg-charcoal-900 border-charcoal-800 hover:border-charcoal-700'
                  : 'bg-charcoal-900 border-charcoal-700 hover:border-charcoal-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {msg.isRead
                    ? <FaEnvelopeOpen className="text-charcoal-500 text-sm flex-shrink-0" />
                    : <FaEnvelope className="text-terracotta-400 text-sm flex-shrink-0" />
                  }
                  <span className={`font-semibold truncate ${msg.isRead ? 'text-charcoal-300' : 'text-white'}`}>
                    {msg.name}
                  </span>
                </div>
                <button onClick={(e) => handleDelete(msg.id, e)} className="text-charcoal-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <FaTrash className="text-xs" />
                </button>
              </div>
              <p className="text-charcoal-400 text-sm mt-1 truncate">{msg.message}</p>
              <p className="text-charcoal-600 text-xs mt-2">{formatDate(msg.submittedAt)}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-16 text-charcoal-500">Heç bir mesaj yoxdur</div>
          )}
        </div>

        {/* Detail */}
        <div className={`lg:col-span-3 bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 overflow-y-auto ${mobileView === 'list' ? 'hidden lg:block' : ''}`}>
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileView('list')} className="lg:hidden p-2 text-charcoal-400 hover:text-white transition-colors">
                    <FaArrowLeft />
                  </button>
                  <h2 className="text-white font-display font-bold text-xl">{selected.name}</h2>
                </div>
                <button onClick={(e) => handleDelete(selected.id, e)} className="p-2 text-charcoal-500 hover:text-red-400 transition-colors">
                  <FaTrash />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard icon={FaPhone} label="Telefon" value={selected.phone} href={`tel:${selected.phone}`} />
                <InfoCard icon={FaEnvelope} label="Email" value={selected.email} href={`mailto:${selected.email}`} />
                <InfoCard icon={FaTag} label="Xidmət" value={selected.service} />
                <InfoCard icon={FaUser} label="Tarix" value={formatDate(selected.submittedAt)} />
              </div>

              <div>
                <p className="text-charcoal-400 font-medium text-sm mb-2">Mesaj</p>
                <div className="bg-charcoal-800 rounded-xl p-4 text-charcoal-200 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              {selected.phone && (
                <a href={`tel:${selected.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-600 text-white rounded-xl font-semibold hover:bg-terracotta-700 transition-all">
                  <FaPhone /> Zəng et
                </a>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-charcoal-500">
              <div className="text-center">
                <FaEnvelope className="text-4xl mx-auto mb-3 opacity-30" />
                <p>Mesajı oxumaq üçün sol tərəfdən seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, href }) {
  const content = (
    <div className="bg-charcoal-800 rounded-xl p-4 flex items-center gap-3">
      <Icon className="text-terracotta-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-charcoal-500 text-xs">{label}</p>
        <p className="text-charcoal-200 font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
  return href && value ? <a href={href} className="hover:opacity-80 transition-opacity">{content}</a> : content;
}
