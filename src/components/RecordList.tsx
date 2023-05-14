import Accordion from "@/components/Accordion";
import Record from "@/components/Record";
import { type TimedSessions } from "@prisma/client";
import { formatISO } from "date-fns";
import { useMemo, useState } from "react";

interface IRecordListProps {
  sessions: TimedSessions[];
}

interface ISessionsByDay {
  [key: string]: {
    totalTime: number;
    sessions: TimedSessions[];
  };
}

const RecordList = ({ sessions }: IRecordListProps): JSX.Element => {
  const sessionsByDay: ISessionsByDay = useMemo(() => {
    return sessions.reduce<ISessionsByDay>((output, currSession) => {
      const key = formatISO(new Date(currSession.startedAt), {
        representation: "date",
      });
      const sessionByDay = output[key] ?? { totalTime: 0, sessions: [] };
      const sortedSessions: TimedSessions[] = [
        ...sessionByDay.sessions,
        currSession,
      ].sort(
        (a: TimedSessions, b: TimedSessions) =>
          new Date(a.startedAt).valueOf() - new Date(b.startedAt).valueOf()
      );

      return {
        ...output,
        [key]: {
          ...sessionByDay,
          totalTime: sessionByDay.totalTime + currSession.duration,
          sessions: sortedSessions,
        },
      };
    }, {});
  }, [sessions]);

  const [activeEventKey, setActiveEventKey] = useState(-1);

  if (sessions.length === 0) {
    return (
      <p className="flex h-full items-center justify-center text-2xl">
        No sessions recorded.
      </p>
    );
  }

  return (
    <Accordion activeEventKey={activeEventKey} onToggle={setActiveEventKey}>
      {Object.entries(sessionsByDay).map(
        ([date, { totalTime, sessions }], index) => (
          <Record
            key={date}
            {...{ date, totalTime, sessions }}
            eventKey={index}
          />
        )
      )}
    </Accordion>
  );
};

export default RecordList;
