import { TimerContext } from '@/contexts/TimerContext';
import { useContext } from 'react';
import TimeDisplay from './TimeDisplay';
import Link from 'next/link';

const StickyTimer = () => {
  const { duration, isRunning } = useContext(TimerContext);

  if (!isRunning && duration === 0) return null;

  return (
    <Link className="sticky top-12 z-40 bg-white shadow-sm" href="/">
      <div className="px-4 py-2 flex items-center justify-center">
        <TimeDisplay duration={duration} className="text-xl" />
      </div>
    </Link>
  );
};

export default StickyTimer;
