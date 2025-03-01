import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { TestQueryClientProvider } from '@/test-helpers';
import { useGetMyRotationalCoinStore } from './useGetMyRotationalCoinStore';

jest.mock('@/contexts/AuthContext/AuthContext');
const useAuthMock = jest.mocked(useAuth);

const renderUseGetMyRotationalCoinStore = async () => {
  const { result } = renderHook(useGetMyRotationalCoinStore, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetMyRotationalCoinStore', () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ isLoggedIn: true, entityToken: 'entityToken' } as ReturnType<typeof useAuth>);
  });

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      useAuthMock.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useAuth>);
    });

    it('should not perform the query', async () => {
      const { result } = await renderUseGetMyRotationalCoinStore();

      expect(result.current.rotationalCoinStore).toBeUndefined();
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 200,
        body: {
          data: {
            FunctionResult: {
              itemIds: ['1', '2'],
              expirationDateTime: DateTime.now().plus({ hours: 24 }).toISO(),
            },
          },
        },
      });
    });

    it('should return the rotational coin store', async () => {
      const { result } = await renderUseGetMyRotationalCoinStore();

      expect(result.current.rotationalCoinStore).toEqual({
        itemIds: ['1', '2'],
        expirationDate: expect.any(DateTime),
      });
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
      const { result } = await renderUseGetMyRotationalCoinStore();

      expect(result.current.rotationalCoinStore).toBeUndefined();
      expect(result.current.isError).toBe(true);
    });
  });
});
