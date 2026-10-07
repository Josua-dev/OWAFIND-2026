import { cn } from '@/utils/format';
import type { ReactNode } from 'react';

type Tone = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<Tone, { container: string; title: string }> = {
  info: { container: 'bg-blue-50 border-blue-200 text-blue-800', title: 'text-blue-900' },
  success: { container: 'bg-success-50 border-success-200 text-success-800', title: 'text-success-900' },
  warning: { container: 'bg-warning-50 border-warning-200 text-warning-800', title: 'text-warning-900' },
  error: { container: 'bg-error-50 border-error-200 text-error-800', title: 'text-error-900' },
};

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  return (
    <div className={cn('rounded-lg border px-4 py-3 text-sm', toneStyles[tone].container, className)}>
      {title && <p className={cn('font-semibold mb-1', toneStyles[tone].title)}>{title}</p>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
