import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useGetEntityToken } from './useGetEntityToken';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('../../../contexts/SessionContext/SessionContext');

const useSessionMock = jest.mocked(useSession);
const onSuccessMock = jest.fn();

const renderUseGetEntityToken = async () => {
  const { result } = renderHook(() => useGetEntityToken({ onSuccess: onSuccessMock }), {
    wrapper: TestQueryClientProvider,
  });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetEntityToken', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({} as ReturnType<typeof useSession>);
  });

  it('returns initial state', async () => {
    const { result } = await renderUseGetEntityToken();

    expect(typeof result.current.renew).toBe('function');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  describe('when the request succeeds', () => {
    it('calls onSuccess with the new session', async () => {
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

      await waitFor(() => expect(onSuccessMock).toHaveBeenCalledTimes(1));
      expect(onSuccessMock).toHaveBeenCalledWith({
        entityToken: mockEntityToken,
        expirationDate: VALID_DATE,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 400,
      });
    });

    it('does not call onSuccess', async () => {
      const { result } = await renderUseGetEntityToken();

      await act(async () => {
        result.current.renew();
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });
});
