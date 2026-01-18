import { type PropsWithChildren } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { CharacterStats } from '@/features/stats/components/CharacterStats/CharacterStats';
import { CrewsStats } from '@/features/stats/components/CrewsStats/CrewsStats';
import { GlobalStats } from '@/features/stats/components/GlobalStats/GlobalStats';
import { RankedStats } from '@/features/stats/components/RankedStats/RankedStats';
import { useUserCharacterStats } from '@/features/stats/hooks/business/useUserCharacterStats/useUserCharacterStats';
import { useUserCrewsStats } from '@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats';
import { useUserGlobalStats } from '@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats';
import { useUserRankedStats } from '@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats';

type Props = {
  withTitle?: boolean;
} & PropsWithChildren;

const Section = ({ withTitle = false, children }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient
      {...theme.color.gradient.statSection}
      horizontal
      style={[styles.section, withTitle && styles.sectionWithTitle]}
    >
      {children}
    </LinearGradient>
  );
};

export default function Stats() {
  const { refresh: refreshRankedStats, isRefreshing: isRefreshingRankedStats } = useUserRankedStats();
  const { refresh: refreshCrewsStats, isRefreshing: isRefreshingCrewsStats } = useUserCrewsStats();
  const { refresh: refreshGlobalStats, isRefreshing: isRefreshingGlobalStats } = useUserGlobalStats();
  const { refresh: refreshCharacterStats, isRefreshing: isRefreshingCharacterStats } = useUserCharacterStats();

  const refresh = () => {
    refreshRankedStats();
    refreshCrewsStats();
    refreshGlobalStats();
    refreshCharacterStats();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          onRefresh={refresh}
          refreshing={
            isRefreshingRankedStats || isRefreshingCrewsStats || isRefreshingGlobalStats || isRefreshingCharacterStats
          }
        />
      }
    >
      <Section withTitle>
        <RankedStats />
      </Section>
      <Section withTitle>
        <CrewsStats />
      </Section>
      <Section>
        <GlobalStats />
      </Section>
      <Section>
        <CharacterStats />
      </Section>
    </ScrollView>
  );
}

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
