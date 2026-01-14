import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
  iconClassName?: string;
}

export function StatCard({ icon: Icon, label, value, className, iconClassName }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl p-4 border border-border shadow-soft card-hover',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
        <div className={cn('p-2 rounded-lg bg-accent', iconClassName)}>
          <Icon className="w-5 h-5 text-accent-foreground" />
        </div>
      </div>
    </div>
  );
}
