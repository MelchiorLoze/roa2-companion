import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { PropsWithChildren } from 'react';

import { useLoginWithEmail } from './useLoginWithEmail';

const queryClient = new QueryClient();

const Wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const renderUseLoginWithEmail = async () => {
  const { result, rerender } = renderHook(useLoginWithEmail, { wrapper: Wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  const rerenderHook = async () => {
    rerender(undefined);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  };

  return { result, rerender: rerenderHook };
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
              ExpirationDate: new Date(),
            },
          },
        },
      });
    });

    it('should return the session correctly', async () => {
      const { result, rerender } = await renderUseLoginWithEmail();

      act(() => result.current.loginWithEmail({ email: 'john.doe@email.com', password: 'password' }));
      await rerender();

      expect(result.current.data).toEqual({
        entityToken: 'token',
        expirationDate: expect.any(Date),
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
      const { result, rerender } = await renderUseLoginWithEmail();

      act(() => result.current.loginWithEmail({ email: 'test', password: 'test' }));
      await rerender();

      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
    });
  });
});
