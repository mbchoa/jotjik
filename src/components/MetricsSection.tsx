import { trpc } from '@/utils/api';
import { MetricCard } from './MetricCard';

export const MetricsSection = () => {
  const {
    data: totalTimeForYear,
    isLoading: isLoadingTotalTime,
    isFetched: isFetchedTotalTime,
  } = trpc.metrics.getTotalTimeForYear.useQuery({
    year: new Date().getFullYear(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const {
    data: last30DayAverage,
    isLoading: isLoadingLast30DayAverage,
    isFetched: isFetchedLast30DayAverage,
  } = trpc.metrics.getLast30DaySessionAverage.useQuery();

  const totalHh = totalTimeForYear?.totalHours ?? 0;
  const totalMm = totalTimeForYear?.totalMinutes ?? 0;
  const last30DayAvgHh = last30DayAverage?.avgHours ?? 0;
  const last30DayAvgMm = last30DayAverage?.avgMinutes ?? 0;

  return (
    <div className="flex gap-4">
      <MetricCard
        label="2024 Total"
        metric={`${totalHh} h ${totalMm} m`}
        isLoading={isLoadingTotalTime}
        hasError={!isFetchedTotalTime && !totalTimeForYear}
      />
      <MetricCard
        label="30-Day Avg"
        metric={`${last30DayAvgHh} h ${last30DayAvgMm} m`}
        isLoading={isLoadingLast30DayAverage}
        hasError={!isFetchedLast30DayAverage && !last30DayAverage}
      />
    </div>
  );
};
