import { TimerContext } from '@/contexts/TimerContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useContext, useState } from 'react';
import { RiMenuLine } from '@remixicon/react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerTrigger } from './Drawer';

const AppHeader = () => {
  const { data: session } = useSession();
  const { isRunning, startedAt, duration } = useContext(TimerContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatsLinkClick = useCallback(() => {
    if (!session && isRunning) {
      localStorage.setItem('preAuthTimerProgress', JSON.stringify({ startedAt, duration }));
    }
    setIsOpen(false);
  }, [session, isRunning, startedAt, duration]);

  return (
    <header className="flex bg-pink-900 text-white">
      <div className="flex flex-1 items-center max-w-screen-lg mx-auto w-full px-4">
        <span className="inline-block text-2xl">
          <Link href="/">
            <span role="img" aria-label="Clock emoji">
              ⏳
            </span>{' '}
            jotjik
          </Link>
        </span>
        <nav className="ml-auto">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <button className="p-2 hover:bg-pink-800 rounded-lg">
                <RiMenuLine className="size-6" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Link
                  href="/stats"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
                  onClick={handleStatsLinkClick}
                >
                  <span role="img" aria-label="Chart with upwards trend emoji">
                    📈
                  </span>
                  Statistics
                </Link>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
