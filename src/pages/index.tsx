import { trpc } from '@/utils/api';
import { format } from 'date-fns';
import { signIn, useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { type Session } from 'types';
import Timer from '../components/Timer';

const Home = () => {
  const { data: session } = useSession();
  const { mutateAsync: saveSession, isLoading: isSaving } =
    trpc.timedSessions.saveTimedSession.useMutation();

  const currentTime = Date.now();
  const dayTokens = format(currentTime, 'do').split(/(\d+)/).slice(1);
  const month = format(currentTime, 'MMMM');
  const year = format(currentTime, 'yyyy');

  const handleSaveTimedSession = useCallback(
    async (startedAt: string, duration: number) => {
      const payload = { startedAt, duration };

      if (!session) {
        const existingQueuedSessions = localStorage.getItem('queuedSessions');
        const parsedQueuedSessions = JSON.parse(existingQueuedSessions ?? '[]') as Session[];
        // If the user is not logged in, queue the session to local storage
        localStorage.setItem('queuedSessions', JSON.stringify([...parsedQueuedSessions, payload]));
        await signIn('undefined', { callbackUrl: '/stats' });
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
    <>
      <header className="text-center">
        <h1 className="flex justify-center text-3xl">
          {month} {dayTokens[0]}
          <sup className="pt-2 text-base">{dayTokens[1]}</sup>&nbsp;
          {year}
        </h1>
        <p className="mt-2 text-xl">{format(currentTime, 'EEEE')}</p>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <Timer isSaving={isSaving} onSave={handleSaveTimedSession} />
      </div>
    </>
  );
};

export default Home;
