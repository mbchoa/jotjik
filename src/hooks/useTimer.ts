import { useCallback, useRef, useState } from "react";

const useTimer = () => {
  const [startedAt, setStartedAt] = useState("");
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const countRef = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    const now = Date.now();
    setStartedAt(new Date(now).toISOString());
    const startTime = now - duration;
    countRef.current = setInterval(() => {
      setDuration(Date.now() - startTime);
    }, 10);
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

  return { duration, isRunning, start, pause, reset, startedAt };
};

export default useTimer;
