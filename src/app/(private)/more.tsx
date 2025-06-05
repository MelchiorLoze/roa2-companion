import { useRouter } from 'expo-router';
import { FlatList, type ListRenderItem, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ActionRow } from '@/components/ActionRow/ActionRow';
import { Separator } from '@/components/Separator/Separator';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';

type ExternalLink = {
  label: string;
  url: URL;
  logo?: URL;
};

const externalLinks: ExternalLink[] = [
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
    label: 'Stage viewer',
    url: new URL('https://clamtime.github.io/rivals2-stage-viewer/'),
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

const keyExtractor = (item: ExternalLink) => item.label;

const renderItem: ListRenderItem<ExternalLink> = ({ item }) => <ActionRow {...item} iconName="arrow-outward" />;

export default function More() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <FlatList
        ItemSeparatorComponent={Separator}
        data={externalLinks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
      />

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
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.xl,
  },
  list: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderColor: theme.color.border,
  },
}));
