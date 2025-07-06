import { useRouter } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ActionRow } from '@/components/ActionRow/ActionRow';
import { Separator } from '@/components/Separator/Separator';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';

type ExternalLink = Readonly<{
  label: string;
  url: URL;
  logo?: URL;
}>;

const externalLinks: readonly ExternalLink[] = [
  {
    label: 'Game wiki',
    url: new URL('https://dragdown.wiki/wiki/RoA2'),
    logo: new URL('https://dragdown.wiki/favicon.ico'),
  },
  {
    label: 'Frame data',
    url: new URL('https://rivalsframedata.com/'),
  },
  {
    label: 'Elo History',
    url: new URL('https://scarekroow.com/roa2-ranked-stats.html'),
  },
  {
    label: 'Game Reddit',
    url: new URL('https://www.reddit.com/r/RivalsOfAether/'),
    logo: new URL('https://www.redditstatic.com/shreddit/assets/favicon/64x64.png'),
  },
  {
    label: 'Game Discord',
    url: new URL('https://discord.gg/roa'),
    logo: new URL(
      'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/62fddf0fde45a8baedcc7ee5_847541504914fd33810e70a0ea73177e%20(2)-1.png',
    ),
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
