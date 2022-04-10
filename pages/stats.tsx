import { useEffect } from 'react';
import { getSession, useSession } from 'next-auth/client';

import useStore from '../hooks/useStore';

import Loader from '../components/Loader';
import RecordList from '../components/RecordList';

const Stats: React.FC = () => {
  const [session, loading] = useSession();
  const getSessions = useStore((state) => state.getSessions);

  useEffect(() => {
    getSessions(session.user.id);
  }, [session.user.id, getSessions]);

  const isLoading = typeof window !== 'undefined' && loading;

  return (
    <section className="h-full">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Loader className="h-10 w-10" />
        </div>
      ) : (
        <RecordList />
      )}
    </section>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // redirects to the signin page if no session exists
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
      },
    };
  }

  return {
    props: { session },
  };
}

export default Stats;
