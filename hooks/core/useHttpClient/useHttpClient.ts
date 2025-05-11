type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const fetchWrapper = async (
  baseUrl: string,
  path: string,
  options: { method: Method; params?: URLSearchParams; headers?: Record<string, string>; body?: object },
) => {
  const url = new URL(path, baseUrl);
  url.search = options.params?.toString() ?? '';

  return await fetch(url, {
    method: options.method,
    headers: { ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

type RequestOptions = {
  params?: Record<string, string>;
  body?: object;
};

export const useHttpClient = ({
  baseUrl,
  baseQueryParams,
  headers,
  handleResponse,
}: {
  baseUrl: string;
  baseQueryParams?: Record<string, string>;
  headers?: Record<string, string>;
  handleResponse: <T>(response: Response) => Promise<T>;
}) => {
  const requester = async <T>(method: Method, path: string, params?: Record<string, string>, body?: object) => {
    const response = await fetchWrapper(baseUrl, path, {
      method,
      params: new URLSearchParams({ ...baseQueryParams, ...params }),
      headers,
      body,
    });

    return await handleResponse<T>(response);
  };

  return {
    get: async <T>(path: string, options: Pick<RequestOptions, 'params'> = {}) =>
      await requester<T>('GET', path, options.params),
    post: async <T>(path: string, options: RequestOptions = {}) =>
      await requester<T>('POST', path, options.params, options.body),
  };
};
