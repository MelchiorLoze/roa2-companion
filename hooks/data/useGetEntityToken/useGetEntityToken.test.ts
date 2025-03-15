import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers';

import { useGetEntityToken } from './useGetEntityToken';

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetEntityToken = () => {
  return renderHook(useGetEntityToken, { wrapper: TestQueryClientProvider });
};

describe('useGetEntityToken', () => {
  it('should return initial state with undefined newSession', () => {
    const { result } = renderUseGetEntityToken();

    expect(result.current.newSession).toBeUndefined();
    expect(typeof result.current.renew).toBe('function');
  });

  describe('when the request succeeds', () => {
    it('should return the new session', async () => {
      const mockEntityToken = 'mock-token';
      const mockTokenExpiration = DateTime.now().plus({ day: 1 }).toISO();

      fetchMock.postOnce('*', {
        status: 200,
        body: {
          data: { EntityToken: mockEntityToken, TokenExpiration: mockTokenExpiration },
        },
      });

      const { result } = renderUseGetEntityToken();

      await act(async () => {
        result.current.renew();
      });

      await waitFor(() => expect(result.current.newSession).toBeDefined());
      expect(result.current.newSession?.entityToken).toBe(mockEntityToken);
      expect(result.current.newSession?.expirationDate instanceof DateTime).toBeTruthy();
      expect(result.current.newSession?.expirationDate.toISO()).toBe(mockTokenExpiration);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 400,
      });
    });

    it('should return nothing', async () => {
      const { result } = renderUseGetEntityToken();

      await act(async () => {
        result.current.renew();
      });

      expect(result.current.newSession).toBeUndefined();
    });
  });
});
