import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { GitHubIcon, KoFiIcon, MailIcon } from '@/assets/images/link';
import { ActionRow } from '@/components/ActionRow/ActionRow';
import { Separator } from '@/components/Separator/Separator';
import { COMPANION_SUPPORT_URI } from '@/constants';

export default function About() {
  return (
    <View style={styles.container}>
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
        logo={GitHubIcon}
        url={new URL('https://github.com/MelchiorLoze/roa2-companion')}
      />
      <Separator />
      <ActionRow
        iconName="arrow-outward"
        label="Report an issue"
        logo={MailIcon}
        url={new URL(COMPANION_SUPPORT_URI)}
      />
      <Separator />
      <ActionRow
        iconName="arrow-outward"
        label="Support the project"
        logo={KoFiIcon}
        url={new URL('https://ko-fi.com/roa2companion')}
      />
      <Separator />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.highlight,
  },
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
