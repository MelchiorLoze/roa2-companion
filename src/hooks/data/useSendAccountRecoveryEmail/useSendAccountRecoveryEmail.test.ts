import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers';

import { useSendAccountRecoveryEmail } from './useSendAccountRecoveryEmail';

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseSendAccountRecoveryEmail = async () => {
  const { result } = renderHook(useSendAccountRecoveryEmail, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('usePurchaseInventoryItems', () => {
  it('returns the mutation function', async () => {
    const { result } = await renderUseSendAccountRecoveryEmail();

    expect(result.current.sendRecoveryEmail).toBeDefined();
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

      await act(async () => result.current.sendRecoveryEmail?.('kragg@example.com'));

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

      await act(async () => result.current.sendRecoveryEmail?.('kragg@email.com'));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
    });
  });
});
