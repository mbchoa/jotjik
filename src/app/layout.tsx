import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';
import { AppProvider } from '@/components/AppProvider';
import '@/styles/globals.css';
import { TRPCReactProvider } from '@/trpc/react';
import { cookies } from 'next/headers';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>
        <TRPCReactProvider cookies={cookies().toString()}>
          <AppProvider>
            <div className="grid-rows-hamburger grid h-screen">
              <AppHeader />
              <main className="flex max-w-screen-sm sm:max-w-none select-none flex-col p-4">
                {children}
              </main>
              <AppFooter />
              <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                closeOnClick
              />
            </div>
          </AppProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
