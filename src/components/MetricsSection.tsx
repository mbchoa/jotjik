import { trpc } from '@/utils/api';
import { MetricCard } from './MetricCard';

function formatTime(hours: number, minutes: number) {
  if (hours === 0) {
    return `${minutes} m`;
  } else {
    return `${hours} h ${minutes} m`;
  }
}

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

  const {
    data: streak,
    isLoading: isLoadingLongestStreak,
    isFetched: isFetchedLongestStreak,
  } = trpc.metrics.getLongestStreak.useQuery();

  const totalHh = totalTimeForYear?.totalHours ?? 0;
  const totalMm = totalTimeForYear?.totalMinutes ?? 0;
  const last30DayAvgHh = last30DayAverage?.avgHours ?? 0;
  const last30DayAvgMm = last30DayAverage?.avgMinutes ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:flex">
      <MetricCard
        label="2024 Total"
        metric={formatTime(totalHh, totalMm)}
        isLoading={isLoadingTotalTime}
        hasError={!isFetchedTotalTime && !totalTimeForYear}
      />
      <MetricCard
        label="2024 Longest Streak"
        metric={`${streak?.streakLength ?? 0}`}
        isLoading={isLoadingLongestStreak}
        hasError={!isFetchedLongestStreak && !streak}
      />
      <MetricCard
        label="30-Day Avg"
        metric={formatTime(last30DayAvgHh, last30DayAvgMm)}
        isLoading={isLoadingLast30DayAverage}
        hasError={!isFetchedLast30DayAverage && !last30DayAverage}
      />
    </div>
  );
};
