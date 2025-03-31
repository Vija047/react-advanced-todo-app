
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskList from '@/components/tasks/TaskList';
import WeatherCard from '@/components/weather/WeatherCard';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.tasks);
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Format current date as YYYY-MM-DD
    setCurrentDate(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get high priority tasks
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Total tasks in your list</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks you've completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks waiting to be done</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">Of your total tasks</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Tasks</CardTitle>
              <CardDescription>Tasks that need your immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {highPriorityTasks.length === 0 ? (
                <p className="text-muted-foreground">No high priority tasks. Great job!</p>
              ) : (
                <ul className="space-y-2">
                  {highPriorityTasks.slice(0, 3).map(task => (
                    <li key={task.id} className="text-destructive">
                      • {task.title}
                    </li>
                  ))}
                  {highPriorityTasks.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      + {highPriorityTasks.length - 3} more high priority tasks
                    </li>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Weather</CardTitle>
              <CardDescription>Current weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherCard date={currentDate} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;
