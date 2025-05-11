import fetchMock from 'fetch-mock';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
  MaterialIcons: '',
}));

fetchMock.mockGlobal();

afterEach(() => {
  jest.clearAllMocks();
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
