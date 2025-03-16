import { Button } from '@/components';
import { useAuth } from '@/hooks/business';

export default function More() {
  const { logout } = useAuth();

  // link to wiki
  // link to reddit
  // link to discord
  // link to frame data
  // link to stage viewer

  return <Button label="Logout" onPress={logout} />;
}
