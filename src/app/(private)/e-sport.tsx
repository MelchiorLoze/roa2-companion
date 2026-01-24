import { type ComponentProps } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Alert } from '@/components/Alert/Alert';
import { Spinner } from '@/components/Spinner/Spinner';
import { Tabs } from '@/components/Tabs/Tabs';
import { TournamentList } from '@/features/e-sport/components/TournamentList/TournamentList';
import { useTournamentsTab } from '@/features/e-sport/hooks/business/useTournamentsTab/useTournamentsTab';
import { type Tournament } from '@/features/e-sport/types/tournament';

type Props = {
  refreshControl: ComponentProps<typeof ScrollView>['refreshControl'];
  tournaments: Tournament[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

const Content = ({ refreshControl, tournaments, isLoading, isError }: Readonly<Props>) => {
  if (isLoading) return <Spinner />;

  if (isError || !tournaments)
    return (
      <ScrollView refreshControl={refreshControl}>
        <Alert text="An error occurred while loading tournaments. Please try again later." />
      </ScrollView>
    );

  return <TournamentList refreshControl={refreshControl} tournaments={tournaments} />;
};

export default function ESport() {
  const { tabs, selectedTab, tournaments, isLoading, isError, isRefreshing, refresh } = useTournamentsTab();

  const refreshControl = <RefreshControl onRefresh={refresh} refreshing={isRefreshing} />;

  return (
    <View style={styles.container}>
      <Tabs selectedTab={selectedTab} tabs={tabs} />
      <Content
        isError={isError}
        isLoading={isLoading}
        key={selectedTab}
        refreshControl={refreshControl}
        tournaments={tournaments}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
