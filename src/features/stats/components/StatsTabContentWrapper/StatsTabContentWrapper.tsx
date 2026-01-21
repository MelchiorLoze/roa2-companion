import { type PropsWithChildren } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';

type Props = {
  onRefresh: () => void;
  isRefreshing: boolean;
  withTitle?: boolean;
} & PropsWithChildren;

export const StatsTabContentWrapper = ({ onRefresh, isRefreshing, withTitle = false, children }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
    >
      <LinearGradient
        {...theme.color.gradient.statSection}
        horizontal
        style={[styles.section, withTitle && styles.sectionWithTitle]}
      >
        {children}
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  section: {
    padding: theme.spacing.s,
    gap: theme.spacing.l,
  },
  sectionWithTitle: {
    marginTop: theme.spacing.xl,
  },
}));
