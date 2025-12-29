import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useLoginWithEmail } from './useLoginWithEmail';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('../../../contexts/SessionContext/SessionContext');

const useSessionMock = jest.mocked(useSession);

const renderUseLoginWithEmail = async () => {
  const { result } = renderHook(useLoginWithEmail, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useLoginWithEmail', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({} as ReturnType<typeof useSession>);
  });

  it('returns default values correctly', async () => {
    const { result } = await renderUseLoginWithEmail();

    expect(result.current.session).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 200,
        body: {
          data: {
            EntityToken: {
              EntityToken: 'token',
              TokenExpiration: VALID_DATE.toISO(),
            },
          },
        },
      });
    });

    it('returns the session correctly', async () => {
      const { result } = await renderUseLoginWithEmail();

      await act(async () => result.current.loginWithEmail({ email: 'john.doe@email.com', password: 'password' }));

      await waitFor(() => expect(result.current.session).toBeTruthy());
      expect(result.current.session?.entityToken).toBe('token');
      expect(result.current.session?.expirationDate).toEqual(VALID_DATE);
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

    it('returns an error', async () => {
      const { result } = await renderUseLoginWithEmail();

      await act(async () => result.current.loginWithEmail({ email: 'test', password: 'test' }));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.session).toBeUndefined();
    });
  });
});
