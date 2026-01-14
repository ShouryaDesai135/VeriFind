import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
  withTopPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  withBottomNav = true,
  withTopPadding = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-background',
        withTopPadding && 'pt-4',
        withBottomNav && 'pb-20',
        className
      )}
    >
      <div className="container max-w-lg mx-auto px-4">{children}</div>
    </div>
  );
}
