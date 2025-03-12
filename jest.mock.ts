import fetchMock from 'fetch-mock';

fetchMock.mockGlobal();

afterEach(() => {
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
