import { Spinner } from '@/components/Spinner/Spinner';
import { TournamentList } from '@/features/e-sport/components/TournamentList/TournamentList';
import { useGetTournaments } from '@/features/e-sport/hooks/data/useGetTournaments';

export default function ESport() {
  const { tournaments, isLoading } = useGetTournaments();

  if (isLoading) return <Spinner />;

  return <TournamentList tournaments={tournaments} />;
}
