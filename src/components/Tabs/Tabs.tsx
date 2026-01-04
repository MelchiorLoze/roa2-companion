import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Tab } from './Tab';

type Props<T extends string> = {
  tabs: { title: T; onPress: () => void }[];
  selectedTab: NoInfer<T>;
};

export const Tabs = <T extends string>({ tabs, selectedTab }: Readonly<Props<T>>) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Tab key={tab.title} onPress={tab.onPress} selected={tab.title === selectedTab} title={tab.title} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
  },
});
