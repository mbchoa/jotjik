import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { addDays, isEqual, isSameDay, startOfDay } from 'date-fns';
import { z } from 'zod';

function isConsecutive(dateLeft: Date, dateRight: Date) {
  const startDateLeft = startOfDay(dateLeft);
  const startDateRight = startOfDay(dateRight);

  const dayAfterLeft = addDays(startDateLeft, 1);

  return isEqual(dayAfterLeft, startDateRight);
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
        take: 7,
        where: {
          userId: ctx.session.user.id,
          startedAt: {
            lte: date,
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

      let count = 0;
      let sessionsToCheck = sessions;

      let currentDate = new Date('2023-12-26T22:51:25.794Z');
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
