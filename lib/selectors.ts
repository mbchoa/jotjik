import { formatISO } from 'date-fns';

import type { Session } from '../types';

export const sessions = (state): Session[] => state.allSessions;

export const sessionsByDay = (state) => {
  return sessions(state).reduce((output, currSession) => {
    const key = formatISO(new Date(currSession.startedAt), { representation: 'date' });
    const sessionByDay = output[key] ?? { totalTime: 0, sessions: [] };
    return {
      ...output,
      [key]: {
        ...sessionByDay,
        totalTime: sessionByDay.totalTime + currSession.duration,
        sessions: [...sessionByDay.sessions, currSession],
      },
    };
  }, {})
};
