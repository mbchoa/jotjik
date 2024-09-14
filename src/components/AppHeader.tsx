import { TimerContext } from '@/contexts/TimerContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useContext } from 'react';

const AppHeader = () => {
  const { data: session } = useSession();
  const { isRunning, startedAt, duration } = useContext(TimerContext);

  const handleStatsLinkClick = useCallback(() => {
    if (!session && isRunning) {
      localStorage.setItem('preAuthTimerProgress', JSON.stringify({ startedAt, duration }));
    }
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
          <ul>
            <li>
              <Link href="/stats" className="text-xl" onClick={handleStatsLinkClick}>
                <span role="img" aria-label="Chart with upwards trend emoji">
                  📈
                </span>
              </Link>
            </li>
            <li></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
