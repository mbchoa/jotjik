import { format, parseISO } from 'date-fns';

import { formatTime } from '../utilities';

const Record = ({ duration, startedAt }) => {
  const { hh, mm, ss } = formatTime(duration);

  return (
    <article>
      <h2 className="text-xl">{format(parseISO(startedAt), 'EEEE, MMMM do, yyyy')}</h2>
      <div className="mt-3 p-4 shadow bg-white rounded">
        <p className="text-xs">Total Time</p>
        <p className="text-lg">
          {hh}
          <span className="text-sm">h</span> {mm}
          <span className="text-sm">m</span> {ss}
          <span className="text-sm">s</span>
        </p>
      </div>
    </article>
  );
};

export default Record;
