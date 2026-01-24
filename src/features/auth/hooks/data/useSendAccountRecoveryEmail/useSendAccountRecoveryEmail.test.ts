import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useSendAccountRecoveryEmail } from './useSendAccountRecoveryEmail';

jest.mock('../../../contexts/SessionContext/SessionContext');

const useSessionMock = jest.mocked(useSession);

const renderUseSendAccountRecoveryEmail = async () => {
  const { result } = renderHook(useSendAccountRecoveryEmail, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('usePurchaseInventoryItems', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({} as ReturnType<typeof useSession>);
  });

  it('returns the mutation function', async () => {
    const { result } = await renderUseSendAccountRecoveryEmail();

    expect(result.current.sendRecoveryEmail).toBeTruthy();
    expect(result.current.isError).toBe(false);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 200,
        body: {},
      });
    });

    it('invalidates inventory and rotation cache when using coins', async () => {
      const { result } = await renderUseSendAccountRecoveryEmail();

      await act(async () => result.current.sendRecoveryEmail('kragg@example.com'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 400,
      });
    });

    it('returns an error', async () => {
      const { result } = await renderUseSendAccountRecoveryEmail();

      await act(async () => result.current.sendRecoveryEmail('kragg@email.com'));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
    });
  });
});
