import { cn } from '@/utils/format';
import type { ReactNode } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export function Progress({ value, max = 100, className, color = 'primary', showLabel }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-shimmer rounded-lg', className)} />;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      {icon && <div className="text-slate-300 mb-4">{icon}</div>}
      <h3 className="font-display font-semibold text-slate-700 text-base">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-slate-200 border-t-primary-600', sizes[size], className)} />
  );
}
