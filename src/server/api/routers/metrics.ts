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
        WITH user_daily_activity AS (
          SELECT DISTINCT
            ("startedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::DATE AS activity_date
          FROM "TimedSessions"
          WHERE "userId" = ${ctx.session.user.id}
        ),
        user_activity_with_lag AS (
          SELECT
            activity_date,
            LAG(activity_date) OVER (ORDER BY activity_date) AS prev_activity_date
          FROM user_daily_activity
        ),
        user_streak_groups AS (
          SELECT
            activity_date,
            SUM(CASE 
              WHEN activity_date - prev_activity_date = 1 
              THEN 0 
              ELSE 1 
            END) OVER (ORDER BY activity_date) AS streak_group
          FROM user_activity_with_lag
        ),
        current_date_in_user_timezone AS (
          SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::DATE AS date
        ),
        latest_activity AS (
          SELECT MAX(activity_date) as last_date
          FROM user_daily_activity
        ),
        streak_check AS (
          SELECT
            MAX(activity_date) AS last_activity_date,
            COUNT(*) AS streak_count
          FROM user_streak_groups
          GROUP BY streak_group
          HAVING MAX(activity_date) = (SELECT last_date FROM latest_activity)
          ORDER BY last_activity_date DESC
          LIMIT 1
        )
        SELECT
          CASE
            WHEN (SELECT date FROM current_date_in_user_timezone) - (SELECT last_date FROM latest_activity) > 2 THEN 0
            ELSE COALESCE((SELECT streak_count FROM streak_check), 0)
          END AS streak_count;
      `;

      const result = await ctx.prisma.$queryRaw<{ streak_count: number }[]>(sqlQuery);

      return {
        currentStreak: result[0]?.streak_count ?? 0,
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
          FLOOR(avg_duration_ms / 3600000)::INTEGER AS avg_hours,
          FLOOR((avg_duration_ms % 3600000) / 60000)::INTEGER AS avg_minutes,
          FLOOR((avg_duration_ms % 60000) / 1000)::INTEGER AS avg_seconds
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
