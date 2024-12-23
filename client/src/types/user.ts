// src/types/user.ts

export interface User {
  name: string;
  lock?: boolean;  // The user is a Pollock user
}

export interface Registration {
  name: string;
  password: string;
}

// Additional types for auth state management
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: Registration) => Promise<void>;
  register: (userData: Registration) => Promise<void>;
  logout: () => void;
}