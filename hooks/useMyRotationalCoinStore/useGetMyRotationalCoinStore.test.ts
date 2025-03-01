import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

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
              expirationDateTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
            },
          },
        },
      });
    });

    it('should return the rotational coin store', async () => {
      const { result } = await renderUseGetMyRotationalCoinStore();

      await waitFor(() => {
        expect(result.current.rotationalCoinStore).toEqual({
          itemIds: ['1', '2'],
          expirationDate: expect.any(Date),
        });
      });
      expect(result.current.isError).toBe(false);
    });
  });
});
