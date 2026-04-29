import { type ComponentType } from 'react';

import { Tabs } from '@/components/Tabs/Tabs';
import { CrewsStats } from '@/features/stats/components/CrewsStats/CrewsStats';
import { DoublesStats } from '@/features/stats/components/DoublesStats/DoublesStats';
import { GlobalStats } from '@/features/stats/components/GlobalStats/GlobalStats';
import { RankedStats } from '@/features/stats/components/RankedStats/RankedStats';
import { XpRotationalBonusBanner } from '@/features/store/components/XpRotationalBonusBanner/XpRotationalBonusBanner';
import { useTabs } from '@/hooks/core/useTabs/useTabs';

const STATS_TABS = ['ranked', '2v2', 'crews', 'global'] as const;
type StatTab = (typeof STATS_TABS)[number];

const componentPerTab: Record<StatTab, ComponentType> = {
  ranked: RankedStats,
  '2v2': DoublesStats,
  crews: CrewsStats,
  global: GlobalStats,
} as const;

export default function Stats() {
  const { tabs, selectedTab, getValueForSelectedTab } = useTabs(STATS_TABS);

  const TabContent = getValueForSelectedTab(componentPerTab);

  return (
    <>
      <Tabs selectedTab={selectedTab} tabs={tabs} />

      <TabContent />

      <XpRotationalBonusBanner />
    </>
  );
}
