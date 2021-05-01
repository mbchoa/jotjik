import { useState } from 'react';

import useStore from '../hooks/useStore';
import { sessionsByDay as selectSessionsByDay } from '../lib/selectors';
import type { SessionsByDay } from '../types';

import Accordion from './Accordion';
import Record from './Record';

const RecordList: React.FC = () => {
  const sessionsByDay: SessionsByDay = useStore(selectSessionsByDay);

  const [activeEventKey, setActiveEventKey] = useState(-1);

  return (
    (Object.keys(sessionsByDay).length ?? 0) > 0 && (
      <Accordion activeEventKey={activeEventKey} onToggle={setActiveEventKey}>
        {Object.entries(sessionsByDay).map(([date, { totalTime, sessions }], index) => (
          <Record key={date} {...{ date, totalTime, sessions }} eventKey={index} />
        ))}
      </Accordion>
    )
  );
};

export default RecordList;
