import { MaterialIcons } from '@expo/vector-icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Image } from 'expo-image';
import { type ExternalPathString, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Card } from '@/components/Card/Card';
import { FancyText } from '@/components/FancyText/FancyText';

import { type Tournament, type TournamentState } from '../../types/tournament';
import { formatDateRange } from '../../utils/formatDateRange';

type Props = {
  tournament: Tournament;
};

export const TournamentCard = ({ tournament }: Readonly<Props>) => {
  const { theme } = useUnistyles();
  const router = useRouter();

  const flagIcon = tournament.countryCode ? getUnicodeFlagIcon(tournament.countryCode) : null;

  return (
    <Card
      contentStyle={styles.content}
      onPress={() => router.push(tournament.url.toString() as ExternalPathString)}
      style={styles.container}
    >
      {(pressed) => (
        <>
          <View style={styles.header}>
            {tournament.imageUrl && <Image source={tournament.imageUrl.toString()} style={styles.image} />}
            <View style={styles.headerText}>
              <View style={styles.titleContainer}>
                <View style={styles.title}>
                  <FancyText
                    gradient={{ ...theme.color.gradient.labelText(pressed), direction: 'vertical' }}
                    style={styles.titleLabel}
                    text={tournament.name}
                  />
                </View>
                <MaterialIcons name="arrow-outward" style={styles.redirectIcon(pressed)} />
              </View>

              <View style={[styles.info, styles.dateInfo]}>
                <FancyText style={styles.state(tournament.state)} text={tournament.state} />
                <FancyText style={styles.text(pressed)} text={formatDateRange(tournament.startAt, tournament.endAt)} />
              </View>

              <View style={styles.info}>
                {tournament.isOnline && (
                  <>
                    <MaterialIcons name="language" style={styles.onlineIcon(pressed)} />
                    <Text style={styles.text(pressed)}>{' - '}</Text>
                  </>
                )}
                <Text style={styles.text(pressed)}>
                  {flagIcon && `${flagIcon} - `}
                  {tournament.numAttendees} attendees
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.events}>
            {tournament.events.map((event) => (
              <View key={event.id} style={styles.event}>
                <View style={styles.separator(pressed)} />
                <View>
                  <FancyText style={{ ...styles.text(pressed), ...styles.eventTitle }} text={event.name} />
                  <Text style={[styles.text(pressed), styles.eventInfo]}>
                    {event.startAt.toFormat('MMM dd')} - {event.numEntrants} entrants
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.s,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  image: {
    height: 'auto',
    aspectRatio: 1,
    borderRadius: 8,
  },
  headerText: {
    flexShrink: 1,
  },
  titleContainer: {
    flexShrink: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.xs,
  },
  title: {
    flexShrink: 1,
    overflow: 'hidden',
  },
  titleLabel: {
    fontSize: 18,
    fontFamily: theme.font.primary.bold,
    textTransform: 'uppercase',
  },
  redirectIcon: (pressed?: boolean) => ({
    color: pressed ? theme.color.black : theme.color.white,
    fontSize: 18 * runtime.fontScale,
  }),
  text: (pressed?: boolean) => ({
    flexShrink: 1,
    color: pressed ? theme.color.black : theme.color.white,
    fontFamily: theme.font.primary.bold,
    fontSize: 14,
    textTransform: 'uppercase',
  }),
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInfo: {
    gap: theme.spacing.xs,
  },
  state: (tournamentState: TournamentState) => ({
    fontSize: 14,
    fontFamily: theme.font.primary.bold,
    textTransform: 'uppercase',
    color: theme.color[tournamentState],
    strokeWidth: 2,
    strokeColor: theme.color.black,
  }),
  onlineIcon: (pressed?: boolean) => ({
    color: pressed ? theme.color.black : theme.color.white,
    fontSize: 20,
  }),
  separator: (pressed?: boolean) => ({
    height: 1,
    backgroundColor: pressed ? theme.color.itemSelectedPrimary : theme.color.itemPriceBackground,
  }),
  events: {
    width: '100%',
    gap: theme.spacing.xs,
  },
  event: {
    gap: theme.spacing.xs,
  },
  eventTitle: {
    fontSize: 14,
    skew: -0.2,
  },
  eventInfo: {
    fontSize: 12,
  },
}));
