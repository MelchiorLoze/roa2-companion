import { useEffect, useState } from 'react';
import { Text, type TextProps, View } from 'react-native';

export const FittedText = ({ children, ...props }: Readonly<TextProps>) => {
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => setWidth(undefined), [children]);

  return (
    <View style={{ width: width ?? 'auto' }}>
      <Text
        {...props}
        onTextLayout={(e) => {
          const longestLineWidth = e.nativeEvent.lines.reduce(
            (longest, line) => Math.max(longest, Math.ceil(line.width)),
            0,
          );
          setWidth((prev) => prev ?? longestLineWidth);
        }}
      >
        {children}
      </Text>
    </View>
  );
};
