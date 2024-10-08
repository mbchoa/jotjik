import { TimerContext } from '@/contexts/TimerContext';
import { formatTime } from '@/utils/formatTime';
import { useContext } from 'react';
import SlotCounter from 'react-slot-counter';
import PauseButton from './Buttons/Pause';
import PlayButton from './Buttons/Play';
import ResetButton from './Buttons/Reset';
import SaveButton from './Buttons/Save';

interface ITimerProps {
  isSaving: boolean;
  onSave: (startedAt: string, duration: number) => void;
}

const Timer = ({ isSaving, onSave }: ITimerProps) => {
  const { duration, startedAt, isRunning, start, pause, reset } = useContext(TimerContext);

  const handleSave = () => {
    onSave(startedAt, duration);
    reset();
  };

  return (
    <article className="p-4">
      <p className="min-width-[283px] text-center">
        {Object.entries(formatTime(duration)).map(([key, interval]) => (
          <span className="time-interval text-5xl sm:text-6xl last:text-gray-400" key={key}>
            <SlotCounter
              value={interval.padStart(2, '0')}
              sequentialAnimationMode
              autoAnimationStart={false}
            />
          </span>
        ))}
      </p>
      <ul className="mt-24 flex gap-x-4 justify-center">
        <li>
          {isRunning ? (
            <PauseButton disabled={isSaving} onClick={pause} />
          ) : (
            <PlayButton disabled={isSaving} onClick={start} />
          )}
        </li>
        <li>
          <ResetButton disabled={duration === 0 || isSaving} onClick={reset} />
        </li>
        <li>
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
