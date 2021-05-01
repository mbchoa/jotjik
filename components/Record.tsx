import { format, parseISO } from 'date-fns';

import { formatTime } from '../utilities';
import type { Session } from '../types';

import { Toggle, Panel } from './Accordion';
import Timestamp from './Timestamp';

interface Props {
  date: string;
  eventKey: number;
  sessions: Session[];
  totalTime: number;
};

const Record: React.FC<Props> = ({ date, eventKey, sessions, totalTime }) => {
  const { hh, mm, ss } = formatTime(totalTime);

  return (
    <article>
      <h2 className="text-xl">{format(parseISO(date), 'EEEE, MMMM do, yyyy')}</h2>
      <Toggle id={date} element="div" eventKey={eventKey} aria-controls={`${date}-panel`}>
        <span className="block text-xs">Total Time</span>
        <span className="block text-lg">
          <Timestamp hours={hh} minutes={mm} seconds={ss} />
        </span>
        <Panel eventKey={eventKey} aria-labelledby={date} id={`${date}-panel`}>
          {sessions.map(({ startedAt, duration }) => {
            const { hh, mm, ss } = formatTime(duration);
            return (
              <span key={startedAt}>
                <hr className="my-4" />
                <span className="flex items-center">
                  <span className="text-sm">{format(parseISO(startedAt), 'h:mm a')}</span>
                  <span className="ml-auto text-lg">
                    <Timestamp hours={hh} minutes={mm} seconds={ss} />
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
