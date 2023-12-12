import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const timedSessionsRouter = createTRPCRouter({
  health: protectedProcedure.query(() => Math.random()),
  getInfiniteTimedSessions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor } = input;
      const limit = input.limit ?? 10;
      const timedSessions = await ctx.prisma.timedSessions.findMany({
        take: limit + 1,
        where: {
          userId: ctx.session.user.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          startedAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (timedSessions.length > limit) {
        const nextSession = timedSessions.pop();
        if (nextSession) {
          nextCursor = nextSession.id;
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
