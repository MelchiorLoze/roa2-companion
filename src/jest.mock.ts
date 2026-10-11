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
  const transformedText = style.textTransform === 'uppercase' ? String(text).toUpperCase() : String(text);
  const letterSpacing = style.letterSpacing ?? 0;
  const fontSize = style.fontSize ?? 0;
  const fontScale = style.fontSize ? 1 : 1; // preserve spacing relative to scaled font if needed

  return createElement(
    Text,
    {
      style: {
        color,
        fontFamily: style.fontFamily,
        fontSize,
        letterSpacing,
        textShadowColor: style.strokeColor,
        textShadowRadius: style.strokeWidth,
      } as TextStyle,
    },
    transformedText,
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
