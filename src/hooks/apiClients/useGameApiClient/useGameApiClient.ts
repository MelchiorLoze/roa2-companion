import { TITLE_ID } from '@/constants';
import { useSession } from '@/features/auth/contexts/SessionContext/SessionContext';
import { type HttpClient, useHttpClient } from '@/hooks/core/useHttpClient/useHttpClient';

export const GAME_API_BASE_URL = `https://${TITLE_ID}.playfabapi.com`;

export const useGameApiClient = (): HttpClient => {
  const { entityToken, isValid: isLoggedIn, clearSession } = useSession();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isLoggedIn && entityToken) headers['X-EntityToken'] = entityToken;

  const handleResponse = async <T>(response: Response) => {
    if (!response.ok) {
      if (response.status === 401) {
        clearSession();
        throw new Error('Unauthorized');
      }
      throw new Error('Request failed');
    }

    const data: unknown = await response.json();

    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  };

  return useHttpClient({ baseUrl: GAME_API_BASE_URL, headers, handleResponse });
};
