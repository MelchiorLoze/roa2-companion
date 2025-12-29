import { COMPANION_API_BASE_URL } from '@/constants';
import { useHttpClient } from '@/hooks/core/useHttpClient/useHttpClient';

export const useCompanionApiClient = () => {
  const headers: Record<string, string> = {};

  const handleResponse = async <T>(response: Response) => {
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data: unknown = await response.json();

    return data as T;
  };

  return useHttpClient({ baseUrl: COMPANION_API_BASE_URL, headers, handleResponse });
};
