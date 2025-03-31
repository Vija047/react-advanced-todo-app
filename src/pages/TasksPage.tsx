
import React from 'react';
import TaskList from '@/components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Tasks</h1>
      <TaskList />
    </div>
  );
};

export default TasksPage;
