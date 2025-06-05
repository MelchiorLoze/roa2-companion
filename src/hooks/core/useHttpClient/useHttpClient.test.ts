import { renderHook } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useHttpClient } from './useHttpClient';

const BASE_URL = 'https://example.com';

const responseDataMock = { data: { id: 1, name: 'test' } };
const handleResponseMock = jest.fn().mockResolvedValue(responseDataMock);

const renderUseHttpClient = (options?: Pick<Parameters<typeof useHttpClient>[0], 'baseQueryParams' | 'headers'>) => {
  return renderHook(() => useHttpClient({ baseUrl: BASE_URL, handleResponse: handleResponseMock, ...options }));
};

describe('useHttpClient', () => {
  it('allows request with no params', async () => {
    fetchMock.postOnce(`${BASE_URL}/api/data`, responseDataMock);

    const { result } = renderUseHttpClient();
    const response = await result.current.post('/api/data');

    expect(response).toEqual(responseDataMock);
    expect(handleResponseMock).toHaveBeenCalledTimes(1);
    expect(handleResponseMock).toHaveBeenCalledWith(expect.any(Response));
  });

  it('allows request with headers', async () => {
    fetchMock.postOnce(`${BASE_URL}/api/data`, responseDataMock, {
      headers: { 'x-custom-header': 'value' },
    });

    const { result } = renderUseHttpClient({ headers: { 'x-custom-header': 'value' } });
    const response = await result.current.post('/api/data');

    expect(response).toEqual(responseDataMock);
    expect(handleResponseMock).toHaveBeenCalledTimes(1);
    expect(handleResponseMock).toHaveBeenCalledWith(expect.any(Response));
  });

  it('allows request with params', async () => {
    fetchMock.postOnce(`${BASE_URL}/api/data?param1=value1&param2=value2`, responseDataMock);

    const { result } = renderUseHttpClient({ baseQueryParams: { param1: 'value1' } });
    const response = await result.current.post('/api/data', { params: { param2: 'value2' } });

    expect(response).toEqual(responseDataMock);
    expect(handleResponseMock).toHaveBeenCalledTimes(1);
    expect(handleResponseMock).toHaveBeenCalledWith(expect.any(Response));
  });

  it('allows request with body', async () => {
    const requestBody = { name: 'test' };
    fetchMock.postOnce(`${BASE_URL}/api/data`, responseDataMock, {
      body: requestBody,
    });

    const { result } = renderUseHttpClient();
    const response = await result.current.post('/api/data', { body: requestBody });

    expect(response).toEqual(responseDataMock);
    expect(handleResponseMock).toHaveBeenCalledTimes(1);
    expect(handleResponseMock).toHaveBeenCalledWith(expect.any(Response));
  });
});
