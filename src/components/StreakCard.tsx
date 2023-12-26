import { Flex, Text } from '@tremor/react';
import { type SVGProps } from 'react';
import { Card } from './Card';

export const StreakCard = () => {
  return (
    <Card>
      <div className="space-y-4">
        <Text>Daily Streak</Text>
        <Flex justifyContent="between" alignItems="center">
          <EmptyState />
          <CompletedState />
          <CompletedState />
          <CompletedState />
          <EmptyState />
          <EmptyState />
        </Flex>
        <Text className="text-center">Start a new streak!</Text>
      </div>
    </Card>
  );
};

function EmptyState() {
  return <div className="flex items-center justify-center bg-pink-100 w-8 h-8 rounded-full" />;
}

function CompletedState() {
  return (
    <div className="flex items-center justify-center bg-yellow-400 w-8 h-8 rounded-full">
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
