// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
import { trpc } from '@/utils/api';
import { Flex, Text } from '@tremor/react';
import { add, format } from 'date-fns';
import { useMemo, type SVGProps } from 'react';
import { Card } from './Card';

export const StreakCard = () => {
  const date = useMemo(() => new Date().toISOString(), []);
  const { data } = trpc.streaks.getStreakFromDate.useQuery({
    date,
  });

  const numStreak = data?.streakCount ?? 0;
  const includeDate = data?.includeDate ?? false;

  const streakBubbles = Array.from({ length: numStreak }, (_, key) => {
    return <CompletedState key={key} />;
  });
  const emptyBubbles = Array.from({ length: 7 - numStreak }, (_, key) => {
    const text = format(add(new Date(), { days: includeDate ? key + 1 : key }), 'M/d');
    return <EmptyState key={key} text={text} />;
  });

  return (
    <Card>
      <div className="space-y-4">
        <Text>Daily Streak</Text>
        <Flex justifyContent="between" alignItems="center">
          {streakBubbles}
          {emptyBubbles}
        </Flex>
        {numStreak === 0 && <Text className="text-center ">Start a new streak!</Text>}
        {numStreak > 1 && (
          <Text className="text-center">You&apos;re on a {numStreak} day streak! Keep it up!</Text>
        )}
      </div>
    </Card>
  );
};

function EmptyState({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center bg-pink-100 w-9 h-9 rounded-full">
      <span className="text-tremor-content text-[10px]">{text}</span>
    </div>
  );
}

function CompletedState() {
  return (
    <div className="flex items-center justify-center bg-yellow-400 w-9 h-9 rounded-full">
      <StarIcon className="w-5 h-5 text-pink-400" />
    </div>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
