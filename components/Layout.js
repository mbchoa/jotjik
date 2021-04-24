import Head from 'next/head';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const Layout = ({ children }) => (
  <div className="h-screen grid grid-rows-hamburger">
    <Head>
      <title>jotjik | Track your sessions</title>
    </Head>
    <AppHeader />
    <main className="flex flex-col p-4 max-w-screen-sm sm:px-0 sm:my-0 sm:mx-auto">{children}</main>
    <AppFooter />
  </div>
);

export default Layout;
