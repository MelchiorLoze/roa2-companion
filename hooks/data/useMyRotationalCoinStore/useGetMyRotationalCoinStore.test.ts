import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers';

import { useGetMyRotationalCoinStore } from './useGetMyRotationalCoinStore';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetMyRotationalCoinStore = async () => {
  const { result } = renderHook(useGetMyRotationalCoinStore, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetMyRotationalCoinStore', () => {
  it('should return nothing when the request is loading', async () => {
    const { result } = renderHook(useGetMyRotationalCoinStore, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rotationalCoinStore).toBeUndefined();
    expect(result.current.isError).toBe(false);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 200,
        body: {
          data: {
            FunctionResult: {
              itemIds: ['1', '2'],
              expirationDateTime: VALID_DATE.toISO(),
            },
          },
        },
      });
    });

    it('should return the rotational coin store', async () => {
      const { result } = await renderUseGetMyRotationalCoinStore();

      expect(result.current.rotationalCoinStore).toEqual({
        itemIds: ['1', '2'],
        expirationDate: VALID_DATE,
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
