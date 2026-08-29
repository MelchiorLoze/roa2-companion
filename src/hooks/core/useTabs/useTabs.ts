import { useState } from 'react';

type Tabs<T extends string> = {
  selectedTab: T;
  tabs: { [K in T]: { label: K; onPress: () => void } }[T][];
  getValueForSelectedTab: <U>(valuePerTab: Record<T, U>) => U;
};

export const useTabs = <T extends string>(options: readonly [T, ...T[]]): Tabs<T> => {
  const [selectedTab, setSelectedTab] = useState(options[0]);

  const tabs = options.map((option) => ({
    label: option,
    onPress: () => setSelectedTab(option),
  })) as Tabs<T>['tabs'];

  const getValueForSelectedTab = <U>(valuePerTab: Record<T, U>) => valuePerTab[selectedTab];

  return { selectedTab, tabs, getValueForSelectedTab } as const;
};
