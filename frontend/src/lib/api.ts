const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class APIError extends Error {
  constructor(public message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: options.cache ?? 'no-store',
    credentials: options.credentials ?? 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new APIError(error.message || 'API request failed', response.status, error.code);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
