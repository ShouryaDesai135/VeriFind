import { cn } from '@/lib/utils';

interface CategoryPillProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryPill({ label, isActive, onClick, className }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap btn-press',
        isActive
          ? 'bg-primary text-primary-foreground shadow-soft'
          : 'bg-secondary text-secondary-foreground hover:bg-accent',
        className
      )}
    >
      {label}
    </button>
  );
}
