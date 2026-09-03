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
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
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
    return this.handleResponse<{ message: string; user: User }>(res);
  }

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string; user: User }>(res);
  }

  async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<{ message: string }>(res);
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
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<{ message: string }>(res);
  }
}

export const api = new ApiClient();
