export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://a11-food-sharing-server-three.vercel.app';

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}), ...authHeaders() },
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const error = new Error(errBody.message || `GET ${path} failed`);
    error.status = res.status;
    error.data = errBody;
    throw error;
  }
  return res.json();
}

export async function apiRequest(path, { method = 'POST', body, headers } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers, ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const error = new Error(errBody.message || `${method} ${path} failed`);
    error.status = res.status;
    error.data = errBody;
    throw error;
  }
  return res.json();
}