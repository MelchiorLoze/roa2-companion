import { useState } from 'react';

import { Tabs } from '@/components/Tabs/Tabs';
import { CrewsStats } from '@/features/stats/components/CrewsStats/CrewsStats';
import { GlobalStats } from '@/features/stats/components/GlobalStats/GlobalStats';
import { RankedStats } from '@/features/stats/components/RankedStats/RankedStats';

export default function Stats() {
  const [selectedTab, setSelectedTab] = useState<'ranked' | 'crews' | 'global'>('ranked');

  return (
    <>
      <Tabs
        selectedTab={selectedTab}
        tabs={[
          { title: 'ranked', onPress: () => setSelectedTab('ranked') },
          { title: 'crews', onPress: () => setSelectedTab('crews') },
          { title: 'global', onPress: () => setSelectedTab('global') },
        ]}
      />

      {selectedTab === 'ranked' && <RankedStats />}
      {selectedTab === 'crews' && <CrewsStats />}
      {selectedTab === 'global' && <GlobalStats />}
    </>
  );
}
