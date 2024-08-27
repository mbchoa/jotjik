import Loader from '@/components/Loader';
import { MetricsSection } from '@/components/MetricsSection';
import RecordList from '@/components/RecordList';
import { TimerContext } from '@/contexts/TimerContext';
import { trpc } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import type { Session } from 'types';

const Stats = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data, isLoading, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.timedSessions.getInfiniteTimedSessions.useInfiniteQuery(
      {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      {
        enabled: status === 'authenticated',
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const { mutateAsync: saveSession, isLoading: isSaving } =
    trpc.timedSessions.saveTimedSession.useMutation({
      onSuccess: async () => {
        localStorage.removeItem('queuedSession');
        await refetch();
      },
    });
  const { resumeFromLocalStorage } = useContext(TimerContext);

  useEffect(() => {
    if (status === 'authenticated' && localStorage.getItem('preAuthTimerProgress')) {
      resumeFromLocalStorage();
    }
  }, [resumeFromLocalStorage, status]);

  useEffect(() => {
    async function saveQueuedSession(session: Session) {
      await saveSession(session);
    }
    const queuedSessionString = localStorage.getItem('queuedSession');
    if (status === 'authenticated' && queuedSessionString !== null) {
      const queuedSession = JSON.parse(queuedSessionString) as Session;
      void saveQueuedSession(queuedSession);
    }
  }, [saveSession, status]);

  if (status === 'unauthenticated') {
    void router.push('/api/auth/signin?callbackUrl=%2Fstats');
    return;
  }

  return (
    <section className="h-full">
      {status !== 'authenticated' || isLoading || isSaving || !data || !data.pages[0] ? (
        <div className="flex h-full items-center justify-center">
          <Loader className="h-10 w-10 text-pink-900" />
        </div>
      ) : (
        <div className="space-y-4">
          <MetricsSection />
          <RecordList sessions={data.pages.flatMap((page) => page.timedSessions)} />
        </div>
      )}
      {hasNextPage && (
        <button
          className="mt-4 block mx-auto px-4 py-2 rounded-md bg-pink-900 text-white"
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? <Loader className="h-5 w-5" /> : 'Load More'}
        </button>
      )}
    </section>
  );
};

export default Stats;
