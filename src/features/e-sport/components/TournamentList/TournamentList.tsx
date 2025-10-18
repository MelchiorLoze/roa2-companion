import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { Tournament } from '../../types/tournament';
import { TournamentCard } from '../TournamentCard/TournamentCard';

const keyExtractor = (item: Tournament) => item.id.toString();
const renderItem = ({ item }: { item: Tournament }) => <TournamentCard tournament={item} />;

type Props = {
  tournaments: Tournament[];
};

export const TournamentList = ({ tournaments }: Readonly<Props>) => {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={tournaments}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
}));
