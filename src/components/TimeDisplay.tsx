import { formatTime } from '@/utils/formatTime';
import SlotCounter from 'react-slot-counter';

interface TimeDisplayProps {
  duration: number;
  className?: string;
}

const TimeDisplay = ({ duration, className = "text-5xl sm:text-6xl" }: TimeDisplayProps) => {
  const { hh, mm, ss } = formatTime(duration);
  const showHours = parseInt(hh) > 0;
  const showMinutes = showHours || parseInt(mm) > 0;

  return (
    <>
      {showHours && (
        <span className={`time-interval ${className} last:text-gray-400`}>
          <SlotCounter
            value={hh.padStart(2, '0')}
            sequentialAnimationMode
            autoAnimationStart={false}
          />
        </span>
      )}
      {showMinutes && (
        <span className={`time-interval ${className} last:text-gray-400`}>
          <SlotCounter
            value={mm.padStart(2, '0')}
            sequentialAnimationMode
            autoAnimationStart={false}
          />
        </span>
      )}
      <span className={`time-interval ${className} last:text-gray-400`}>
        <SlotCounter
          value={ss.padStart(2, '0')}
          sequentialAnimationMode
          autoAnimationStart={false}
        />
      </span>
    </>
  );
};

export default TimeDisplay;
