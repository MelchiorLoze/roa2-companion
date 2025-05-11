import { BASE_URL } from '@/constants';
import { useSession } from '@/contexts';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const validatePath = (path: string) => {
  // check that path match regex start with / and not end with /
  if (!/^\/.+[^/]$/.test(path)) {
    throw new Error('Invalid path');
  }
};

const fetchWrapper = async (path: string, options: { method: Method; headers: object; body?: object }) => {
  validatePath(path);

  return await fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

export const useHttpClient = () => {
  const { entityToken, isValid: isLoggedIn, clearSession } = useSession();

  const headers = isLoggedIn && entityToken ? { 'X-EntityToken': entityToken } : {};

  const handleResponse = async <T>(response: Response) => {
    if (!response.ok) {
      if (response.status === 401) {
        clearSession();
        throw new Error('Unauthorized');
      }
      throw new Error('Request failed');
    }

    const data: unknown = await response.json();

    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  };

  const requester = async <T>(method: Method, path: string, body?: object) => {
    const response = await fetchWrapper(path, { method, headers, body });

    return await handleResponse<T>(response);
  };

  return {
    post: async <T>(path: string, body?: object) => await requester<T>('POST', path, body),
  };
};
