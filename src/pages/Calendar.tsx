
import React from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAppSelector } from '@/hooks';
import { format } from 'date-fns';
import { Task } from '@/store/slices/tasksSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PriorityBadge from '@/components/tasks/PriorityBadge';
import WeatherCard from '@/components/weather/WeatherCard';

const Calendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { tasks } = useAppSelector((state) => state.tasks);

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  
  // Filter tasks for the selected date
  const tasksForDate = tasks.filter(task => {
    if (!task.dueDate || !date) return false;
    return format(new Date(task.dueDate), 'yyyy-MM-dd') === formattedDate;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {formattedDate ? (
                <WeatherCard date={formattedDate} />
              ) : (
                <p>Select a date to see the weather forecast</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                Tasks for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForDate.length > 0 ? (
                <ul className="space-y-4">
                  {tasksForDate.map((task: Task) => (
                    <li key={task.id} className="flex items-center justify-between p-2 border-b">
                      <div className="flex items-center">
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.title}
                        </span>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No tasks scheduled for this date</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
