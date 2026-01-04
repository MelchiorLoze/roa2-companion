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
  tournaments: Tournament[];
  isError: boolean;
};

const Content = ({ refreshControl, tournaments, isError }: Readonly<Props>) => {
  if (isError)
    return (
      <ScrollView refreshControl={refreshControl}>
        <Alert text="An error occurred while loading tournaments. Please try again later." />
      </ScrollView>
    );

  if (tournaments.length === 0)
    return (
      <ScrollView refreshControl={refreshControl}>
        <Alert text="No active tournaments at the moment. Please check back later." />
      </ScrollView>
    );

  return <TournamentList refreshControl={refreshControl} tournaments={tournaments} />;
};

export default function ESport() {
  const { tournaments, isLoading, isRefreshing, isError, selectedTab, selectActiveTab, selectPastTab, refresh } =
    useTournamentsTab();

  if (isLoading) return <Spinner />;

  const refreshControl = <RefreshControl onRefresh={refresh} refreshing={isRefreshing} />;

  return (
    <View style={styles.container}>
      <Tabs
        selectedTab={selectedTab}
        tabs={[
          { title: 'active', onPress: selectActiveTab },
          { title: 'past', onPress: selectPastTab },
        ]}
      />
      <Content isError={isError} key={selectedTab} refreshControl={refreshControl} tournaments={tournaments} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
