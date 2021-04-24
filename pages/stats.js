import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';

import useStore from '../hooks/useStore';

import RecordList from '../components/RecordList';

export default function Stats() {
  const [session, loading] = useSession();
  const getSessions = useStore((state) => state.getSessions);

  useEffect(() => {
    // getSessions();
  }, [getSessions]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) {
    return null;
  }

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }

  return (
    <section>
      <RecordList />
      <button onClick={() => signOut()}>Sign out</button>
    </section>
  );
}
