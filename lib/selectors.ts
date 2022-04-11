import { formatISO } from 'date-fns';

import type { Session, SessionsByDay } from '../types';

export const sessions = (state): Session[] => state.allSessions;

export const sessionsByDay = (state): SessionsByDay => {
  return sessions(state).reduce((output, currSession) => {
    const key = formatISO(new Date(currSession.startedAt), { representation: 'date' });
    const sessionByDay = output[key] ?? { totalTime: 0, sessions: [] };
    const sortedSessions: Session[] = [...sessionByDay.sessions, currSession].sort(
      (a: Session, b: Session) => new Date(a.startedAt).valueOf() - new Date(b.startedAt).valueOf()
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
};
