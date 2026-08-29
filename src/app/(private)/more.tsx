import { type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { DiscordIcon, DragdownIcon, RedditIcon } from '@/assets/images/link';
import { ActionRow } from '@/components/ActionRow/ActionRow';
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

const renderItem = (item: ExternalLink) => <ActionRow {...item} iconName="arrow-outward" key={item.label} />;

export default function More() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View>{externalLinks.map(renderItem)}</View>

      <View>
        <ActionRow iconName="arrow-forward" label="About this app" onPress={() => router.navigate('/about')} />
      </View>

      <View>
        <ActionRow iconName="logout" label="Log out" onPress={logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.xxl,
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.s,
  },
}));
