// src/services/user.service.ts
import api from './api';
import { User } from '../types/user';

class UserService {
  async getUserByName(username: string): Promise<User> {
    const response = await api.get(`/user/${username}`);
    return response.data;
  }

  async deleteUser(username: string): Promise<void> {
    await api.delete(`/user/${username}`);
  }

  // Helper Methode um den aktuellen Username zu speichern
  setCurrentUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getCurrentUsername(): string | null {
    return localStorage.getItem('username');
  }
}

export default new UserService();