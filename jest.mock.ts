import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import fetchMock from 'fetch-mock';

fetchMock.mockGlobal();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

afterEach(() => {
  mockAsyncStorage.clear();
  fetchMock.removeRoutes();
});
