import { format, parseISO } from 'date-fns';

import { formatTime } from '../utilities';

import Accordion from './Accordion';
import Timestamp from './Timestamp';

const Record = ({ date, eventKey, sessions, totalTime }) => {
  const { hh, mm, ss } = formatTime(totalTime);

  return (
    <article>
      <h2 className="text-xl">{format(parseISO(date), 'EEEE, MMMM do, yyyy')}</h2>
      <Accordion.Toggle element="div" className="mt-3 shadow bg-white rounded" eventKey={eventKey}>
        <span className="block text-xs">Total Time</span>
        <span className="block text-lg">
          <Timestamp hours={hh} minutes={mm} seconds={ss} />
        </span>
        <Accordion.Panel eventKey={eventKey}>
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
        </Accordion.Panel>
      </Accordion.Toggle>
    </article>
  );
};

export default Record;
