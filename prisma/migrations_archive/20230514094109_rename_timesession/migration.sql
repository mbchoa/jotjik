/*
  Warnings:

  - You are about to drop the `TimedSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimedSession" DROP CONSTRAINT "TimedSession_userId_fkey";

-- DropTable
DROP TABLE "TimedSession";

-- CreateTable
CREATE TABLE "TimedSessions" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TimedSessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimedSessions" ADD CONSTRAINT "TimedSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
