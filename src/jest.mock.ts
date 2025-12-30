import fetchMock from 'fetch-mock';
import { createElement } from 'react';
import { Text, type TextStyle } from 'react-native';

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
jest
  .mocked(OutlinedText)
  .mockImplementation(({ text, style }) => createElement(Text, { style: style as TextStyle }, text));

fetchMock.mockGlobal();

afterEach(() => {
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
