import { renderHook } from '@testing-library/react-native';
import { XMLBuilder } from 'fast-xml-parser';
import fetchMock from 'fetch-mock';

import { STEAM_COMMUNITY_API_BASE_URL, useSteamCommunityApiClient } from './useSteamCommunityApiClient';

type TestData = {
  id: number;
  name: string;
};
const responseDataMock = { response: { id: 1, name: 'Test' } as TestData };

const renderUseSteamCommunityApiClient = () => {
  return renderHook(useSteamCommunityApiClient);
};

describe('useSteamCommunityApiClient', () => {
  it('parses XML response correctly when wrapped in a `response` property', async () => {
    fetchMock.postOnce(`${STEAM_COMMUNITY_API_BASE_URL}/api/data?xml=1`, new XMLBuilder().build(responseDataMock));

    const { result } = renderUseSteamCommunityApiClient();
    const response = await result.current.post('/api/data');

    expect(response).toEqual(responseDataMock.response);
  });

  it('parses XML response correctly when not wrapped in a `response` property', async () => {
    fetchMock.postOnce(
      `${STEAM_COMMUNITY_API_BASE_URL}/api/data?xml=1`,
      new XMLBuilder().build(responseDataMock.response),
    );

    const { result } = renderUseSteamCommunityApiClient();
    const response = await result.current.post('/api/data');

    expect(response).toEqual(responseDataMock.response);
  });

  it('throws and error on failed response', async () => {
    fetchMock.postOnce(`${STEAM_COMMUNITY_API_BASE_URL}/api/data?xml=1`, 500);

    const { result } = renderUseSteamCommunityApiClient();

    await expect(result.current.post('/api/data')).rejects.toThrow('Request failed');
  });

  it('handles typed responses correctly', async () => {
    fetchMock.postOnce(`${STEAM_COMMUNITY_API_BASE_URL}/api/data?xml=1`, new XMLBuilder().build(responseDataMock));

    const { result } = renderUseSteamCommunityApiClient();
    const response = await result.current.post<TestData>('/api/data');

    // TypeScript should ensure this is valid
    expect(response.id).toEqual(responseDataMock.response.id);
    expect(response.name).toEqual(responseDataMock.response.name);
  });
});
