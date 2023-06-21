import useTimer from '@/hooks/useTimer';
import { formatTime } from '@/utils/formatTime';

import PauseButton from './Buttons/Pause';
import PlayButton from './Buttons/Play';
import ResetButton from './Buttons/Reset';
import SaveButton from './Buttons/Save';

interface ITimerProps {
  isSaving: boolean;
  onSave: (startedAt: string, duration: number) => void;
}

const Timer = ({ isSaving, onSave }: ITimerProps) => {
  const { duration, startedAt, isRunning, start, pause, reset } = useTimer();

  const handleSave = () => {
    onSave(startedAt, duration);
    reset();
  };

  return (
    <article className="p-4">
      <p className="min-width-[283px] text-center">
        {Object.entries(formatTime(duration)).map(([key, interval]) => (
          <span className="time-interval text-6xl last:text-gray-400" key={key}>
            {interval.padStart(2, '0')}
          </span>
        ))}
      </p>
      <ul className="mt-24 flex">
        <li className="flex items-center">
          {isRunning ? (
            <PauseButton disabled={isSaving} onClick={pause} />
          ) : (
            <PlayButton disabled={isSaving} onClick={start} />
          )}
        </li>
        <li className="ml-4 flex items-center">
          <ResetButton disabled={duration === 0 || isSaving} onClick={reset} />
        </li>
        <li className="ml-4 flex items-center">
          <SaveButton
            disabled={duration === 0 || isSaving}
            loading={isSaving}
            onClick={handleSave}
          />
        </li>
      </ul>
    </article>
  );
};

export default Timer;
