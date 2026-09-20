import fetchMock from 'fetch-mock';
import { createElement } from 'react';
import { Text, type TextStyle } from 'react-native';

import { FancyText } from './components/FancyText/FancyText';

globalThis.expo.modules.ExpoObserve = {
  ...globalThis.expo.modules.ExpoObserve,
  getIntegrations: () => ({}),
};

jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
  MaterialIcons: '',
}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: '',
  BarChart: '',
}));

jest.mock('@/components/FancyText/FancyText');
jest.mocked(FancyText).mockImplementation(({ text, style, gradient }) => {
  const color = gradient ? gradient.colors[0] : style.color;

  return createElement(
    Text,
    {
      style: {
        color,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        textShadowColor: style.strokeColor,
        textShadowRadius: style.strokeWidth,
      } as TextStyle,
    },
    text,
  );
});

fetchMock.mockGlobal();

afterEach(() => {
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});

afterAll(() => {
  fetchMock.unmockGlobal();
});
