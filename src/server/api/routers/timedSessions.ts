import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { Prisma, type TimedSessions } from '@prisma/client';
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
        with local_timezone as (
          select ("startedAt" at time zone 'utc' at time zone ${timezone})::date as activity_date
          from "TimedSessions"
          where "userId" = ${ctx.session.user.id}
          ${cursor ? Prisma.sql`and "startedAt" < ${cursor}::timestamp` : Prisma.empty}
          order by "startedAt" desc
        ),
        deduped_dates AS (
            SELECT DISTINCT activity_date
            FROM local_timezone
            order by activity_date desc
        ),
        top_7_days AS (
          SELECT activity_date
          FROM deduped_dates
          LIMIT 7
        )
        select ts.*
        FROM "TimedSessions" ts
        JOIN top_7_days t7d
          ON (ts."startedAt" AT TIME ZONE 'utc' AT TIME ZONE ${timezone})::date = t7d.activity_date
        WHERE ts."userId" = ${ctx.session.user.id}
        ORDER BY ts."startedAt" DESC;
      `;

      const timedSessions = await ctx.prisma.$queryRaw<TimedSessions[]>(sqlQuery);

      let nextCursor: string | undefined = undefined;
      if (timedSessions.length > 0) {
        const oldestSession = timedSessions[timedSessions.length - 1];
        if (oldestSession) {
          nextCursor = oldestSession.startedAt.toISOString();
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
