import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

export const LogoutButton = ({ onPress }: Props) => {
  return (
    <FontAwesome.Button
      backgroundColor="transparent"
      color="red"
      iconStyle={styles.icon}
      name="power-off"
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 0,
  },
});
