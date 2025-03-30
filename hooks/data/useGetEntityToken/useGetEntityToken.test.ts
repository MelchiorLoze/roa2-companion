import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers';

import { useGetEntityToken } from './useGetEntityToken';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetEntityToken = async () => {
  const { result } = renderHook(useGetEntityToken, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetEntityToken', () => {
  it('should return initial state with undefined newSession', async () => {
    const { result } = await renderUseGetEntityToken();

    expect(result.current.newSession).toBeUndefined();
    expect(typeof result.current.renew).toBe('function');
  });

  describe('when the request succeeds', () => {
    it('should return the new session', async () => {
      const mockEntityToken = 'mock-token';

      fetchMock.postOnce('*', {
        status: 200,
        body: {
          data: { EntityToken: mockEntityToken, TokenExpiration: VALID_DATE.toISO() },
        },
      });

      const { result } = await renderUseGetEntityToken();

      await act(async () => {
        result.current.renew();
      });

      await waitFor(() => expect(result.current.newSession).toBeDefined());
      expect(result.current.newSession?.entityToken).toBe(mockEntityToken);
      expect(result.current.newSession?.expirationDate).toEqual(VALID_DATE);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 400,
      });
    });

    it('should return nothing', async () => {
      const { result } = await renderUseGetEntityToken();

      await act(async () => {
        result.current.renew();
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.newSession).toBeUndefined();
    });
  });
});
