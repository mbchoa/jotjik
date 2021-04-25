import { useEffect } from 'react';
import { getSession, signOut, useSession } from 'next-auth/client';

import useStore from '../hooks/useStore';

import RecordList from '../components/RecordList';

export default function Stats() {
  const [session, loading] = useSession();
  const getSessions = useStore((state) => state.getSessions);

  useEffect(() => {
    getSessions(session.user.id);
  }, [session.user.id, getSessions]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) {
    return null;
  }

  return (
    <section>
      <RecordList />
      <button onClick={() => signOut()}>Sign out</button>
    </section>
  );
}

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
