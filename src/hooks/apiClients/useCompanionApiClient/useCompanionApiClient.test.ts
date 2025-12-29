import { renderHook } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { COMPANION_API_BASE_URL } from '@/constants';

import { useCompanionApiClient } from './useCompanionApiClient';

type TestData = {
  id: number;
  name: string;
};

const responseDataMock = { id: 1, name: 'test' } as TestData;

const renderUseCompanionApiClient = () => {
  return renderHook(useCompanionApiClient);
};

describe('useCompanionApiClient', () => {
  it('makes GET requests with correct headers', async () => {
    fetchMock.getOnce(`${COMPANION_API_BASE_URL}/api/data`, responseDataMock, {
      matcherFunction: ({ options }) => {
        const headers = options.headers as Record<string, string>;
        return !headers['x-entitytoken'];
      },
    });

    const { result } = renderUseCompanionApiClient();

    await result.current.get('/api/data');
    expect(fetchMock.callHistory.callLogs).toHaveLength(1);
  });

  it('handles successful GET responses', async () => {
    const { result } = renderUseCompanionApiClient();

    fetchMock.getOnce(`${COMPANION_API_BASE_URL}/api/data`, responseDataMock);

    const response = await result.current.get('/api/data');
    expect(response).toEqual({ id: 1, name: 'test' });
  });

  it('handles successful GET responses with query params', async () => {
    const { result } = renderUseCompanionApiClient();

    fetchMock.getOnce(`${COMPANION_API_BASE_URL}/api/data?size=100&minEntrants=16`, responseDataMock);

    const response = await result.current.get('/api/data', {
      params: { size: '100', minEntrants: '16' },
    });
    expect(response).toEqual({ id: 1, name: 'test' });
  });

  it('throws error on failed GET responses', async () => {
    const { result } = renderUseCompanionApiClient();

    fetchMock.getOnce(`${COMPANION_API_BASE_URL}/api/data`, {
      status: 500,
      body: { error: 'Server Error' },
    });

    await expect(result.current.get('/api/data')).rejects.toThrow('Request failed');
  });

  it('throws error on 404 responses', async () => {
    const { result } = renderUseCompanionApiClient();

    fetchMock.getOnce(`${COMPANION_API_BASE_URL}/api/data`, {
      status: 404,
      body: { error: 'Not Found' },
    });

    await expect(result.current.get('/api/data')).rejects.toThrow('Request failed');
  });

  it('handles typed responses correctly', async () => {
    const { result } = renderUseCompanionApiClient();

    fetchMock.getOnce(`${COMPANION_API_BASE_URL}/api/data`, responseDataMock);

    const response = await result.current.get<TestData>('/api/data');

    // TypeScript should ensure this is valid
    expect(response.id).toBe(1);
    expect(response.name).toBe('test');
  });
});
