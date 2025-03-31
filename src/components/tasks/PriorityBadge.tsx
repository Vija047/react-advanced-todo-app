
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Priority } from '@/store/slices/tasksSlice';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getVariant = (priority: Priority): "default" | "destructive" | "outline" | "secondary" => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant(priority)} className="capitalize">
      {priority}
    </Badge>
  );
};

export default PriorityBadge;
