import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { isSameDay } from 'date-fns';
import { z } from 'zod';

export const streaksRouter = createTRPCRouter({
  getStreakFromDate: protectedProcedure
    .input(
      z.object({
        date: z.string().datetime(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { date } = input;
      // Parse the starting date
      let previousDate = new Date(date).getTime();

      // Fetch all records sorted by startedAt in descending order
      const sessions = await ctx.prisma.timedSessions.findMany({
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

      if (sessions.length === 0) {
        return {
          streakCount: 0,
          includeDate: false,
        };
      }

      let count = 0;

      for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i];
        if (!session) {
          break;
        }

        const currentDate = new Date(session.startedAt).getTime();
        const diffTime = Math.abs(previousDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          count++;
          previousDate = currentDate;
        } else if (diffDays > 1) {
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
