import { getStoredToken, removeToken, isTokenExpired } from './tokenUtils';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Event emitter for session expiration
let sessionExpiredCallback: (() => void) | null = null;

export const setSessionExpiredCallback = (callback: () => void) => {
  sessionExpiredCallback = callback;
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getStoredToken();
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Check if token is expired before making request
  if (token && isTokenExpired(token)) {
    removeToken();
    if (sessionExpiredCallback) {
      sessionExpiredCallback();
    }
    throw new Error('Session expired. Please login again.');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      removeToken();
      if (sessionExpiredCallback) {
        sessionExpiredCallback();
      }
      const error = await response.json().catch(() => ({ error: 'Session expired' }));
      throw new Error(error.error || 'Session expired. Please login again.');
    }

    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: async (email: string, password: string, name: string) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email: string, password: string) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return fetchWithAuth('/auth/me');
  },

  updateProfile: async (name: string, profilePicture?: string) => {
    return fetchWithAuth('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, profilePicture }),
    });
  },
};

// Posts API
export const postsApi = {
  getAll: async () => {
    return fetchWithAuth('/posts');
  },

  getById: async (id: string) => {
    return fetchWithAuth(`/posts/${id}`);
  },

  create: async (data: { title: string; content: string; excerpt?: string; category?: string }) => {
    return fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { title?: string; content?: string; excerpt?: string; category?: string }) => {
    return fetchWithAuth(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Comments API
export const commentsApi = {
  getByPostId: async (postId: string) => {
    return fetchWithAuth(`/posts/${postId}/comments`);
  },

  create: async (postId: string, content: string) => {
    return fetchWithAuth(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  update: async (id: string, content: string) => {
    return fetchWithAuth(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`/comments/${id}`, {
      method: 'DELETE',
    });
  },
};
