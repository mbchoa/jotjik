import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/client';

import useStore from '../hooks/useStore';

import GoogleSignInButton from '../components/Buttons/GoogleSignInButton';
import RecordList from '../components/RecordList';

export default function Stats() {
  const [session, loading] = useSession();
  const getSessions = useStore((state) => state.getSessions);

  useEffect(() => {
    if (session) {
      getSessions(session.user.id);
    }
  }, [session, getSessions]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) {
    return null;
  }

  if (!session) {
    return (
      <section className="flex flex-col justify-center h-full">
        <h1 className="mb-6 text-3xl font-bold">Log in to your account</h1>
        <GoogleSignInButton redirectUrl={`${process.env.NEXT_PUBLIC_HOST_URL}/stats`} />
      </section>
    );
  }

  return (
    <section>
      <RecordList />
      <button onClick={() => signOut()}>Sign out</button>
    </section>
  );
}
