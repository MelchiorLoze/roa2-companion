import { MaterialIcons } from '@expo/vector-icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Image } from 'expo-image';
import type { ExternalPathString } from 'expo-router';
import { useRouter } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Separator } from '@/components/Separator/Separator';

import type { Tournament } from '../../types/tournament';
import { TournamentStateTag } from './TournamentStateTag';

type Props = {
  tournament: Tournament;
};

export const TournamentCard = ({ tournament }: Readonly<Props>) => {
  const router = useRouter();

  const flagIcon = tournament.countryCode ? getUnicodeFlagIcon(tournament.countryCode) : null;

  return (
    <Pressable onPress={() => router.push(tournament.url.toString() as ExternalPathString)} style={styles.container}>
      <View style={styles.header}>
        {tournament.imageUrl && <Image source={tournament.imageUrl.toString()} style={styles.image} />}
        <View style={styles.headerText}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={[styles.text, styles.title]}>
              {tournament.name}
            </Text>
            <MaterialIcons name="arrow-outward" style={styles.redirectIcon} />
          </View>

          <View style={styles.info}>
            <TournamentStateTag tournamentState={tournament.state} />
            <Text style={styles.text}>{tournament.startAt.toFormat('MMM dd, yyyy')}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.text}>
              {flagIcon && `${flagIcon} - `}
              {tournament.isOnline && (
                <>
                  <MaterialIcons name="wifi" style={styles.wifiIcon} />
                  {' - '}
                </>
              )}
              {tournament.numAttendees} attendees
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.events}>
        {tournament.events.map((event) => (
          <Fragment key={event.id}>
            <Separator />
            <View style={styles.event}>
              <Text numberOfLines={1} style={[styles.text, styles.eventTitle]}>
                {event.name}
              </Text>
              <Text style={[styles.text, styles.eventInfo]}>{event.numEntrants} entrants</Text>
            </View>
          </Fragment>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.s,
    backgroundColor: theme.color.background,
    borderWidth: 1,
    borderColor: theme.color.border,
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
    height: '100%',
    width: 78,
  },
  titleContainer: {
    flexShrink: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.s,
  },
  text: {
    flexShrink: 1,
    color: theme.color.white,
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontFamily: theme.font.primary.regular,
  },
  redirectIcon: {
    color: theme.color.white,
    fontSize: 24,
  },
  info: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  wifiIcon: {
    color: theme.color.white,
    fontSize: 14,
  },
  events: {
    width: '100%',
  },
  event: {
    paddingVertical: theme.spacing.xs,
  },
  eventTitle: {
    fontFamily: theme.font.primary.italic,
  },
  eventInfo: {
    fontSize: 12,
  },
}));
