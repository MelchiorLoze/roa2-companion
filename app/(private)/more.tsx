import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ActionRow } from '@/components';
import { useAuth } from '@/hooks/business';

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
    label: 'Game Reddit',
    url: new URL('https://www.reddit.com/r/RivalsOfAether/'),
    logo: new URL('https://www.reddit.com/favicon.ico'),
  },
  {
    label: 'Game Discord',
    url: new URL('https://discord.gg/roa'),
    logo: new URL(
      'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/62fddf0fde45a8baedcc7ee5_847541504914fd33810e70a0ea73177e%20(2)-1.png',
    ),
  },
];

const Separator = () => <View style={styles.separator} />;

const keyExtractor = (item: ExternalLink) => item.label;

const renderItem = ({ item }: { item: ExternalLink }) => (
  <ActionRow iconName="arrow-outward" label={item.label} logo={item.logo} url={item.url} />
);

export default function More() {
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
  separator: {
    height: 1,
    backgroundColor: theme.color.border,
  },
}));
