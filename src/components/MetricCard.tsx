import { Card } from '@/components/Card';
import { trpc } from '@/utils/api';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Flex, Icon, Metric, ProgressBar, Text } from '@tremor/react';

export const MetricCard = () => {
  const { data: allTimedSessions, isLoading } = trpc.timedSessions.getAllTimedSessions.useQuery();

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-24 mt-1 bg-gray-200 rounded-full"></div>
          <Flex className="mt-4">
            <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-2.5 w-24 bg-gray-200 rounded-full"></div>
          </Flex>
          <ProgressBar value={33} className="mt-2" />
          <span className="sr-only">Loading...</span>
        </div>
      </Card>
    );
  }

  if (!allTimedSessions) {
    return (
      <Card>
        <Flex flexDirection="col">
          <Icon icon={ExclamationCircleIcon} className="h-5 w-5 text-red-500 mr-2" size="lg" />
          <Text className="mt-2">Failed to load metric</Text>
        </Flex>
      </Card>
    );
  }

  const totalDurationInMs = allTimedSessions.reduce((acc, { duration }) => acc + duration, 0);
  const totalDurationInHours = totalDurationInMs / 1000 / 60 / 60;
  return (
    <Card>
      <Text>All Time</Text>
      <Metric>{Math.round(totalDurationInHours)} H</Metric>
    </Card>
  );
};
