import type { ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { DiscordIcon, DragdownIcon, RedditIcon } from '@/assets/images/link';
import { ActionRow } from '@/components/ActionRow/ActionRow';
import { Separator } from '@/components/Separator/Separator';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';

type ExternalLink = Readonly<{
  label: string;
  url: URL;
  logo?: ImageSource;
}>;

const externalLinks: readonly ExternalLink[] = [
  {
    label: 'Dragdown Wiki',
    url: new URL('https://dragdown.wiki/wiki/RoA2'),
    logo: DragdownIcon,
  },
  {
    label: 'Elo History',
    url: new URL('https://scarekroow.com/roa2-ranked-stats.html'),
  },
  {
    label: 'Game Reddit',
    url: new URL('https://www.reddit.com/r/RivalsOfAether/'),
    logo: RedditIcon,
  },
  {
    label: 'Game Discord',
    url: new URL('https://discord.gg/roa'),
    logo: DiscordIcon,
  },
];

const renderItem = (item: ExternalLink) => (
  <Fragment key={item.label}>
    <ActionRow {...item} iconName="arrow-outward" />
    <Separator />
  </Fragment>
);

export default function More() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View>{externalLinks.map(renderItem)}</View>

        <View>
          <Separator />
          <ActionRow iconName="arrow-forward" label="About this app" onPress={() => router.navigate('/about')} />
          <Separator />
        </View>

        <View>
          <Separator />
          <ActionRow iconName="logout" label="Log out" onPress={logout} />
          <Separator />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xl,
  },
}));
