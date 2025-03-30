import { renderHook } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { BASE_URL } from '@/constants';
import { useSession } from '@/contexts';

import { useHttpClient } from './useHttpClient';

jest.mock('@/contexts');
const useSessionMock = jest.mocked(useSession);
const setSessionMock = jest.fn();

const defaultSessionState: ReturnType<typeof useSession> = {
  entityToken: 'mock-token',
  isValid: true,
  shouldRenew: false,
  setSession: setSessionMock,
  isLoading: false,
};

describe('useHttpClient', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionState);
  });

  afterEach(() => {
    setSessionMock.mockClear();
  });

  it('should validate path correctly', async () => {
    const { result } = renderHook(useHttpClient);

    // Valid path
    fetchMock.postOnce(`${BASE_URL}/valid/path`, { data: { success: true } });
    await expect(result.current.post('/valid/path')).resolves.toEqual({ success: true });

    // Invalid paths
    await expect(result.current.post('invalid-path')).rejects.toThrow('Invalid path');
    await expect(result.current.post('/ending-with-slash/')).rejects.toThrow('Invalid path');
  });

  it('should add auth headers when logged in', async () => {
    fetchMock.post(
      `${BASE_URL}/api/data`,
      { data: { success: true } },
      {
        matcherFunction: ({ options }) => {
          const headers = options.headers as Record<string, string>;
          return headers['x-entitytoken'] === 'mock-token' && headers['content-type'] === 'application/json';
        },
      },
    );

    const { result } = renderHook(useHttpClient);

    await result.current.post('/api/data');
    expect(fetchMock.callHistory.callLogs).toHaveLength(1);
  });

  it('should not add auth headers when not logged in', async () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      entityToken: undefined,
      isValid: false,
    });

    const { result } = renderHook(useHttpClient);

    fetchMock.postOnce(
      `${BASE_URL}/api/data`,
      { data: { success: true } },
      {
        matcherFunction: ({ options }) => {
          const headers = options.headers as Record<string, string>;
          return !headers['x-entityToken'] && headers['content-type'] === 'application/json';
        },
      },
    );

    await result.current.post('/api/data');
    expect(fetchMock.callHistory.callLogs).toHaveLength(1);
  });

  it('should properly serialize body content', async () => {
    const { result } = renderHook(useHttpClient);
    const testBody = { name: 'test', value: 123 };

    fetchMock.postOnce(
      `${BASE_URL}/api/data`,
      { data: { success: true } },
      {
        matcherFunction: ({ options }) => {
          return options.body === JSON.stringify(testBody);
        },
      },
    );

    await result.current.post('/api/data', testBody);
    expect(fetchMock.callHistory.callLogs).toHaveLength(1);
  });

  it('should handle successful responses with data property', async () => {
    const { result } = renderHook(useHttpClient);

    fetchMock.postOnce(`${BASE_URL}/api/data`, {
      data: { id: 1, name: 'test' },
    });

    const response = await result.current.post('/api/data');
    expect(response).toEqual({ id: 1, name: 'test' });
  });

  it('should handle successful responses without data property', async () => {
    const { result } = renderHook(useHttpClient);

    fetchMock.postOnce(`${BASE_URL}/api/data`, {
      id: 1,
      name: 'test',
    });

    const response = await result.current.post('/api/data');
    expect(response).toEqual({ id: 1, name: 'test' });
  });

  it('should logout and throw error on 401 response', async () => {
    const { result } = renderHook(useHttpClient);

    fetchMock.postOnce(`${BASE_URL}/api/data`, {
      status: 401,
      body: { error: 'Unauthorized' },
    });

    await expect(result.current.post('/api/data')).rejects.toThrow('Unauthorized');
    expect(setSessionMock).toHaveBeenCalledTimes(1);
    expect(setSessionMock).toHaveBeenCalledWith(null);
  });

  it('should throw error on other failed responses', async () => {
    const { result } = renderHook(useHttpClient);

    fetchMock.postOnce(`${BASE_URL}/api/data`, {
      status: 500,
      body: { error: 'Server Error' },
    });

    await expect(result.current.post('/api/data')).rejects.toThrow('Request failed');
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it('should handle typed responses correctly', async () => {
    const { result } = renderHook(useHttpClient);

    interface TestData {
      id: number;
      name: string;
    }

    fetchMock.postOnce(`${BASE_URL}/api/data`, {
      data: { id: 1, name: 'test' },
    });

    const response = await result.current.post<TestData>('/api/data');

    // TypeScript should ensure this is valid
    expect(response.id).toBe(1);
    expect(response.name).toBe('test');
  });
});
