const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

class ApiClient {
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
      }
      let errorMessage = 'An error occurred';
      try {
        const errorData: ApiError = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        errorMessage = "Request failed with status " + response.status;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async register(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<{ message: string; user: User; access_token?: string }>(res);
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<{ message: string; user: User; access_token?: string }>(res);
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  async logout() {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await this.handleResponse<{ message: string }>(res);
    } finally {
      this.removeToken();
    }
  }

  async getMe(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<User>(res);
  }

  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<User[]>(res);
  }

  async getUserById(id: string): Promise<User> {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<User>(res);
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(res);
  }

  async deleteAccount(): Promise<{ message: string }> {
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await this.handleResponse<{ message: string }>(res);
    } finally {
      this.removeToken();
    }
  }
}

export const api = new ApiClient();
