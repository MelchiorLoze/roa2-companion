import fetchMock from 'fetch-mock';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: { Button: '' },
  MaterialIcons: '',
}));

fetchMock.mockGlobal();

afterEach(() => {
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
