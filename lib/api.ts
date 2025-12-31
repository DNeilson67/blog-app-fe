const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T>(endpoint: string, requireAuth: boolean = false): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(requireAuth),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }

  async post<T>(endpoint: string, body: any, requireAuth: boolean = false): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(requireAuth),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }

  async put<T>(endpoint: string, body: any, requireAuth: boolean = false): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(requireAuth),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }

  async delete<T>(endpoint: string, requireAuth: boolean = false): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(requireAuth),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
