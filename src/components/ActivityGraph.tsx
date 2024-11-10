import { trpc } from '@/utils/api';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { useEffect, useMemo, useState } from 'react';
import { Card } from './Card';

export default function ActivityGraph() {
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState(currentDate);
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  
  // Calculate if we're viewing the current month
  const isCurrentMonth = currentDate.getMonth() === viewDate.getMonth() && 
                        currentDate.getFullYear() === viewDate.getFullYear();

  // Get previous month for prefetching
  const prevDate = useMemo(() => {
    const date = new Date(viewDate);
    date.setMonth(date.getMonth() - 1);
    return date;
  }, [viewDate]);
  
  const { data: monthData, isLoading } = trpc.timedSessions.getTimedSessionsForMonth.useQuery({
    year,
    month,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Prefetch previous month
  const utils = trpc.useContext();
  useEffect(() => {
    void utils.timedSessions.getTimedSessionsForMonth.prefetch({
      year: prevDate.getFullYear(),
      month: prevDate.getMonth() + 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [utils, prevDate]);

  const monthYearString = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(viewDate);

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const handleNextMonth = () => {
    if (!isCurrentMonth) {
      const newDate = new Date(viewDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setViewDate(newDate);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-between gap-4 mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
        >
          <RiArrowLeftSLine className="size-6" />
        </button>
        <h2 className="text-lg font-semibold">{monthYearString}</h2>
        <button
          onClick={handleNextMonth}
          disabled={isCurrentMonth}
          className={`p-1 rounded-lg ${
            isCurrentMonth 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <RiArrowRightSLine className="size-6" />
        </button>
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {isLoading ? (
            // Show loading skeleton
            Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="w-full pt-[100%] rounded-sm bg-gray-100 animate-pulse"
              />
            ))
          ) : (
            monthData?.map((day: { date: string | number | Date; activityLevel: number; }) => {
              const date = new Date(day.date);
              const isCurrentMonth = date.getMonth() + 1 === month;
              
              return (
                <div
                  key={day.date.toString()}
                  className={`w-full pt-[100%] rounded-sm ${
                    !isCurrentMonth ? 'opacity-50 ' : ''
                  }${
                    day.activityLevel === 0 ? 'bg-gray-100' :
                    day.activityLevel === 1 ? 'bg-pink-100' :
                    day.activityLevel === 2 ? 'bg-pink-300' :
                    day.activityLevel === 3 ? 'bg-pink-500' :
                    'bg-pink-700'
                  }`}
                  aria-label={`Activity level ${day.activityLevel} on ${date.toLocaleDateString()}`}
                />
              );
            })
          )}
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
        <span className="mr-2">Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${
                level === 0 ? 'bg-gray-100' :
                level === 1 ? 'bg-pink-100' :
                level === 2 ? 'bg-pink-300' :
                level === 3 ? 'bg-pink-500' :
                'bg-pink-700'
              }`}
            />
          ))}
        </div>
        <span className="ml-2">More</span>
      </div>
    </Card>
  )
}
