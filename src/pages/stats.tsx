import Loader from '@/components/Loader';
import RecordList from '@/components/RecordList';
import { TimerContext } from '@/contexts/TimerContext';
import { trpc } from '@/utils/api';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import type { Session } from 'types';

const Stats = () => {
  const { data, isLoading, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.timedSessions.getInfiniteTimedSessions.useInfiniteQuery(
      {
        limit: 10,
      },
      {
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
      {isLoading || isSaving || !data || !data.pages[0] ? (
        <div className="flex h-full items-center justify-center">
          <Loader className="h-10 w-10 text-pink-900" />
        </div>
      ) : (
        <RecordList sessions={data.pages.flatMap((page) => page.timedSessions)} />
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

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/api/auth/signin?callbackUrl=%2Fstats',
//         permanent: false,
//       },
//     };
//   }

//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: createInnerTRPCContext({ session }),
//     transformer: superjson,
//   });

//   await helpers.timedSessions.getInfiniteTimedSessions.prefetchInfinite({
//     limit: 10,
//   });

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//     },
//   };
// }

export default Stats;
