export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function authHeaders() {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Public
  getServices: () => apiFetch('/api/services'),
  getProjects: (category) => apiFetch(`/api/projects${category ? `?category=${category}` : ''}`),
  getSiteSettings: () => apiFetch('/api/site-settings'),
  submitContact: (data) => apiFetch('/api/contact-messages', { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  login: (credentials) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  // Admin — Services
  getServicesAdmin: () => apiFetch('/api/services/all'),
  createService: (data) => apiFetch('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => apiFetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  moveService: (id, direction) => apiFetch(`/api/services/${id}/move`, { method: 'PATCH', body: JSON.stringify({ direction }) }),
  deleteService: (id) => apiFetch(`/api/services/${id}`, { method: 'DELETE' }),

  // Admin — Projects
  getProjectsAdmin: () => apiFetch('/api/projects'),
  createProject: (data) => apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => apiFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => apiFetch(`/api/projects/${id}`, { method: 'DELETE' }),

  // Admin — Messages
  getMessages: () => apiFetch('/api/contact-messages'),
  getUnreadCount: () => apiFetch('/api/contact-messages/unread-count'),
  markAsRead: (id) => apiFetch(`/api/contact-messages/${id}/read`, { method: 'PATCH' }),
  deleteMessage: (id) => apiFetch(`/api/contact-messages/${id}`, { method: 'DELETE' }),

  // Admin — Site Settings
  updateSiteSettings: (data) => apiFetch('/api/site-settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin — Image Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
