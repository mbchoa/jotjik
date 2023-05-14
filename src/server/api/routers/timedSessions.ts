import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const timedSessionsRouter = createTRPCRouter({
  getAllTimedSessions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.timedSessions.findMany({
      where: {
        userId: ctx.session.user.id,
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
