import fetchMock from 'fetch-mock';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
  MaterialIcons: '',
}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: '',
  BarChart: '',
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
