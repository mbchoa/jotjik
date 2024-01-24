import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { startOfDay, subDays } from 'date-fns';
import { z } from 'zod';

export const timedSessionsRouter = createTRPCRouter({
  getInfiniteTimedSessions: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(), // cursor will now represent a date in ISO string format
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor } = input;

      console.log(cursor);
      // Calculate the start date for the query
      const startDate = cursor ? new Date(cursor) : new Date();
      const endDate = startOfDay(subDays(startDate, 7));

      const timedSessions = await ctx.prisma.timedSessions.findMany({
        where: {
          userId: ctx.session.user.id,
          startedAt: {
            gte: endDate,
            lt: startDate,
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
      });

      let nextCursor: string | undefined = undefined;
      if (timedSessions.length > 0) {
        const earliestSession = timedSessions[timedSessions.length - 1];
        if (earliestSession) {
          const earliestSessionDate = earliestSession.startedAt;
          nextCursor = startOfDay(subDays(earliestSessionDate, 1)).toISOString();
        }
      }

      return {
        timedSessions,
        nextCursor,
      };
    }),
  getAllTimedSessions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.timedSessions.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }),
  saveTimedSession: protectedProcedure
    .input(
      z.object({
        startedAt: z.string(),
        duration: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.timedSessions.create({
        data: {
          startedAt: input.startedAt,
          duration: input.duration,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
