import { format } from "date-fns";

import { trpc } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Timer from "../components/Timer";

interface IQueuedSession {
  startedAt: string;
  duration: number;
}

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const saveTimeSession = trpc.timedSessions.saveTimedSession.useMutation();

  const currentTime = Date.now();
  const dayTokens = format(currentTime, "do").split(/(\d+)/).slice(1);
  const month = format(currentTime, "MMMM");
  const year = format(currentTime, "yyyy");

  const handleSaveTimedSession = useCallback(
    async (startedAt: string, duration: number) => {
      const payload = { startedAt, duration };

      if (!session) {
        const existingQueuedSessions = localStorage.getItem("queuedSessions");
        const parsedQueuedSessions: IQueuedSession[] = JSON.parse(
          existingQueuedSessions ?? "[]"
        ) as IQueuedSession[];
        // If the user is not logged in, queue the session to local storage
        localStorage.setItem(
          "queuedSessions",
          JSON.stringify([...parsedQueuedSessions, payload])
        );
        void signIn("undefined", { callbackUrl: "/stats" });
      } else {
        // If the user is logged in, save the session to the database
        await saveTimeSession.mutateAsync(payload);

        // Redirect to the stats page
        void router.push("/stats");
      }
    },
    [router, saveTimeSession, session]
  );

  return (
    <>
      <header className="text-center">
        <h1 className="flex justify-center text-3xl">
          {month} {dayTokens[0]}
          <sup className="pt-2 text-base">{dayTokens[1]}</sup>&nbsp;
          {year}
        </h1>
        <p className="mt-2 text-xl">{format(currentTime, "EEEE")}</p>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <Timer onSave={handleSaveTimedSession} />
      </div>
    </>
  );
};

export default Home;
