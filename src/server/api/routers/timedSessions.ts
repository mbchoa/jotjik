import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { Prisma, type TimedSessions } from '@prisma/client';
import { startOfDay, subDays } from 'date-fns';
import { z } from 'zod';
export const timedSessionsRouter = createTRPCRouter({
  getInfiniteTimedSessions: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(), // cursor will now represent a date in ISO string format
        timezone: z.string(), // User's timezone name (e.g., 'America/Los_Angeles')
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, timezone } = input;

      const sqlQuery = Prisma.sql`
        WITH distinct_days AS (
          SELECT DISTINCT
            date_trunc('day', "startedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::DATE AS local_date
          FROM "TimedSessions"
          WHERE "userId" = ${ctx.session.user.id}
          ${cursor ? Prisma.sql`AND "startedAt" < ${new Date(cursor)}` : Prisma.sql``}
        ),
        ranked_days AS (
          SELECT 
            local_date,
            ROW_NUMBER() OVER (ORDER BY local_date DESC) AS row_num
          FROM distinct_days
        ),
        date_range AS (
          SELECT
            MIN(local_date) as min_date,
            MAX(local_date) as max_date
          FROM ranked_days
          WHERE row_num <= 7
        )
        SELECT
          ts.*
        FROM
          "TimedSessions" ts
        JOIN
          date_range dr ON date_trunc('day', ts."startedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::DATE >= dr.min_date
                        AND date_trunc('day', ts."startedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::DATE <= dr.max_date
        WHERE
          ts."userId" = ${ctx.session.user.id}
        ORDER BY
          ts."startedAt" DESC;
      `;

      const timedSessions = await ctx.prisma.$queryRaw<TimedSessions[]>(sqlQuery);

      let nextCursor: string | undefined = undefined;
      if (timedSessions.length > 0) {
        const oldestSession = timedSessions[timedSessions.length - 1];
        if (oldestSession) {
          const oldestSessionStartTime = oldestSession.startedAt;
          nextCursor = startOfDay(subDays(oldestSessionStartTime, 1)).toISOString();
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
