import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Tab } from './Tab';

type Props<T extends string> = {
  tabs: { label: T; onPress: () => void }[];
  selectedTab: NoInfer<T>;
};

export const Tabs = <T extends string>({ tabs, selectedTab }: Readonly<Props<T>>) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Tab key={tab.label} label={tab.label} onPress={tab.onPress} selected={tab.label === selectedTab} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing.s,
  },
}));
