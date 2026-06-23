import { useState } from 'react';
import { Text, type TextProps, View } from 'react-native';

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
            if (lines.length > 1) return lines.reduce((longest, line) => Math.max(longest, line.width), 0);
            return 'auto';
          });
        }}
      >
        {children}
      </Text>
    </View>
  );
};
