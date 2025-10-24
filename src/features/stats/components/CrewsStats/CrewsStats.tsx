import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { CrewsIcon } from '../../assets/images/crews';
import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';

export const CrewsStats = () => {
  const { stats, isLoading } = useUserCrewsStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <>
      <Text style={styles.title}>Crews</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>{stats.setStats.setCount} sets</Text>
        <View style={styles.eloContainer}>
          <Image source={CrewsIcon} style={styles.icon} />
          <Text style={styles.label}>{stats.elo}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 20,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  eloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  icon: {
    width: 24,
    height: 24,
  },
}));
