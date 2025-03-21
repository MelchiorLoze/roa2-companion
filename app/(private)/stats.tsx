import { Image } from 'expo-image';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BronzeIcon,
  ClairenIcon,
  DiamondIcon,
  EtalusIcon,
  FleetIcon,
  ForsburnIcon,
  GoldIcon,
  KraggIcon,
  LoxodontIcon,
  MasterIcon,
  MaypulIcon,
  OrcaneIcon,
  PlatinumIcon,
  RannoIcon,
  SilverIcon,
  StoneIcon,
  WrastorIcon,
  ZetterburnIcon,
} from '@/assets/images';
import { usePlayerStats } from '@/hooks/business';

const getRankIcon = (elo: number) => {
  if (elo < 499) return StoneIcon;
  if (elo < 699) return BronzeIcon;
  if (elo < 899) return SilverIcon;
  if (elo < 1099) return GoldIcon;
  if (elo < 1299) return PlatinumIcon;
  if (elo < 1499) return DiamondIcon;
  return MasterIcon;
};

export default function Stats() {
  const { stats, refresh, isLoading } = usePlayerStats();

  if (!stats || isLoading) return <ActivityIndicator color="white" size="large" style={styles.container} />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isLoading} />}
    >
      <View style={styles.section}>
        <Text style={styles.title}>Ranked (sets)</Text>
        <View>
          <View style={styles.labelWithIconContainer}>
            <Text style={styles.label}>Elo: {stats.rankedElo}</Text>
            <Image source={getRankIcon(stats.rankedElo)} style={styles.icon} />
          </View>
          <Text style={styles.label}>Matches: {stats.rankedMatchCount}</Text>
          <Text style={styles.label}>
            Wins: {stats.rankedWinCount} - Losses: {stats.rankedMatchCount - stats.rankedWinCount}
          </Text>
          <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Global (games)</Text>
        <View>
          <Text style={styles.label}>Matches: {stats.globalMatchCount}</Text>
          <Text style={styles.label}>
            Wins: {stats.globalWinCount} - Losses: {stats.globalMatchCount - stats.globalWinCount}
          </Text>
          <Text style={styles.label}>Winrate: {(stats.globalWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Per character (games)</Text>
        <View>
          <View style={styles.labelWithIconContainer}>
            <Image source={ClairenIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.claMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={EtalusIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.etaMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={FleetIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.fleMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={ForsburnIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.forMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={KraggIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.kraMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={LoxodontIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.loxMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={MaypulIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.mayMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={OrcaneIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.orcMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={RannoIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.ranMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={WrastorIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.wraMatchCount}</Text>
          </View>
          <View style={styles.labelWithIconContainer}>
            <Image source={ZetterburnIcon} style={styles.icon} />
            <Text style={styles.label}>{stats.zetMatchCount}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  section: {
    gap: theme.spacing.s,
  },
  title: {
    fontFamily: theme.font.primary.italic,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  labelWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  icon: {
    width: 24,
    height: 24,
  },
}));
