import { Card } from '@/components/Card';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Flex, Icon, Text } from '@tremor/react';

interface IMetricCardProps {
  label: string;
  metric: string;
  isLoading: boolean;
  hasError?: boolean;
}

export const MetricCard = ({ label, metric, isLoading, hasError = false }: IMetricCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-24 mt-1 bg-gray-200 rounded-full"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card>
        <Flex flexDirection="col">
          <Icon icon={ExclamationCircleIcon} className="h-5 w-5 text-red-500 mr-2" size="lg" />
          <Text className="mt-2">Failed to load metric</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">{label}</h3> 
      <p className="text-tremor-base font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{metric}</p>
    </Card>
  );
};
