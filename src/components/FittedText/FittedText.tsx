import { useState } from 'react';
import { Text, type TextProps, View } from 'react-native';

// Text which container resizes automatically to "hug" its multiline content:
// 1. render with full width (width: 'auto')
// 2. measure text width onTextLayout
// 3. set container width to maximum measured line width (only if width is undefined, to avoid infinite loop)
export const FittedText = ({ children, ...props }: Readonly<TextProps>) => {
  const [width, setWidth] = useState<number | 'auto' | undefined>();
  const [prevChildren, setPrevChildren] = useState(children);

  if (prevChildren !== children) {
    setPrevChildren(children);
    setWidth(undefined);
    return null; // discarded immediately, never painted
  }

  return (
    <View style={{ width: width ?? 'auto' }}>
      <Text
        {...props}
        onTextLayout={(e) => {
          const lines = e.nativeEvent.lines;
          setWidth((prev) => {
            if (prev) return prev;
            if (lines.length > 1) return lines.reduce((longest, line) => Math.max(longest, line.width + 1), 0);
            return 'auto';
          });
        }}
      >
        {children}
      </Text>
    </View>
  );
};
