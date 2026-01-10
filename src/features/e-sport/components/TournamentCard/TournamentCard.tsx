import { MaterialIcons } from '@expo/vector-icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type ExternalPathString, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { OutlinedText } from '@/components/OutlinedText/OutlinedText';
import { Separator } from '@/components/Separator/Separator';

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
    <Pressable onPress={() => router.push(tournament.url.toString() as ExternalPathString)}>
      {({ pressed }) => (
        <LinearGradient
          {...theme.gradient.horizontal}
          colors={theme.color.borderGradient(pressed)}
          style={styles.borderGradient}
        >
          <LinearGradient
            {...theme.gradient.horizontal}
            colors={theme.color.cardGradient(pressed)}
            style={styles.container}
          >
            <View style={styles.header}>
              {tournament.imageUrl && <Image source={tournament.imageUrl.toString()} style={styles.image} />}
              <View style={styles.headerText}>
                <View style={styles.titleContainer}>
                  <Text numberOfLines={1} style={[styles.text(pressed), styles.title]}>
                    {tournament.name}
                  </Text>
                  <MaterialIcons name="arrow-outward" style={styles.redirectIcon(pressed)} />
                </View>

                <View style={[styles.info, styles.dateInfo]}>
                  <OutlinedText style={styles.state(tournament.state)} text={tournament.state.toUpperCase()} />
                  <Text style={styles.text(pressed)}>{formatDateRange(tournament.startAt, tournament.endAt)}</Text>
                </View>

                <View style={styles.info}>
                  {tournament.isOnline && (
                    <>
                      <MaterialIcons name="wifi" style={styles.wifiIcon(pressed)} />
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
                  <Separator pressed={pressed} variant="gradient" />
                  <View>
                    <Text numberOfLines={1} style={[styles.text(pressed), styles.eventTitle]}>
                      {event.name}
                    </Text>
                    <Text style={[styles.text(pressed), styles.eventInfo]}>
                      {event.startAt.toFormat('MMM dd')} - {event.numEntrants} entrants
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </LinearGradient>
        </LinearGradient>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  borderGradient: {
    flex: 1,
    padding: theme.spacing.xxs,
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
  container: {
    padding: theme.spacing.s,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  headerText: {
    flexShrink: 1,
    gap: theme.spacing.xs,
  },
  image: {
    height: 'auto',
    aspectRatio: 1,
  },
  titleContainer: {
    flexShrink: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.s,
  },
  text: (pressed?: boolean) => ({
    flexShrink: 1,
    color: pressed ? theme.color.black : theme.color.white,
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    textTransform: 'uppercase',
  }),
  title: {
    fontSize: 18,
    fontFamily: theme.font.primary.regular,
  },
  redirectIcon: (pressed?: boolean) => ({
    color: pressed ? theme.color.black : theme.color.white,
    fontSize: 24,
  }),
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInfo: {
    gap: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  state: (tournamentState: TournamentState) => ({
    fontSize: 16,
    fontFamily: theme.font.secondary.bold,
    strokeWidth: 2,
    color: theme.color[tournamentState],
  }),
  wifiIcon: (pressed?: boolean) => ({
    color: pressed ? theme.color.black : theme.color.white,
    fontSize: 18,
    paddingBottom: theme.spacing.xxs,
  }),
  events: {
    width: '100%',
    gap: theme.spacing.xs,
  },
  event: {
    gap: theme.spacing.xs,
  },
  eventTitle: {
    fontFamily: theme.font.primary.italic,
  },
  eventInfo: {
    fontSize: 12,
  },
}));
