import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { TournamentState } from '../../types/tournament';

type Props = {
  tournamentState: TournamentState;
  pressed?: boolean;
};

export const TournamentStateTag = ({ tournamentState, pressed = false }: Readonly<Props>) => {
  return (
    <View style={styles.container(tournamentState, pressed)}>
      <Text style={styles.text(tournamentState, pressed)}>{tournamentState}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: (tournamentState: TournamentState, pressed: boolean) => ({
    paddingHorizontal: theme.spacing.xxs,
    borderWidth: 1.3,
    borderColor: pressed
      ? theme.color.black
      : tournamentState === TournamentState.UPCOMING
        ? theme.color.borderLight
        : theme.color.accent,
    justifyContent: 'center',
  }),
  text: (tournamentState: TournamentState, pressed: boolean) => ({
    color: pressed
      ? theme.color.black
      : tournamentState === TournamentState.UPCOMING
        ? theme.color.borderLight
        : theme.color.accent,
    fontFamily: theme.font.secondary.bold,
    fontSize: 12,
    lineHeight: 10,
    textTransform: 'uppercase',
  }),
}));
