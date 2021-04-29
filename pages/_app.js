import { StoreProvider } from '../lib/zustandProvider';
import { useHydrate } from '../hooks/useHydrate';
import { Provider } from 'next-auth/client';

import Layout from '../components/Layout';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const useStore = useHydrate(pageProps.initialZustandState);
  const postNewSession = useStore((state) => state.postNewSession);

  // check local storage for sessions queue before authenticating if already authenticated
  if (typeof window !== 'undefined' && pageProps.session) {
    const queuedSessions = JSON.parse(localStorage.getItem('queuedSessions') ?? JSON.stringify([]));
    queuedSessions.forEach((session) => {
      postNewSession(pageProps.session.user.id, session);
    });
    localStorage.removeItem('queuedSessions');
  }

  return (
    <Provider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      options={{
        // Client Max Age controls how often the useSession in the client should
        // contact the server to sync the session state. Value in seconds.
        // e.g.
        // * 0  - Disabled (always use cache value)
        // * 60 - Sync session state with server if it's older than 60 seconds
        clientMaxAge: 0,
        // Keep Alive tells windows / tabs that are signed in to keep sending
        // a keep alive request (which extends the current session expiry) to
        // prevent sessions in open windows from expiring. Value in seconds.
        //
        // Note: If a session has expired when keep alive is triggered, all open
        // windows / tabs will be updated to reflect the user is signed out.
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <StoreProvider store={useStore}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    </Provider>
  );
}
