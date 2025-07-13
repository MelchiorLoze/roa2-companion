import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';
import { CHARACTER_ICONS } from '@/types/character';

import { useUserCharacterStats } from '../../hooks/business/useUserCharacterStats/useUserCharacterStats';

export const CharacterStats = () => {
  const { stats, isLoading } = useUserCharacterStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <>
      <Text style={styles.title}>Characters</Text>

      <View>
        <View style={styles.tableRow()}>
          <View style={styles.firstColumn} />
          <Text style={[styles.label, styles.otherColumns]}>Level</Text>
          <Text style={[styles.label, styles.otherColumns]}>Games</Text>
        </View>
        {stats
          .sort((a, b) => b.level - a.level || b.gameCount - a.gameCount)
          .map((charStat, index) => (
            <View key={charStat.character} style={styles.tableRow(index === stats.length - 1)}>
              <View style={styles.firstColumn}>
                <Image contentFit="contain" source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
              </View>
              <Text style={[styles.label, styles.otherColumns]}>{charStat.level}</Text>
              <Text style={[styles.label, styles.otherColumns]}>{charStat.gameCount}</Text>
            </View>
          ))}
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
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  icon: {
    width: 24,
    height: 24,
  },
  tableRow: (isLast?: boolean) => ({
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: isLast ? 0 : 1,
    borderColor: theme.color.accent,
  }),
  firstColumn: {
    flex: 1 / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherColumns: {
    flex: 2 / 5,
    paddingLeft: theme.spacing.s,
    borderLeftWidth: 1,
    borderColor: theme.color.accent,
  },
}));
