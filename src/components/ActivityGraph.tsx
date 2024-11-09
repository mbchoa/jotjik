import { useState } from 'react';
import { Card } from './Card';

type ActivityLevel = 0 | 1 | 2 | 3 | 4

interface DayData {
  date: string
  activityCount: number
  level: ActivityLevel
}

const getActivityLevel = (count: number): ActivityLevel => {
  if (count === 0) return 0
  if (count < 5) return 1
  if (count < 10) return 2
  if (count < 15) return 3
  return 4
}

const generateMonthData = (year: number, month: number): DayData[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Create empty slots for days before the first day of the month
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => {
    const date = new Date(year, month - 1, -startingDayOfWeek + i + 1)
    return {
      date: date.toISOString().split('T')[0] as string,
      activityCount: 0,
      level: getActivityLevel(0)
    }
  })

  // Create actual month data
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month - 1, i + 1)
    const activityCount = Math.floor(Math.random() * 20)
    return {
      date: date.toISOString().split('T')[0] as string,
      activityCount,
      level: getActivityLevel(activityCount)
    }
  })

  return [...emptyDays, ...monthDays]
}

export default function ActivityGraph() {
  const currentDate = new Date();
  const [monthData] = useState(() => 
    generateMonthData(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    )
  );

  console.log(monthData);

  const monthYearString = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4 text-center">{monthYearString}</h2>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {monthData.map((day) => (
          <div
            key={day.date}
            className={`w-full pt-[100%] rounded-sm ${
              day.level === 0 ? 'bg-gray-100' :
              day.level === 1 ? 'bg-pink-100' :
              day.level === 2 ? 'bg-pink-300' :
              day.level === 3 ? 'bg-pink-500' :
              'bg-pink-700'
            }`}
            style={{ gridColumn: 'auto' }}
            aria-label={`${day.activityCount} contributions on ${day.date}`}
          />
        ))}
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
