import Head from 'next/head';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const Layout = ({ children }) => (
  <div className="h-screen grid grid-rows-hamburger">
    <Head>
      <title>jotjik | Track your sessions</title>
      <meta name="description" content="Time tracking PWA" />
      <link rel="apple-touch-icon" href="/alarm-clock.png"></link>
      <link rel="manifest" href="/manifest.json" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://jotjike.vercel.app" />
      <meta name="twitter:title" content="jotjik | Track your sessions" />
      <meta name="twitter:description" content="Time tracking PWA" />
      <meta name="twitter:image" content="https://jotjik.vercel.app/alarm-clock.png" />
      <meta name="twitter:creator" content="@mibrychoa" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="jotjike | Track your sessions" />
      <meta property="og:description" content="Time tracking PWA" />
      <meta property="og:site_name" content="jotjik" />
      <meta property="og:url" content="https://https://jotjik.vercel.app" />
      <meta property="og:image" content="https://jotjik.vercel.app/alarm-clock.png" />
    </Head>
    <AppHeader />
    <main className="flex flex-col p-4 max-w-screen-sm sm:px-0 sm:my-0 sm:mx-auto">{children}</main>
    <AppFooter />
  </div>
);

export default Layout;
