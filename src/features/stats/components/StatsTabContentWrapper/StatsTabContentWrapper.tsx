import { ImageBackground } from 'expo-image';
import { type PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { StatsBackground } from '@/assets/images/ui';

type Props = PropsWithChildren<{
  onRefresh: () => void;
  isRefreshing: boolean;
  withTitle?: boolean;
}>;

export const StatsTabContentWrapper = ({ onRefresh, isRefreshing, withTitle = false, children }: Readonly<Props>) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
    >
      <View style={[styles.section, withTitle && styles.sectionWithTitle]}>
        <ImageBackground contentFit="fill" source={StatsBackground} style={StyleSheet.absoluteFill} />
        {children}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.s,
    gap: theme.spacing.l,
  },
  section: {
    padding: theme.spacing.s,
    gap: theme.spacing.l,
    borderColor: theme.color.statsContainerBorder,
    borderWidth: theme.spacing.xxs,
  },
  sectionWithTitle: {
    marginTop: theme.spacing.xl,
  },
}));
