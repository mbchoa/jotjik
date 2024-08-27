import { trpc } from '@/utils/api';
import { MetricCard } from './MetricCard';

export const MetricsSection = () => {
  const { data, isLoading, isFetched } = trpc.metrics.getTotalTimeForYear.useQuery({
    year: new Date().getFullYear(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const hh = data?.totalHours ?? 0;
  const mm = data?.totalMinutes ?? 0;

  return (
    <div className="flex gap-4">
      <MetricCard
        label="2024 Total"
        metric={`${hh} h ${mm} m`}
        isLoading={isLoading}
        hasError={!isFetched && !data}
      />
      <MetricCard label="Average" metric="1 h 15 m" isLoading={false} />
    </div>
  );
};
