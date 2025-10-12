import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { Tournament } from '../../types/tournament';

type Props = Readonly<{
  tournament: Tournament;
}>;

export const TournamentCard = ({ tournament }: Props) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {tournament.imageUrl && <Image source={tournament.imageUrl.toString()} style={styles.image} />}
        <Text style={[styles.text, styles.title]}>{tournament.name}</Text>
        <MaterialIcons color={theme.color.white} name="arrow-outward" size={24} />
      </View>
      <View style={styles.header}>
        <Text style={styles.text}>{tournament.state}</Text>
        <Text style={styles.text}>{tournament.startAt.toFormat('MMMM dd, yyyy')}</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.text}>{tournament.countryCode}</Text>
        <Text style={styles.text}>{tournament.isOnline ? 'Online' : 'In-person'}</Text>
        <Text style={styles.text}>{tournament.numAttendees} attendees</Text>
      </View>
      {tournament.events.map((event) => (
        <View key={event.id} style={styles.header}>
          <Text style={styles.text}>{event.name}</Text>
          <Text style={styles.text}>{event.numEntrants} entrants</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.s,
    backgroundColor: theme.color.background,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  text: {
    color: theme.color.white,
    fontFamily: theme.font.primary.regular,
    flexShrink: 1,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  image: { height: 48, width: 48 },
}));
