
import React from 'react';
import { useAppSelector } from '@/hooks';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/store/slices/tasksSlice';

const Important: React.FC = () => {
  const { tasks } = useAppSelector((state) => state.tasks);
  const [openForm, setOpenForm] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Task | undefined>(undefined);

  // Filter for high priority tasks
  const importantTasks = tasks.filter(task => task.priority === 'high');

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditTask(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Important Tasks</h1>
        <Button onClick={() => setOpenForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {importantTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No important tasks found</p>
            <Button variant="outline" onClick={() => setOpenForm(true)} className="mt-4">
              Add an important task
            </Button>
          </div>
        ) : (
          importantTasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
          ))
        )}
      </div>

      <TaskForm 
        open={openForm} 
        onOpenChange={handleCloseForm} 
        editTask={editTask} 
      />
    </div>
  );
};

export default Important;
