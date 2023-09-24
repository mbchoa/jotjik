import { useEffect, useRef, useState } from 'react';

const StickyTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const stopwatchWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    stopwatchWorkerRef.current = new Worker('/stopwatch.js');

    stopwatchWorkerRef.current.addEventListener(
      'message',
      function (event: MessageEvent<{ type: 'TICK'; elapsedTime: number }>) {
        const { type, elapsedTime } = event.data;

        switch (type) {
          case 'TICK':
            setElapsedTime(elapsedTime);
            break;
        }
      }
    );

    return () => {
      stopwatchWorkerRef?.current?.terminate();
    };
  }, []);

  const handleStart = () => {
    if (stopwatchWorkerRef.current) {
      stopwatchWorkerRef.current.postMessage({ type: 'START' });
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (stopwatchWorkerRef.current) {
      stopwatchWorkerRef.current.postMessage({ type: 'PAUSE' });
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (stopwatchWorkerRef.current) {
      stopwatchWorkerRef.current.postMessage({ type: 'RESET' });
      setIsRunning(false);
    }
  };

  return (
    <div className="sticky bottom-0 self-end">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-md">
        <div className="text-2xl font-bold">Elapsed Time: {elapsedTime}</div>
        <div className="space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={isRunning ? handlePause : handleStart}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyTimer;
