import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { invalidateGetMyRotationalCoinStore, useGetMyRotationalCoinStore } from './useGetMyRotationalCoinStore';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('@/features/auth/contexts/SessionContext/SessionContext', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const mockSuccessfulResponse = ({ itemIds = [null, '1', null, '2', null], expirationDate = VALID_DATE } = {}) => {
  fetchMock.postOnce('*', {
    status: 200,
    body: {
      data: {
        FunctionResult: {
          itemIds,
          expirationDateTime: expirationDate.toISO(),
        },
      },
    },
  });
};

const mockFailedResponse = () => {
  fetchMock.postOnce('*', {
    status: 400,
  });
};

const renderUseGetMyRotationalCoinStore = async () => {
  const { result } = renderHook(useGetMyRotationalCoinStore, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetMyRotationalCoinStore', () => {
  it('returns nothing when the request is loading', async () => {
    const { result } = renderHook(useGetMyRotationalCoinStore, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rotationalCoinStore).toBeUndefined();
    expect(result.current.isError).toBe(false);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('returns loading state when the request is fetching after being invalidated', async () => {
    const firstResult = { itemIds: ['1', '2'], expirationDate: VALID_DATE };
    const secondResult = { itemIds: ['3', '4'], expirationDate: VALID_DATE.plus({ day: 1 }) };
    mockSuccessfulResponse(firstResult);

    const queryClient = new QueryClient();

    const { result, rerender } = renderHook(useGetMyRotationalCoinStore, {
      wrapper: ({ children }) => QueryClientProvider({ client: queryClient, children }),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rotationalCoinStore).toEqual(firstResult);

    mockSuccessfulResponse(secondResult);
    invalidateGetMyRotationalCoinStore(queryClient);
    rerender(undefined);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rotationalCoinStore).toEqual(firstResult);
    expect(result.current.isError).toBe(false);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rotationalCoinStore).toEqual(secondResult);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      mockSuccessfulResponse();
    });

    it('returns the rotational coin store', async () => {
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
      mockFailedResponse();
    });

    it('returns nothing', async () => {
      const { result } = await renderUseGetMyRotationalCoinStore();

      expect(result.current.rotationalCoinStore).toBeUndefined();
      expect(result.current.isError).toBe(true);
    });
  });
});
