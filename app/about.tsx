import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ActionRow, Separator } from '@/components';

export default function About() {
  return (
    <>
      <Text style={styles.description}>
        This project is a fan-made creation and is not affiliated with Aether Studios or Offbrand Games in any official
        capacity. All trademarks, registered trademarks, product names, and company names or logos mentioned herein are
        the property of their respective owners. This project was created solely as a community resource, for
        entertainment and educational purposes.{'\n\n'}The app is completely free to use, contains no advertisements,
        and does not generate any revenue. It does not collect or transmit any personal information or data from users.
      </Text>
      <Separator />
      <ActionRow
        iconName="arrow-outward"
        label="GitHub"
        logo={new URL('https://github.githubassets.com/favicons/favicon-dark.png')}
        url={new URL('https://github.com/MelchiorLoze/roa2-companion')}
      />
      <Separator />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  description: {
    fontFamily: theme.font.primary.regular,
    color: theme.color.white,
    padding: theme.spacing.l,
    fontSize: 14,
  },
}));
