const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // In a real app, you would retrieve this from cookies or local storage.
  // For SSR, cookies are best.
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = new Headers(options.headers || {});
  
  // Don't set Content-Type if body is FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Bypass localtunnel warning page for API requests
  headers.set('Bypass-Tunnel-Reminder', 'true');


  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Unauthorized request, clearing token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    const error: any = new Error(data?.message || 'API request failed');
    error.response = { data };
    error.status = response.status;
    throw error;
  }

  return data;
}
