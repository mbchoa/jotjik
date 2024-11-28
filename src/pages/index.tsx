import { ProfileCard } from '@/components/ProfileCard';
import { trpc } from '@/utils/api';
import { signIn, useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import Timer from '../components/Timer';

const Home = () => {
  const { data: session } = useSession();
  const { mutateAsync: saveSession, isLoading: isSaving } =
    trpc.timedSessions.saveTimedSession.useMutation();

  const handleSaveTimedSession = useCallback(
    async (startedAt: string, duration: number) => {
      const payload = { startedAt, duration };

      if (!session) {
        // If the user is not logged in, queue the session to local storage
        localStorage.setItem('queuedSession', JSON.stringify(payload));
        await signIn('undefined', { callbackUrl: '/sessions' });
      } else {
        // If the user is logged in, save the session to the database
        await saveSession(payload);

        toast('Session saved!', {
          type: 'success',
        });
      }
    },
    [saveSession, session]
  );

  return (
    <div className="flex flex-col w-full gap-y-4 h-full flex-1">
      <ProfileCard />
      <div className="flex flex-1 items-center justify-center rounded-lg shadow flex-col">
        <Timer isSaving={isSaving} onSave={handleSaveTimedSession} />
      </div>
    </div>
  );
};

export default Home;
