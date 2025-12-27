import { Spinner } from '@/components/Spinner/Spinner';
import { TournamentList } from '@/features/e-sport/components/TournamentList/TournamentList';
import { useGetActiveTournaments } from '@/features/e-sport/hooks/data/useGetActiveTournaments';

export default function ESport() {
  const { tournaments, isLoading, isError, error, refetch, isRefetching } = useGetActiveTournaments();

  if (isLoading) return <Spinner />;

  if (isError) throw error;

  return <TournamentList isRefreshing={isRefetching} onRefresh={() => void refetch()} tournaments={tournaments} />;
}
