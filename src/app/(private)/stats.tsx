import { LinearGradient } from 'expo-linear-gradient';
import { type PropsWithChildren } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { CharacterStats } from '@/features/stats/components/CharacterStats/CharacterStats';
import { GlobalStats } from '@/features/stats/components/GlobalStats/GlobalStats';
import { RankedStats } from '@/features/stats/components/RankedStats/RankedStats';
import { useUserCharacterStats } from '@/features/stats/hooks/business/useUserCharacterStats/useUserCharacterStats';
import { useUserGlobalStats } from '@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats';
import { useUserRankedStats } from '@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats';

const Section = ({ children }: PropsWithChildren) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient colors={theme.color.statsGradient} end={[1, 0]} start={[1 / 3, 0]} style={styles.section}>
      {children}
    </LinearGradient>
  );
};

export default function Stats() {
  const { refresh: refreshRankedStats } = useUserRankedStats();
  const { refresh: refreshGlobalStats } = useUserGlobalStats();
  const { refresh: refreshCharacterStats } = useUserCharacterStats();

  const refresh = () => {
    refreshRankedStats();
    refreshGlobalStats();
    refreshCharacterStats();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}
    >
      <Section>
        <RankedStats />
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
    gap: theme.spacing.s,
  },
}));
