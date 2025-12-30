import fetchMock from 'fetch-mock';
import { createElement } from 'react';
import { Text } from 'react-native';

import { OutlinedText } from './components/OutlinedText/OutlinedText';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
  MaterialIcons: '',
}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: '',
  BarChart: '',
}));

jest.mock('@/components/OutlinedText/OutlinedText');
jest.mocked(OutlinedText).mockImplementation(({ text }) => createElement(Text, null, text));

fetchMock.mockGlobal();

afterEach(() => {
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
