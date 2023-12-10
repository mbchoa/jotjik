import Loader from '@/components/Loader';
import RecordList from '@/components/RecordList';
import { TimerContext } from '@/contexts/TimerContext';
import { appRouter } from '@/server/api/root';
import { createInnerTRPCContext } from '@/server/api/trpc';
import { authOptions } from '@/server/auth';
import { trpc } from '@/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import superjson from 'superjson';
import type { Session } from 'types';

const Stats = () => {
  const { data, isLoading, refetch } = trpc.timedSessions.getAllTimedSessions.useQuery();
  const { mutateAsync: saveSession, isLoading: isSaving } =
    trpc.timedSessions.saveTimedSession.useMutation({
      onSuccess: async () => {
        localStorage.removeItem('queuedSession');
        await refetch();
      },
    });
  const { resumeFromLocalStorage } = useContext(TimerContext);

  useEffect(() => {
    if (localStorage.getItem('preAuthTimerProgress')) {
      resumeFromLocalStorage();
    }
  }, [resumeFromLocalStorage]);

  useEffect(() => {
    async function saveQueuedSession(session: Session) {
      await saveSession(session);
    }
    const queuedSessionString = localStorage.getItem('queuedSession');
    if (queuedSessionString !== null) {
      const queuedSession = JSON.parse(queuedSessionString) as Session;
      void saveQueuedSession(queuedSession);
    }
  }, [saveSession]);

  return (
    <section className="h-full">
      <Link
        href="/"
        className="mb-4 block before:mr-2 before:text-lg before:leading-5 before:content-['←']"
      >
        Back
      </Link>
      {isLoading || isSaving || data === undefined ? (
        <div className="flex h-full items-center justify-center">
          <Loader className="h-10 w-10" />
        </div>
      ) : (
        <RecordList sessions={data} />
      )}
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin?callbackUrl=%2Fstats',
        permanent: false,
      },
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });

  await helpers.timedSessions.getAllTimedSessions.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

export default Stats;
