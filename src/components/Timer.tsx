import { TimerContext } from '@/contexts/TimerContext';
import { useContext } from 'react';
import TimeDisplay from './TimeDisplay';
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
    <div className="p-4 flex flex-col flex-1">
      <p className="min-width-[283px] text-center my-auto">
        <TimeDisplay duration={duration} />
      </p>
      <ul className="flex gap-x-4 mt-auto">
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
    </div>
  );
};

export default Timer;
