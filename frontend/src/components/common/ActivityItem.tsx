import { Package, CheckCircle, Clock } from 'lucide-react';
import { UserActivity } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: UserActivity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const config = {
    posted: {
      icon: Package,
      color: 'text-primary bg-primary/10',
      label: 'Posted',
    },
    claimed: {
      icon: Clock,
      color: 'text-warning bg-warning/10',
      label: 'Claimed',
    },
    resolved: {
      icon: CheckCircle,
      color: 'text-success bg-success/10',
      label: 'Resolved',
    },
  };

  const { icon: Icon, color, label } = config[activity.type];

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={cn('p-2 rounded-lg', color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{activity.itemTitle}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
    </div>
  );
}
