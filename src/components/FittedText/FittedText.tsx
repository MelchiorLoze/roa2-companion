import { useEffect, useState } from 'react';
import { Text, type TextProps, useWindowDimensions, View } from 'react-native';

// Text which container resizes automatically to "hug" its multiline content:
// 1. render with full width (width: 'auto')
// 2. measure text width onTextLayout
// 3. set container width to maximum measured line width
export const FittedText = ({ children, ...props }: Readonly<TextProps>) => {
  const [width, setWidth] = useState<number | 'auto' | undefined>();
  const { fontScale } = useWindowDimensions();

  useEffect(() => {
    setWidth(undefined);
  }, [children, fontScale]);

  return (
    <View style={{ width: width ?? 'auto' }}>
      <Text
        {...props}
        onTextLayout={(e) => {
          const lines = e.nativeEvent.lines;
          setWidth((prev) => {
            if (lines.length > 1) {
              const newWidth = lines.reduce((longest, line) => Math.max(longest, line.width + 1), 0);
              if (prev !== newWidth) return newWidth;
              return prev;
            }
            if (prev !== 'auto') return 'auto';
            return prev;
          });
        }}
      >
        {children}
      </Text>
    </View>
  );
};
