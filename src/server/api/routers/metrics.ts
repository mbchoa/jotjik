import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const metricsRouter = createTRPCRouter({
  getCurrentStreak: protectedProcedure
    .input(
      z.object({
        timezone: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { timezone } = input;

      const sqlQuery = Prisma.sql`
        WITH daily_sessions AS (
          SELECT DISTINCT
            DATE("startedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}) AS session_date
          FROM
            "TimedSessions"
          WHERE
            "userId" = ${ctx.session.user.id}
        ),
        current_streak AS (
          SELECT
            MAX(session_date) AS streak_end,
            COUNT(*) AS streak_length
          FROM (
            SELECT
              session_date,
              DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE ${timezone}) - 
                ROW_NUMBER() OVER (ORDER BY session_date DESC) AS date_group
            FROM
              daily_sessions
            WHERE
              session_date <= DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE ${timezone})
          ) AS consecutive_days
          WHERE
            date_group = DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE ${timezone})
        )
        SELECT
          CASE
            WHEN EXISTS (
              SELECT 1 FROM daily_sessions 
              WHERE session_date = DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE ${timezone})
            ) THEN GREATEST(COALESCE(streak_length, 0), 1)
            ELSE COALESCE(streak_length, 0)
          END AS current_streak,
          CASE
            WHEN EXISTS (
              SELECT 1 FROM daily_sessions 
              WHERE session_date = DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE ${timezone})
            ) THEN DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE ${timezone})::DATE
            ELSE streak_end
          END AS streak_end
        FROM current_streak;
      `;

      const result = await ctx.prisma.$queryRaw<
        { current_streak: number; streak_end: Date }[]
      >(sqlQuery);

      return {
        currentStreak: result[0]?.current_streak ?? 0,
        streakEnd: result[0]?.streak_end ?? null,
      };
    }),
  getTotalTimeForYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        timezone: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { year, timezone } = input;

      const sqlQuery = Prisma.sql`
        SELECT
          FLOOR(SUM(duration) / 3600000) AS total_hours,
          FLOOR((SUM(duration) % 3600000) / 60000) AS total_minutes,
          FLOOR((SUM(duration) % 60000) / 1000) AS total_seconds
        FROM
          "TimedSessions"
        WHERE
          "userId" = ${ctx.session.user.id}
          AND EXTRACT(YEAR FROM "startedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}) = ${year}
      `;

      const result = await ctx.prisma.$queryRaw<
        { total_hours: number; total_minutes: number; total_seconds: number }[]
      >(sqlQuery);

      if (result.length === 0) {
        return { totalHours: 0, totalMinutes: 0, totalSeconds: 0 };
      }

      return {
        totalHours: result[0]?.total_hours ?? 0,
        totalMinutes: result[0]?.total_minutes ?? 0,
        totalSeconds: result[0]?.total_seconds ?? 0,
      };
    }),
  getLast30DaySessionAverage: protectedProcedure.query(async ({ ctx }) => {
    const sqlQuery = Prisma.sql`
        WITH session_stats AS (
          SELECT 
              AVG(duration) AS avg_duration_ms
          FROM 
              "TimedSessions"
          WHERE 
              "userId" = ${ctx.session.user.id}
              AND "startedAt" >= CURRENT_DATE - INTERVAL '30 days'
      )
      SELECT 
          FLOOR(avg_duration_ms / 3600000) AS avg_hours,
          FLOOR((avg_duration_ms % 3600000) / 60000) AS avg_minutes,
          FLOOR((avg_duration_ms % 60000) / 1000) AS avg_seconds
      FROM 
          session_stats;
      `;

    const result = await ctx.prisma.$queryRaw<
      { avg_hours: number; avg_minutes: number; avg_seconds: number }[]
    >(sqlQuery);

    if (result.length === 0) {
      return { avgHours: 0, avgMinutes: 0, avgSeconds: 0 };
    }

    return {
      avgHours: result[0]?.avg_hours ?? 0,
      avgMinutes: result[0]?.avg_minutes ?? 0,
      avgSeconds: result[0]?.avg_seconds ?? 0,
    };
  }),
  getLongestStreak: protectedProcedure.query(async ({ ctx }) => {
    const sqlQuery = Prisma.sql`
        WITH daily_sessions AS (
          -- Get the distinct dates for the user's sessions
          SELECT DISTINCT
            DATE("startedAt") AS session_date
          FROM
            "TimedSessions"
          WHERE
            "userId" = ${ctx.session.user.id}
            AND EXTRACT(YEAR FROM "startedAt") = EXTRACT(YEAR FROM CURRENT_DATE)
        ),
        numbered_dates AS (
          -- Number the dates sequentially
          SELECT
            session_date,
            session_date - (ROW_NUMBER() OVER (ORDER BY session_date) * INTERVAL '1 day') AS group_date
          FROM
            daily_sessions
        ),
        streaks AS (
          -- Group the consecutive dates
          SELECT
            MIN(session_date) AS streak_start,
            MAX(session_date) AS streak_end,
            COUNT(*) AS streak_length
          FROM
            numbered_dates
          GROUP BY
            group_date
        )
        -- Select the longest streak
        SELECT
          streak_start,
          streak_end,
          streak_length
        FROM
          streaks
        ORDER BY
          streak_length DESC
        LIMIT 1;
      `;

    const result = await ctx.prisma.$queryRaw<
      {
        streak_start: number;
        streak_end: number;
        streak_length: number;
      }[]
    >(sqlQuery);

    if (result.length === 0) {
      return { streakStart: null, streakEnd: null, streakLength: 0 };
    }

    return {
      streakStart: result[0]?.streak_start ?? null,
      streakEnd: result[0]?.streak_end ?? null,
      streakLength: result[0]?.streak_length ?? 0,
    };
  }),
});
