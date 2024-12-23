// src/types/response.ts

export interface ResponseMessage {
  code?: number;
  message: string;
}

export interface Token {
  link?: string;
  value: string;
}

// Generic API Response type
export interface ApiResponse<T> {
  data?: T;
  error?: ResponseMessage;
  loading: boolean;
}

// Error types for better error handling
export interface ApiError extends Error {
  code?: number;
  response?: {
    data?: ResponseMessage;
    status?: number;
  };
}

// Success response type
export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

// Generic API state for hooks
export interface ApiState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

// Pagination response interface (falls Sie später Paginierung hinzufügen möchten)
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}