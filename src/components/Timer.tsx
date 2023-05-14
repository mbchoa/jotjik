import useTimer from "@/hooks/useTimer";
import { formatTime } from "@/utils/formatTime";

import PauseButton from "./Buttons/Pause";
import PlayButton from "./Buttons/Play";
import ResetButton from "./Buttons/Reset";
import SaveButton from "./Buttons/Save";

interface ITimerProps {
  onSave: (startedAt: string, duration: number) => void;
}

const Timer = ({ onSave }: ITimerProps) => {
  const { duration, startedAt, isRunning, start, pause, reset } = useTimer();

  const handleSave = () => {
    onSave(startedAt, duration);
  };

  return (
    <article className="p-4">
      <p className="min-width-[283px] text-center">
        {Object.entries(formatTime(duration)).map(([key, interval]) => (
          <span className="time-interval text-6xl last:text-gray-400" key={key}>
            {interval.padStart(2, "0")}
          </span>
        ))}
      </p>
      <ul className="mt-24 flex">
        <li className="flex items-center">
          {isRunning ? (
            <PauseButton onClick={pause} />
          ) : (
            <PlayButton onClick={start} />
          )}
        </li>
        <li className="ml-4 flex items-center">
          <ResetButton disabled={duration === 0} onClick={reset} />
        </li>
        <li className="ml-4 flex items-center">
          <SaveButton disabled={duration === 0} onClick={handleSave} />
        </li>
      </ul>
    </article>
  );
};

export default Timer;
