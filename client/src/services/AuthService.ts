import { Registration, User } from '@/types/poll';
import { fetchApi } from './api';

interface ApiKeyResponse {
  ApiKey: string;
}

class AuthService {
  async register(data: Registration): Promise<string> {
    try {
      console.log('Registering user:', data);
      const result = await fetchApi<ApiKeyResponse>('/user', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          password: data.password
        })
      });
      console.log('Registration result:', result);
      
      // Extrahiere den API-Key aus der Response
      const apiKey = result.ApiKey;
      if (apiKey) {
        localStorage.setItem('auth-token', apiKey);
      }
      return apiKey;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: Registration): Promise<string> {
    try {
      console.log('Logging in user:', data.name);
      const result = await fetchApi<ApiKeyResponse>('/user/key', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          password: data.password
        })
      });
      console.log('Login result:', result);
      
      const apiKey = result.ApiKey;
      if (apiKey) {
        localStorage.setItem('auth-token', apiKey);
      }
      return apiKey;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getUser(username: string): Promise<User> {
    try {
      return await fetchApi<User>(`/user/${username}`);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('auth-token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth-token');
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('auth-token');
  }
}

export const authService = new AuthService();
export default authService;