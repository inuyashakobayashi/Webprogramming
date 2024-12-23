// src/services/auth.service.ts
import api from './api';
import { Registration, User } from '../types/user';

class AuthService {
  async login(credentials: Registration): Promise<string> {
    const response = await api.post('/user/key', credentials);
    const apiKey = response.data;
    localStorage.setItem('api_key', apiKey);
    return apiKey;
  }

  async register(userData: Registration): Promise<string> {
    const response = await api.post('/user', userData);
    const apiKey = response.data;
    localStorage.setItem('api_key', apiKey);
    return apiKey;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Wir müssen den Username aus dem localStorage oder Context holen
      const username = localStorage.getItem('username');
      if (!username) return null;
      
      const response = await api.get(`/user/${username}`);
      return response.data;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('api_key');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('api_key');
  }
}

export default new AuthService();