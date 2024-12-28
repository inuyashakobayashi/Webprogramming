// Base URL für alle API-Aufrufe
const API_BASE_URL = '/api';

export async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'API-KEY': token } : {}),
    ...(options.headers || {})
  };

  try {
    console.log('Sending request to:', `${API_BASE_URL}${endpoint}`);
    console.log('Request options:', { ...options, headers });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const text = await response.text();
    if (!text) {
      console.log('Empty response received');
      return {} as T;
    }

    try {
      const data = JSON.parse(text);
      console.log('Parsed response data:', data);
      return data;
    } catch (e) {
      console.log('Response is not JSON, returning as text:', text);
      return text as unknown as T;
    }

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}