import { formatTime } from '@/utils/formatTime';
import { type TimedSessions } from '@prisma/client';
import { format, parseISO } from 'date-fns';

import { useAccordionContext } from '@/components/Accordion/AccordonProvider';
import Panel from '@/components/Accordion/Panel';
import Toggle from '@/components/Accordion/Toggle';
import Chevron, { Direction } from '@/components/Chevron';
import Timestamp from '@/components/Timestamp';

interface IRecordProps {
  date: string;
  eventKey: number;
  sessions: TimedSessions[];
  totalTime: number;
}

const Record = ({ date, eventKey, sessions, totalTime }: IRecordProps) => {
  const { activeEventKey } = useAccordionContext();
  const { hh: totalHours, mm: totalMinutes, ss: totalSeconds } = formatTime(totalTime);

  return (
    <article id={`record-${eventKey}`}>
      <Toggle id={date} eventKey={eventKey} aria-controls={`${date}-panel`}>
        <h3 className="text-xl mb-2">{format(parseISO(date), 'EEEE, MMMM do yyyy')}</h3>
        <span className="group flex justify-between">
          <span>
            <span className="block text-xs">Total Time</span>
            <span className="block text-lg min-w-[74px]">
              <Timestamp hours={totalHours} minutes={totalMinutes} seconds={totalSeconds} />
            </span>
          </span>
          <span>
            <span className="block text-xs">Sessions</span>
            <span className="block text-lg text-center">{sessions.length}</span>
          </span>
          <Chevron direction={eventKey === activeEventKey ? Direction.Up : Direction.Down} />
        </span>
        <Panel eventKey={eventKey} aria-labelledby={date} id={`${date}-panel`}>
          {sessions.map(({ startedAt, duration }) => {
            const startedAtDate = new Date(startedAt);
            const {
              hh: durationHours,
              mm: durationMinutes,
              ss: durationSeconds,
            } = formatTime(duration);
            return (
              <span key={startedAtDate.toISOString()}>
                <hr className="my-4" />
                <span className="flex items-center">
                  <span className="text-sm">{format(startedAtDate, 'h:mm a')}</span>
                  <span className="ml-auto text-lg">
                    <Timestamp
                      hours={durationHours}
                      minutes={durationMinutes}
                      seconds={durationSeconds}
                    />
                  </span>
                </span>
              </span>
            );
          })}
        </Panel>
      </Toggle>
    </article>
  );
};

export default Record;
