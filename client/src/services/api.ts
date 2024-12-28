import axios from 'axios';

const API_URL = 'http://localhost:3000'; // oder Ihre API-URL

// Interfaces basierend auf der OpenAPI-Spec
interface PollBody {
  title: string;
  description?: string;
  options: { id: number; text: string; }[];
  setting?: {
    voices?: number;
    worst?: boolean;
    deadline?: string;
  };
}

interface PollResult {
  admin: { value: string };
  share: { value: string };
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Token Setup
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['API-KEY'] = token;
  } else {
    delete api.defaults.headers.common['API-KEY'];
  }
};

export const pollService = {
  // Umfrage ohne Anmeldung erstellen (Pollack)
  createPollack: async (pollData: PollBody) => {
    const response = await api.post<PollResult>('/poll/lack', pollData);
    return response.data;
  },

  // Umfrage mit Anmeldung erstellen (Pollock)
  createPollock: async (pollData: PollBody) => {
    const response = await api.post<PollResult>('/poll/lock', pollData);
    return response.data;
  },

  // Umfrage Details abrufen
  getPoll: async (token: string, isLocked: boolean = false) => {
    const path = isLocked ? '/poll/lock' : '/poll/lack';
    const response = await api.get(`${path}/${token}`);
    return response.data;
  },

  // Umfrage bearbeiten
  updatePoll: async (token: string, pollData: PollBody, isLocked: boolean = false) => {
    const path = isLocked ? '/poll/lock' : '/poll/lack';
    const response = await api.put(`${path}/${token}`, pollData);
    return response.data;
  },

  // Umfrage löschen
  deletePoll: async (token: string, isLocked: boolean = false) => {
    const path = isLocked ? '/poll/lock' : '/poll/lack';
    const response = await api.delete(`${path}/${token}`);
    return response.data;
  }
};

export const voteService = {
  // Abstimmung ohne Anmeldung
  voteInPollack: async (token: string, voteData: { owner: { name: string }, choice: { id: number, worst?: boolean }[] }) => {
    const response = await api.post(`/vote/lack/${token}`, voteData);
    return response.data;
  },

  // Abstimmung mit Anmeldung
  voteInPollock: async (token: string, voteData: { choice: { id: number, worst?: boolean }[] }) => {
    const response = await api.post(`/vote/lock/${token}`, voteData);
    return response.data;
  }
};

export const authService = {
  // Benutzer registrieren
  register: async (userData: { name: string; password: string }) => {
    const response = await api.post('/user', userData);
    return response.data;
  },

  // API-Key erstellen
  createApiKey: async (userData: { name: string; password: string }) => {
    const response = await api.post('/user/key', userData);
    return response.data;
  }
};