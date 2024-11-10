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
  getTimedSessionsForMonth: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number(),
        timezone: z.string(),
      })
    )
    .output(
      z.array(
        z.object({
          date: z.date(),
          activityLevel: z.number(),
        })
      )
    )
    .query(async ({ input, ctx }) => {
      const { year, month, timezone } = input;

      const sqlQuery = Prisma.sql`
        with calendar_dates as (
          select generate_series(
            (make_date(${year}::integer, ${month}::integer, 1) - 
             ((extract(dow from make_date(${year}::integer, ${month}::integer, 1))::integer) || ' days')::interval)::date,
            (make_date(${year}::integer, ${month}::integer + 1, 1) + 
             (6 - extract(dow from (make_date(${year}::integer, ${month}::integer + 1, 1) - interval '1 day'))::integer || ' days')::interval)::date,
            interval '1 day'
          )::date as activity_date
        )
        select
          md.activity_date,
          case 
            when extract(month from md.activity_date) = ${month}::integer 
            then coalesce(sum(ts.duration)::bigint, 0)
            else 0
          end as total_duration
        from calendar_dates md
        left join "TimedSessions" ts
          on (ts."startedAt" at time zone 'utc' at time zone ${timezone})::date = md.activity_date
          and ts."userId" = ${ctx.session.user.id}
        group by md.activity_date
        order by md.activity_date;
      `;

      const result = await ctx.prisma.$queryRaw<{ activity_date: Date; total_duration: bigint }[]>(
        sqlQuery
      );

      return result.map(({ activity_date, total_duration }) => {
        let activityLevel;
        const durationInMinutes = Number(total_duration) / (60 * 1000); // Convert BigInt to number, then ms to minutes
        if (durationInMinutes === 0) activityLevel = 0;
        else if (durationInMinutes <= 15) activityLevel = 1;  // 15 minutes
        else if (durationInMinutes <= 30) activityLevel = 2;  // 30 minutes
        else if (durationInMinutes <= 60) activityLevel = 3;  // 60 minutes
        else activityLevel = 4;  // more than 60 minutes

        return {
          date: activity_date,
          activityLevel,
        };
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
