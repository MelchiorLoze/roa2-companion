import { XMLParser } from 'fast-xml-parser';

import { type HttpClient, useHttpClient } from '@/hooks/core/useHttpClient/useHttpClient';

export const STEAM_COMMUNITY_API_BASE_URL = 'https://steamcommunity.com';

export const useSteamCommunityApiClient = (): HttpClient => {
  const handleResponse = async <T>(response: Response) => {
    if (!response.ok) throw new Error('Request failed');

    const xmlString = await response.text();
    const parser = new XMLParser();
    const data: unknown = parser.parse(xmlString);

    if (data && typeof data === 'object' && 'response' in data) {
      return data.response as T;
    }

    return data as T;
  };

  return useHttpClient({
    baseUrl: STEAM_COMMUNITY_API_BASE_URL,
    baseQueryParams: { xml: '1' },
    handleResponse,
  });
};
