import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { TournamentState } from '../../types/tournament';

type Props = {
  tournamentState: TournamentState;
};

export const TournamentStateTag = ({ tournamentState }: Readonly<Props>) => {
  return (
    <View style={styles.container(tournamentState)}>
      <Text style={styles.text(tournamentState)}>{tournamentState}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: (tournamentState: TournamentState) => ({
    paddingHorizontal: theme.spacing.xxs,
    backgroundColor: tournamentState === TournamentState.UPCOMING ? 'lightblue' : 'lightgreen',
    borderWidth: 1,
    borderColor: tournamentState === TournamentState.UPCOMING ? 'darkblue' : 'darkgreen',
    justifyContent: 'center',
  }),
  text: (tournamentState: TournamentState) => ({
    color: tournamentState === TournamentState.UPCOMING ? 'darkblue' : 'darkgreen',
    fontFamily: theme.font.secondary.bold,
    fontSize: 12,
    lineHeight: 10,
    textTransform: 'uppercase',
  }),
}));
