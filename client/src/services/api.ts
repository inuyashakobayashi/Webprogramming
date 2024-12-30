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
    // Log the complete request details
    console.log('API Request Details:', {
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Log response details
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));

    // Clone response for logging
    const responseClone = response.clone();
    
    try {
      const responseText = await responseClone.text();
      console.log('Raw Response:', responseText);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use the raw text
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (!responseText) {
        console.log('Empty response received');
        return {} as T;
      }

      try {
        const data = JSON.parse(responseText);
        console.log('Parsed Response Data:', data);
        return data;
      } catch (e) {
        console.log('Response is not JSON, returning as text:', responseText);
        return responseText as unknown as T;
      }
    } catch (error) {
      console.error('Error processing response:', error);
      throw error;
    }
  } catch (error) {
    console.error('API call failed:', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}