import Loader from '@/components/Loader';
import RecordList from '@/components/RecordList';
import { StreakCard } from '@/components/StreakCard';
import { TimerContext } from '@/contexts/TimerContext';
import { trpc } from '@/utils/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import type { Session } from 'types';

const Stats = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data, isLoading, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.timedSessions.getInfiniteTimedSessions.useInfiniteQuery(
      {
        limit: 10,
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
        <>
          <Link
            href="/"
            className="mb-4 block before:mr-2 before:text-lg before:leading-5 before:content-['←']"
          >
            Back
          </Link>
          <div className="space-y-4">
            <StreakCard />
            {/* <MetricCard /> */}
            <RecordList sessions={data.pages.flatMap((page) => page.timedSessions)} />
          </div>
        </>
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
