import { RefreshControl, ScrollView } from 'react-native';

import { Alert } from '@/components/Alert/Alert';
import { Spinner } from '@/components/Spinner/Spinner';
import { TournamentList } from '@/features/e-sport/components/TournamentList/TournamentList';
import { useGetActiveTournaments } from '@/features/e-sport/hooks/data/useGetActiveTournaments';

export default function ESport() {
  const { tournaments, isLoading, isError, refetch, isRefetching } = useGetActiveTournaments();

  if (isLoading) return <Spinner />;

  const refreshControl = <RefreshControl onRefresh={() => void refetch()} refreshing={isRefetching} />;

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
}
