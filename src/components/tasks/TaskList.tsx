
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchTasks, Task } from '@/store/slices/tasksSlice';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const [openForm, setOpenForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditTask(undefined);
  };

  const filteredTasks = () => {
    switch (activeTab) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => dispatch(fetchTasks())}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setOpenForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="high" className="hidden md:inline-flex">High</TabsTrigger>
          <TabsTrigger value="medium" className="hidden md:inline-flex">Medium</TabsTrigger>
          <TabsTrigger value="low" className="hidden md:inline-flex">Low</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-md" />
              </div>
            ))
          ) : filteredTasks().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks found</p>
              <Button 
                variant="outline" 
                onClick={() => setOpenForm(true)} 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first task
              </Button>
            </div>
          ) : (
            filteredTasks().map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask} 
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <TaskForm 
        open={openForm} 
        onOpenChange={handleCloseForm} 
        editTask={editTask} 
      />
    </div>
  );
};

export default TaskList;
