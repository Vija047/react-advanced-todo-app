
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Priority, addTaskAsync, updateTask } from '@/store/slices/tasksSlice';
import { useAppDispatch } from '@/hooks';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTask?: Task;
}

const defaultTask = {
  title: '',
  description: '',
  priority: 'medium' as Priority,
  dueDate: undefined,
  completed: false,
};

const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange, editTask }) => {
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt'>>(defaultTask);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const isEditMode = !!editTask;

  useEffect(() => {
    if (editTask) {
      setTask({
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        completed: editTask.completed,
        dueDate: editTask.dueDate,
      });
      
      if (editTask.dueDate) {
        setDueDate(new Date(editTask.dueDate));
      }
    } else {
      setTask(defaultTask);
      setDueDate(undefined);
    }
  }, [editTask, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handlePriorityChange = (value: Priority) => {
    setTask((prevTask) => ({ ...prevTask, priority: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskToSave = {
      ...task,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };
    
    if (isEditMode && editTask) {
      dispatch(updateTask({ 
        ...taskToSave, 
        id: editTask.id, 
        createdAt: editTask.createdAt 
      }));
      toast({
        title: 'Task updated',
        description: `"${taskToSave.title}" has been updated`,
      });
    } else {
      dispatch(addTaskAsync(taskToSave));
      toast({
        title: 'Task added',
        description: `"${taskToSave.title}" has been added to your tasks`,
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={task.title}
                onChange={handleInputChange}
                placeholder="Task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={task.priority} 
                onValueChange={(value) => handlePriorityChange(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditMode ? 'Update Task' : 'Add Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
