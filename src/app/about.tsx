import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ActionRow } from '@/components/ActionRow/ActionRow';
import { Separator } from '@/components/Separator/Separator';

export default function About() {
  return (
    <>
      <View style={styles.descriptionContainer}>
        <Text style={styles.paragraph}>
          This project is a fan-made creation and is not affiliated with Aether Studios or Offbrand Games in any
          official capacity. All trademarks, registered trademarks, product names, and company names or logos mentioned
          herein are the property of their respective owners. This project was created solely as a community resource,
          for entertainment and educational purposes.
        </Text>
        <Text style={styles.paragraph}>
          The app is completely free to use, contains no advertisements, and does not generate any revenue. It does not
          collect nor transmit any personal information or data from users to any third party. Everything stays
          exclusively between your device and the official game servers.
        </Text>
      </View>
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
  descriptionContainer: {
    gap: theme.spacing.xl,
    padding: theme.spacing.l,
  },
  paragraph: {
    fontFamily: theme.font.primary.regular,
    color: theme.color.white,
    gap: theme.spacing.xl,
  },
}));
