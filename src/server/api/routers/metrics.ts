import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const metricsRouter = createTRPCRouter({
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
});
