import Record from './Record';

import useStore from '../hooks/useStore';

const RecordList = () => {
  const allSessions = useStore((state) => state.allSessions);

  return (
    (allSessions?.length ?? 0) > 0 && (
      <ul className="space-y-6">
        {allSessions.map(({ _id, duration, startedAt }) => (
          <li key={_id}>
            <Record {...{ duration, startedAt }} />
          </li>
        ))}
      </ul>
    )
  );
};

export default RecordList;
