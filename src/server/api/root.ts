import { metricsRouter } from '@/server/api/routers/metrics';
import { timedSessionsRouter } from '@/server/api/routers/timedSessions';
import { createTRPCRouter } from '@/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  timedSessions: timedSessionsRouter,
  metrics: metricsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
