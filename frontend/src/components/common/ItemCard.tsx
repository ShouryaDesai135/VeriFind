import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Item, categoryConfig } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
  className?: string;
}

export function ItemCard({ item, className }: ItemCardProps) {
  const statusStyles = {
    available: 'bg-success/10 text-success border-success/20',
    claimed: 'bg-warning/10 text-warning border-warning/20',
    resolved: 'bg-muted text-muted-foreground border-border',
  };

  const typeStyles = {
    lost: 'bg-destructive/10 text-destructive',
    found: 'bg-primary/10 text-primary',
  };

  return (
    <Link to={`/item/${item.id}`}>
      <div
        className={cn(
          'bg-card rounded-xl border border-border overflow-hidden shadow-soft card-hover',
          className
        )}
      >
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge
            className={cn(
              'absolute top-2 left-2 uppercase text-xs font-medium',
              typeStyles[item.type]
            )}
            variant="outline"
          >
            {item.type}
          </Badge>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground line-clamp-1">{item.title}</h3>
            <Badge
              variant="outline"
              className={cn('text-xs capitalize shrink-0', statusStyles[item.status])}
            >
              {item.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.location.split(',')[0]}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
