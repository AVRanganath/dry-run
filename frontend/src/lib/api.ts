const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function request(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  } catch (e) {
    throw new Error('Cannot connect to server. Make sure the backend is running.');
  }
  
  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined' && !url.includes('/auth/')) {
      window.location.href = '/login';
    }
    throw new Error('Invalid credentials');
  }
  
  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const err = await res.json();
        // Handle Laravel validation errors
        if (err.errors) {
          const messages = Object.values(err.errors).flat();
          errMsg = (messages as string[]).join('. ');
        } else {
          errMsg = err.message || errMsg;
        }
      }
    } catch {}
    throw new Error(errMsg);
  }
  
  return res.json();
}

export const api = {
  // Auth
  register: (data: {name: string, email: string, password: string, password_confirmation: string}) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: {email: string, password: string}) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getUser: () => request('/auth/user'),
  
  // Sessions
  getSessions: () => request('/sessions'),
  createSession: (data: {job_description: string, resume_text: string}) =>
    request('/sessions', { method: 'POST', body: JSON.stringify(data) }),
  getSession: (id: string | number) => request(`/sessions/${id}`),
  
  // Questions  
  submitAnswer: (questionId: number, data: {answer_text: string}) =>
    request(`/questions/${questionId}/answer`, { method: 'POST', body: JSON.stringify(data) }),
  
  // Analytics
  getAnalytics: () => request('/analytics/progress'),
};

export function setAuthData(token: string, user: any) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
