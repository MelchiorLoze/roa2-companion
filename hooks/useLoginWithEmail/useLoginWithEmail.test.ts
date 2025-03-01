import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers';
import { useLoginWithEmail } from './useLoginWithEmail';

const renderUseLoginWithEmail = async () => {
  const { result } = renderHook(useLoginWithEmail, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useLoginWithEmail', () => {
  it('should default values correctly', async () => {
    const { result } = await renderUseLoginWithEmail();

    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 200,
        body: {
          data: {
            EntityToken: {
              EntityToken: 'token',
              ExpirationDate: DateTime.now().toISO(),
            },
          },
        },
      });
    });

    it('should return the session correctly', async () => {
      const { result } = await renderUseLoginWithEmail();

      await act(async () => result.current.loginWithEmail({ email: 'john.doe@email.com', password: 'password' }));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.data).toEqual({
        entityToken: 'token',
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

    it('should return an error', async () => {
      const { result } = await renderUseLoginWithEmail();

      await act(async () => result.current.loginWithEmail({ email: 'test', password: 'test' }));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
    });
  });
});
