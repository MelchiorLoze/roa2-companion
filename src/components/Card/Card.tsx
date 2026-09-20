import { ImageBackground } from 'expo-image';
import { type ReactNode } from 'react';
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ItemBackground, ItemOutline } from '@/assets/images/ui';

import { NineSlicesImage } from '../NineSlicesImage/NineSlicesImage';

type Props = {
  children: (pressed: boolean) => ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  role?: 'button';
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ children, contentStyle, onPress, role, style }: Readonly<Props>) => {
  return (
    <Pressable onPress={onPress} role={role} style={[styles.container, style]}>
      {({ pressed }) => (
        <>
          <NineSlicesImage
            insets={{ top: '40%', right: '40%', bottom: '40%', left: '40%' }}
            source={ItemOutline}
            style={StyleSheet.absoluteFill}
          />
          {pressed && <View style={styles.outLinePressed} />}

          <View style={[styles.contentContainer, contentStyle]}>
            <ImageBackground
              contentFit="fill"
              imageStyle={styles.backgroundImage}
              source={pressed ? undefined : ItemBackground}
              style={StyleSheet.absoluteFill}
            />
            {children(pressed)}
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: [
      {
        color: theme.color.black,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 5,
        spreadDistance: 0,
      },
    ],
  },
  outLinePressed: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: theme.color.itemSelectedPrimary,
  },
  contentContainer: {
    flex: 1,
    margin: 5,
    marginBottom: theme.spacing.s,
  },
  backgroundImage: {
    borderRadius: 12,
    backgroundColor: theme.color.white,
  },
}));
