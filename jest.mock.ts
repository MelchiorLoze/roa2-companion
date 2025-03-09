import fetchMock from 'fetch-mock';

fetchMock.mockGlobal();

afterEach(() => {
  fetchMock.removeRoutes();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
