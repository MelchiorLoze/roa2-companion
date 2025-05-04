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
  it('should return the mutation function', async () => {
    const { result } = await renderUseSendAccountRecoveryEmail();

    expect(result.current.sendRecoveryEmail).toBeDefined();
    expect(result.current.isError).toBe(false);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 200,
        body: {},
      });
    });

    it('should invalidate inventory and rotation cache when using coins', async () => {
      const { result } = await renderUseSendAccountRecoveryEmail();

      await act(async () => result.current.sendRecoveryEmail?.('kragg@example.com'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 400,
      });
    });

    it('should return an error', async () => {
      const { result } = await renderUseSendAccountRecoveryEmail();

      await act(async () => result.current.sendRecoveryEmail?.('kragg@email.com'));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
    });
  });
});
