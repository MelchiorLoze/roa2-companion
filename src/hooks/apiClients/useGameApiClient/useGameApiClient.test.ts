import { renderHook } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useSession } from '@/features/auth/contexts/SessionContext/SessionContext';

import { GAME_API_BASE_URL, useGameApiClient } from './useGameApiClient';

jest.mock('@/features/auth/contexts/SessionContext/SessionContext');
const useSessionMock = jest.mocked(useSession);
const defaultSessionState: ReturnType<typeof useSession> = {
  entityToken: 'mock-token',
  isValid: true,
  shouldRenew: false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  isLoading: false,
};

type TestData = {
  id: number;
  name: string;
};
const responseDataMock = { data: { id: 1, name: 'test' } as TestData };

const renderUseGameApiClient = () => {
  return renderHook(useGameApiClient);
};

describe('useGameApiClient', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionState);
  });

  it('adds auth headers when logged in', async () => {
    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, responseDataMock, {
      matcherFunction: ({ options }) => {
        const headers = options.headers as Record<string, string>;
        return headers['x-entitytoken'] === 'mock-token' && headers['content-type'] === 'application/json';
      },
    });

    const { result } = renderUseGameApiClient();

    await result.current.post('/api/data');
    expect(fetchMock.callHistory.callLogs).toHaveLength(1);
  });

  it('does not add auth headers when not logged in', async () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      entityToken: undefined,
      isValid: false,
    });

    const { result } = renderUseGameApiClient();

    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, responseDataMock, {
      matcherFunction: ({ options }) => {
        const headers = options.headers as Record<string, string>;
        return !headers['x-entityToken'] && headers['content-type'] === 'application/json';
      },
    });

    await result.current.post('/api/data');
    expect(fetchMock.callHistory.callLogs).toHaveLength(1);
  });

  it('handles successful responses with data property', async () => {
    const { result } = renderUseGameApiClient();

    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, responseDataMock);

    const response = await result.current.post('/api/data');
    expect(response).toEqual({ id: 1, name: 'test' });
  });

  it('handles successful responses without data property', async () => {
    const { result } = renderUseGameApiClient();

    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, responseDataMock.data);

    const response = await result.current.post('/api/data');
    expect(response).toEqual({ id: 1, name: 'test' });
  });

  it('clears session and throw error on 401 response', async () => {
    const { result } = renderUseGameApiClient();

    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, {
      status: 401,
      body: { error: 'Unauthorized' },
    });

    await expect(result.current.post('/api/data')).rejects.toThrow('Unauthorized');
    expect(defaultSessionState.clearSession).toHaveBeenCalledTimes(1);
  });

  it('throws error on other failed responses', async () => {
    const { result } = renderUseGameApiClient();

    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, {
      status: 500,
      body: { error: 'Server Error' },
    });

    await expect(result.current.post('/api/data')).rejects.toThrow('Request failed');
    expect(defaultSessionState.clearSession).not.toHaveBeenCalled();
  });

  it('handles typed responses correctly', async () => {
    const { result } = renderUseGameApiClient();

    fetchMock.postOnce(`${GAME_API_BASE_URL}/api/data`, responseDataMock);

    const response = await result.current.post<TestData>('/api/data');

    // TypeScript should ensure this is valid
    expect(response.id).toBe(1);
    expect(response.name).toBe('test');
  });
});
