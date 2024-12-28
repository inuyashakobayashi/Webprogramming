import { PollBody,  PollResult, Statistics, Vote, VoteResult } from '@/types/poll';
import { fetchApi } from './api';

class PollService {
  // Pollack (ohne Auth) Operationen
  async createPollLack(pollData: PollBody): Promise<PollResult> {
    return fetchApi<PollResult>('/poll/lack', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  }

  async getPollLackStatistics(token: string): Promise<Statistics> {
    return fetchApi<Statistics>(`/poll/lack/${token}`);
  }

  async updatePollLack(token: string, pollData: PollBody): Promise<void> {
    return fetchApi<void>(`/poll/lack/${token}`, {
      method: 'PUT',
      body: JSON.stringify(pollData),
    });
  }

  async deletePollLack(token: string): Promise<void> {
    return fetchApi<void>(`/poll/lack/${token}`, {
      method: 'DELETE',
    });
  }

  // Pollock (mit Auth) Operationen
  async createPollLock(pollData: PollBody): Promise<PollResult> {
    return fetchApi<PollResult>('/poll/lock', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  }

  async getPollLockStatistics(token: string): Promise<Statistics> {
    return fetchApi<Statistics>(`/poll/lock/${token}`);
  }

  async updatePollLock(token: string, pollData: PollBody): Promise<void> {
    return fetchApi<void>(`/poll/lock/${token}`, {
      method: 'PUT',
      body: JSON.stringify(pollData),
    });
  }

  async deletePollLock(token: string): Promise<void> {
    return fetchApi<void>(`/poll/lock/${token}`, {
      method: 'DELETE',
    });
  }

  // Vote Operationen
  async submitVote(token: string, vote: Vote, isLocked: boolean = false): Promise<VoteResult> {
    const endpoint = isLocked ? `/vote/lock/${token}` : `/vote/lack/${token}`;
    return fetchApi<VoteResult>(endpoint, {
      method: 'POST',
      body: JSON.stringify(vote),
    });
  }

  async getVote(token: string, isLocked: boolean = false): Promise<Vote> {
    const endpoint = isLocked ? `/vote/lock/${token}` : `/vote/lack/${token}`;
    return fetchApi<Vote>(endpoint);
  }
}

export const pollService = new PollService();
export default pollService;