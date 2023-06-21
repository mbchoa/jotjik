import Layout from '@/components/Layout';
import '@/styles/globals.css';
import { trpc } from '@/utils/api';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar closeOnClick />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
