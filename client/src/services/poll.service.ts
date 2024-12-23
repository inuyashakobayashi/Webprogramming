// src/services/poll.service.ts
import api from './api';
import { Poll, PollBody, PollResult, Statistics } from '../types/poll';

class PollService {
  // Erstellen eines neuen Polls (mit Auth)
  async createPoll(pollData: PollBody & { owner: string }): Promise<PollResult> {
    const response = await api.post('/poll/lock', pollData);
    return response.data;
  }

  // Erstellen eines öffentlichen Polls (ohne Auth)
  async createPublicPoll(pollData: PollBody): Promise<PollResult> {
    const response = await api.post('/poll/lack', pollData);
    return response.data;
  }

  // Poll Details abrufen
  async getPollDetails(token: string, isPublic: boolean = false): Promise<Statistics> {
    const endpoint = isPublic ? `/poll/lack/${token}` : `/poll/lock/${token}`;
    const response = await api.get(endpoint);
    return response.data;
  }

  // Poll aktualisieren
  async updatePoll(token: string, pollData: PollBody, isPublic: boolean = false): Promise<void> {
    const endpoint = isPublic ? `/poll/lack/${token}` : `/poll/lock/${token}`;
    await api.put(endpoint, pollData);
  }

  // Poll löschen
  async deletePoll(token: string, isPublic: boolean = false): Promise<void> {
    const endpoint = isPublic ? `/poll/lack/${token}` : `/poll/lock/${token}`;
    await api.delete(endpoint);
  }

  // Helper Methode um zu prüfen ob ein Poll öffentlich ist
  isPublicPoll(poll: Poll): boolean {
    return poll.security?.visibility === 'lack';
  }
}

export default new PollService();