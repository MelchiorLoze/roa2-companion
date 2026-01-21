import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '../LinearGradient/LinearGradient';
import { Tab } from './Tab';

type Props<T extends string> = {
  tabs: { title: T; onPress: () => void }[];
  selectedTab: NoInfer<T>;
};

export const Tabs = <T extends string>({ tabs, selectedTab }: Readonly<Props<T>>) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient {...theme.color.gradient.tab} style={styles.tabContainer} vertical>
      {tabs.map((tab) => (
        <Tab key={tab.title} onPress={tab.onPress} selected={tab.title === selectedTab} title={tab.title} />
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
