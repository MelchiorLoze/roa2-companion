import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { FancyText } from '@/components/FancyText/FancyText';
import { type Character, CHARACTER_ICONS } from '@/types/character';

type CharacterStat = {
  character: Character;
  gameCount: number;
  level: number;
};

type Props = {
  readonly characterStats: CharacterStat[];
};

export const CharacterStatsTable = ({ characterStats }: Props) => {
  const { theme } = useUnistyles();

  const sorted = [...characterStats].sort((a, b) => b.level - a.level || b.gameCount - a.gameCount);

  return (
    <View>
      <View style={styles.headerRow}>
        <View style={styles.iconColumn} />
        <View style={[styles.dataColumn, styles.firstDataColumn]}>
          <FancyText
            gradient={{ ...theme.color.gradient.labelText(), direction: 'vertical' }}
            style={styles.label}
            text="Level"
          />
        </View>
        <View style={styles.dataColumn}>
          <FancyText
            gradient={{ ...theme.color.gradient.labelText(), direction: 'vertical' }}
            style={styles.label}
            text="Games"
          />
        </View>
      </View>
      {sorted.map((charStat, index) => (
        <View key={charStat.character} style={styles.row(index === sorted.length - 1)}>
          <View style={styles.iconColumn}>
            <Image contentFit="contain" source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
          </View>
          <Text style={[styles.label, styles.valueLabel, styles.dataColumn, styles.firstDataColumn]}>
            {charStat.level}
          </Text>
          <Text style={[styles.label, styles.valueLabel, styles.dataColumn]}>{charStat.gameCount}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  label: {
    fontFamily: theme.font.primary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  valueLabel: {
    color: theme.color.white,
  },
  icon: {
    width: 24,
    aspectRatio: 1,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: theme.color.statRowsBorder,
  },
  row: (isLast: boolean) => ({
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: isLast ? 0 : 1,
    borderColor: theme.color.statRowsBorder,
  }),
  iconColumn: {
    flex: 1 / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataColumn: {
    flex: 2 / 5,
    paddingLeft: theme.spacing.s,
    borderLeftWidth: 1,
    borderColor: theme.color.statRowsBorder,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxs,
  },
  firstDataColumn: {
    borderLeftWidth: 2,
  },
}));
