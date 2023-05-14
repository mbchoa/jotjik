import { format, parseISO } from 'date-fns';

import type { Session } from '../types';
import { formatTime } from '../utilities';

import { Panel, Toggle, useContext } from './Accordion';
import Chevron, { Direction } from './Chevron';
import Timestamp from './Timestamp';

interface Props {
  date: string;
  eventKey: number;
  sessions: Session[];
  totalTime: number;
}

const Record: React.FC<Props> = ({ date, eventKey, sessions, totalTime }) => {
  const { activeEventKey } = useContext();
  const { hh: totalHours, mm: totalMinutes, ss: totalSeconds } = formatTime(totalTime);

  return (
    <article>
      <h2 className="text-xl">{format(parseISO(date), 'EEEE, MMMM do yyyy')}</h2>
      <Toggle id={date} element="div" eventKey={eventKey} aria-controls={`${date}-panel`}>
        <span className="flex justify-between group">
          <span>
            <span className="block text-xs">Total Time</span>
            <span className="block text-lg">
              <Timestamp hours={totalHours} minutes={totalMinutes} seconds={totalSeconds} />
            </span>
          </span>
          <Chevron direction={eventKey === activeEventKey ? Direction.Up : Direction.Down} />
        </span>
        <Panel eventKey={eventKey} aria-labelledby={date} id={`${date}-panel`}>
          {sessions.map(({ startedAt, duration }) => {
            const {
              hh: durationHours,
              mm: durationMinutes,
              ss: durationSeconds,
            } = formatTime(duration);
            return (
              <span key={startedAt}>
                <hr className="my-4" />
                <span className="flex items-center">
                  <span className="text-sm">{format(parseISO(startedAt), 'h:mm a')}</span>
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
