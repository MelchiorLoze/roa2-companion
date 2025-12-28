import { useHttpClient } from '@/hooks/core/useHttpClient/useHttpClient';

export const SERVER_BASE_URL = 'https://api.roa2-companion.app';

export const useCompanionApiClient = () => {
  const headers: Record<string, string> = {};

  const handleResponse = async <T>(response: Response) => {
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data: unknown = await response.json();

    return data as T;
  };

  return useHttpClient({ baseUrl: SERVER_BASE_URL, headers, handleResponse });
};
