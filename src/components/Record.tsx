import { formatTime } from "@/utils/formatTime";
import { type TimedSessions } from "@prisma/client";
import { format, parseISO } from "date-fns";

import Chevron, { Direction } from "@/components/Chevron";
import Timestamp from "@/components/Timestamp";
import { Panel, Toggle, useContext } from "./Accordion";

interface IRecordProps {
  date: string;
  eventKey: number;
  sessions: TimedSessions[];
  totalTime: number;
}

const Record = ({ date, eventKey, sessions, totalTime }: IRecordProps) => {
  const { activeEventKey } = useContext();
  const {
    hh: totalHours,
    mm: totalMinutes,
    ss: totalSeconds,
  } = formatTime(totalTime);

  return (
    <article>
      <h2 className="text-xl">
        {format(parseISO(date), "EEEE, MMMM do yyyy")}
      </h2>
      <Toggle
        id={date}
        element="div"
        eventKey={eventKey}
        aria-controls={`${date}-panel`}
      >
        <span className="group flex justify-between">
          <span>
            <span className="block text-xs">Total Time</span>
            <span className="block text-lg">
              <Timestamp
                hours={totalHours}
                minutes={totalMinutes}
                seconds={totalSeconds}
              />
            </span>
          </span>
          <Chevron
            direction={
              eventKey === activeEventKey ? Direction.Up : Direction.Down
            }
          />
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
                  <span className="text-sm">
                    {format(startedAtDate, "h:mm a")}
                  </span>
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