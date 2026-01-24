import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { useSession } from '@/features/auth/contexts/SessionContext/SessionContext';
import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { invalidateGetMyRotationalCoinStore, useGetMyRotationalCoinStore } from './useGetMyRotationalCoinStore';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('@/features/auth/contexts/SessionContext/SessionContext');

const useSessionMock = jest.mocked(useSession);

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
  beforeEach(() => {
    useSessionMock.mockReturnValue({} as ReturnType<typeof useSession>);
  });

  it('returns nothing when the request is loading', async () => {
    const { result } = renderHook(useGetMyRotationalCoinStore, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rotationalCoinStore).toBeUndefined();
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

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rotationalCoinStore).toEqual(secondResult);
  });

  it('invalidates the query when the rotational coin store expires', async () => {
    jest.useFakeTimers();
    mockSuccessfulResponse({ expirationDate: DateTime.utc().plus({ minutes: 5 }) });

    const queryClient = new QueryClient();
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(useGetMyRotationalCoinStore, {
      wrapper: ({ children }) => QueryClientProvider({ client: queryClient, children }),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rotationalCoinStore).toBeDefined();

    // Fast-forward time to just before expiration - should not invalidate
    act(() => {
      jest.advanceTimersByTime(4 * 60 * 1000); // 4 minutes
    });
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();

    // Fast-forward to expiration time - should invalidate
    act(() => {
      jest.advanceTimersByTime(60 * 1000); // 1 more minute = 5 minutes total
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['getMyRotationalCoinStore'] });

    jest.useRealTimers();
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
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      mockFailedResponse();
    });

    it('returns nothing', async () => {
      const { result } = await renderUseGetMyRotationalCoinStore();

      expect(result.current.rotationalCoinStore).toBeUndefined();
    });
  });

  describe('invalidateGetMyRotationalCoinStore', () => {
    it('invalidates the rotational coin store query', () => {
      const queryClient = new QueryClient();
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      invalidateGetMyRotationalCoinStore(queryClient);

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['getMyRotationalCoinStore'] });
    });
  });
});
