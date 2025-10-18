import { useHttpClient } from '@/hooks/core/useHttpClient/useHttpClient';

export const SERVER_BASE_URL = 'http://192.168.1.150:8080';

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
