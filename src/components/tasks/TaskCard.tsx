
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, toggleTaskAsync, deleteTaskAsync } from '@/store/slices/tasksSlice';
import { useAppDispatch } from '@/hooks';
import { Trash, Edit } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleToggle = () => {
    dispatch(toggleTaskAsync(task.id));
    toast({
      title: task.completed ? 'Task marked as incomplete' : 'Task completed',
      description: task.title,
    });
  };

  const handleDelete = () => {
    dispatch(deleteTaskAsync(task.id));
    toast({
      title: 'Task deleted',
      description: `"${task.title}" has been removed`,
      variant: 'destructive',
    });
  };

  return (
    <Card className={`transition-all duration-200 ${task.completed ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            id={`task-${task.id}`} 
            checked={task.completed}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <label 
                htmlFor={`task-${task.id}`}
                className={`font-medium cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
              >
                {task.title}
              </label>
              <PriorityBadge priority={task.priority} />
            </div>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="text-xs text-gray-400 mt-2">
                Due: {format(new Date(task.dueDate), 'PPP')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
