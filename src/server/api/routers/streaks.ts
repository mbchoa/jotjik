import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import type { TimedSessions } from '@prisma/client';
import { isSameDay, startOfDay, subDays } from 'date-fns';
import { uniqBy } from 'lodash';
import { z } from 'zod';

function isConsecutive(dateLeft: Date, dateRight: Date) {
  // Convert the date strings to Date objects
  const date1 = new Date(dateLeft);
  const date2 = new Date(dateRight);

  // Normalize the dates to the start of the day (midnight)
  date1.setUTCHours(0, 0, 0, 0);
  date2.setUTCHours(0, 0, 0, 0);

  // Calculate the difference in days
  const diffInTime = date2.valueOf() - date1.valueOf();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  // Check if the difference is exactly 1 day
  return diffInDays === 1;
}

export const streaksRouter = createTRPCRouter({
  getStreakFromDate: protectedProcedure
    .input(
      z.object({
        date: z.string().datetime(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { date } = input;

      // Fetch all records sorted by startedAt in descending order
      const sessions = await ctx.prisma.timedSessions.findMany({
        where: {
          userId: ctx.session.user.id,
          startedAt: {
            lte: date,
            gt: subDays(new Date(date), 7),
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
      });

      if (sessions.length === 0 || !sessions[0]) {
        return {
          streakCount: 0,
          includeDate: false,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const dedupedSessions = uniqBy<TimedSessions>(sessions, (session: TimedSessions): number => {
        return startOfDay(new Date(session.startedAt)).getTime();
      }) as TimedSessions[];

      let count = 0;
      let sessionsToCheck = dedupedSessions;

      let currentDate = new Date(date);
      const previousDate = new Date(sessions[0].startedAt);

      if (isSameDay(previousDate, currentDate)) {
        count++;
        currentDate = previousDate;
        sessionsToCheck = sessions.slice(1);
      }

      for (let i = 0; i < sessionsToCheck.length; i++) {
        const session = sessionsToCheck[i];
        if (!session) {
          break;
        }

        const previousDate = new Date(session.startedAt);

        if (isConsecutive(previousDate, currentDate)) {
          count++;
          currentDate = previousDate;
        } else {
          break;
        }
      }

      return {
        streakCount: count,
        includeDate: sessions[0]
          ? isSameDay(new Date(date), new Date(sessions[0].startedAt))
          : false,
      };
    }),
});
