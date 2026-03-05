const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

async function apiFetch<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  
  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, params?: Record<string, string>) => 
    apiFetch<T>(endpoint, { method: 'GET', params }),
  
  post: <T = unknown>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  
  put: <T = unknown>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  
  delete: <T = unknown>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: 'DELETE' }),

  del: <T = unknown>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: 'DELETE' }),
};

export default api;
