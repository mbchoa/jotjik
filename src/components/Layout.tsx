import Head from 'next/head';

import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';
import StickyTimer from './StickyTimer';
import { useRouter } from 'next/router';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Head>
      <title>jotjik | Track your sessions</title>
      <meta name="description" content="Time tracking PWA" />
      <meta name="theme-color" content="#831843" />
      <link rel="apple-touch-icon" href="/alarm-clock.png"></link>
      <link rel="manifest" href="/manifest.json" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://jotjik.vercel.app" />
      <meta name="twitter:title" content="jotjik | Track your sessions" />
      <meta name="twitter:description" content="Time tracking PWA" />
      <meta name="twitter:image" content="https://jotjik.vercel.app/alarm-clock.png" />
      <meta name="twitter:creator" content="@mibrychoa" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="jotjik | Track your sessions" />
      <meta property="og:description" content="Time tracking PWA" />
      <meta property="og:site_name" content="jotjik" />
      <meta property="og:url" content="https://https://jotjik.vercel.app" />
      <meta property="og:image" content="https://jotjik.vercel.app/alarm-clock.png" />
    </Head>
    <AppHeader />
    {useRouter().pathname !== '/' && <StickyTimer />}
    <main className="flex max-w-screen-lg mx-auto w-full select-none flex-col p-4 flex-1">{children}</main>
    <AppFooter />
  </div>
);

export default Layout;
