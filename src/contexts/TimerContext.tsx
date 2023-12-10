import React, { createContext, useState } from 'react';

export interface ITimerContext {
  isRunning: boolean;
  duration: number;
  startedAt: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  resumeFromLocalStorage: () => void;
}

export const TimerContext = createContext<ITimerContext>({
  isRunning: false,
  startedAt: '',
  duration: 0,
  start: () => {
    throw new Error('TimerContext not implemented');
  },
  pause: () => {
    throw new Error('TimerContext not implemented');
  },
  reset: () => {
    throw new Error('TimerContext not implemented');
  },
  resumeFromLocalStorage: () => {
    throw new Error('TimerContext not implemented');
  },
});

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [startedAt, setStartedAt] = useState('');
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const countRef = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    if (duration === 0) {
      const now = Date.now();
      setStartedAt(new Date(now).toISOString());
      countRef.current = setInterval(() => {
        setDuration(Date.now() - now);
      }, 10);
    } else {
      const now = Date.now();
      const startTime = now - duration;
      countRef.current = setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 10);
    }
    setIsRunning(true);
  }, [duration]);

  const pause = useCallback(() => {
    clearInterval(countRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(countRef.current);
    setIsRunning(false);
    setDuration(0);
  }, []);

  const resumeFromLocalStorage = useCallback(() => {
    const preAuthTimerProgress = localStorage.getItem('preAuthTimerProgress');
    if (preAuthTimerProgress) {
      const { startedAt, duration } = JSON.parse(preAuthTimerProgress) as {
        startedAt: string;
        duration: number;
      };
      setStartedAt(startedAt);
      setDuration(duration);
      setIsRunning(true);

      const now = Date.now();
      const startTime = now - duration;
      countRef.current = setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 10);

      localStorage.removeItem('preAuthTimerProgress');
    }
  }, []);

  return (
    <TimerContext.Provider
      value={{ duration, isRunning, start, pause, reset, startedAt, resumeFromLocalStorage }}
    >
      {children}
    </TimerContext.Provider>
  );
};

import { useCallback, useRef } from 'react';
