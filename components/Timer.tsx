import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import useStore from '../hooks/useStore';
import useTimer from '../hooks/useTimer';
import { formatTime } from '../utilities';

import PlayButton from './Buttons/Play';
import PauseButton from './Buttons/Pause';
import ResetButton from './Buttons/Reset';
import SaveButton from './Buttons/Save';

import styles from '../styles/Timer.module.css';

const Timer: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();
  const { elapsedTime, isRunning, handleStart, handlePause, handleReset } = useTimer();
  const [startTime, setStartTime] = useState('');
  const postNewSession = useStore((state) => state.postNewSession);

  const handleInitialStart = () => {
    if (elapsedTime === 0) {
      setStartTime(new Date().toISOString());
    }
    handleStart();
  };

  const handleSave = () => {
    const payload = { startedAt: startTime, duration: elapsedTime };

    if (!session) {
      const queuedSessions = JSON.parse(
        localStorage.getItem('queuedSessions') ?? JSON.stringify([])
      );
      localStorage.setItem('queuedSessions', JSON.stringify([...queuedSessions, payload]));
      router.push('/auth/signin');
    } else {
      postNewSession(session.user.id, { startedAt: startTime, duration: elapsedTime });
      router.push('/stats');
    }
    handleReset();
  };

  return (
    <article className="p-4">
      <p className="text-center">
        {Object.entries(formatTime(elapsedTime)).map(([key, interval]) => (
          <span className={`${styles['time-interval']} text-6xl last:text-gray-400`} key={key}>
            {interval.padStart(2, '0')}
          </span>
        ))}
      </p>
      <ul className="flex mt-24">
        <li className="flex items-center">
          {isRunning ? (
            <PauseButton onClick={handlePause} />
          ) : (
            <PlayButton onClick={handleInitialStart} />
          )}
        </li>
        <li className="flex items-center ml-4">
          <ResetButton disabled={elapsedTime === 0} onClick={handleReset} />
        </li>
        <li className="flex items-center ml-4">
          <SaveButton disabled={elapsedTime === 0} onClick={handleSave} />
        </li>
      </ul>
    </article>
  );
};

export default Timer;
