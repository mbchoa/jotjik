import { trpc } from '@/utils/api';
import { Card } from './Card';

export default function ActivityGraph() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: monthData, isLoading } = trpc.timedSessions.getTimedSessionsForMonth.useQuery({
    year,
    month,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const monthYearString = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4 text-center">{monthYearString}</h2>
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
            monthData?.map((day) => {
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
