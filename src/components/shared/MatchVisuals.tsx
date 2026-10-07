import { cn } from '@/utils/format';
import type { SignalStrength, MatchStatus } from '@/types';

const signalConfig: Record<SignalStrength, { label: string; color: string }> = {
  exact: { label: 'Exact match', color: 'text-success-600 bg-success-50' },
  strong: { label: 'Strong match', color: 'text-success-600 bg-success-50' },
  partial: { label: 'Partial match', color: 'text-warning-600 bg-warning-50' },
  weak: { label: 'Weak match', color: 'text-warning-600 bg-warning-50' },
  none: { label: 'No match', color: 'text-error-600 bg-error-50' },
};

export function SignalBadge({ strength }: { strength: SignalStrength }) {
  const config = signalConfig[strength];
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', config.color)}>
      {config.label}
    </span>
  );
}

const statusConfig: Record<MatchStatus, { label: string; color: string; ring: string; bg: string }> = {
  green: { label: 'Strong Potential Match', color: 'text-success-700', ring: 'ring-success-200', bg: 'bg-success-50' },
  amber: { label: 'More Information Required', color: 'text-warning-700', ring: 'ring-warning-200', bg: 'bg-warning-50' },
  red: { label: 'Low-Confidence Match', color: 'text-error-700', ring: 'ring-error-200', bg: 'bg-error-50' },
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium ring-1 ring-inset', config.color, config.ring, config.bg)}>
      <span className={cn('w-2 h-2 rounded-full', status === 'green' ? 'bg-success-500' : status === 'amber' ? 'bg-warning-500' : 'bg-error-500')} />
      {config.label}
    </span>
  );
}

export function ConfidenceScore({ score, className }: { score: number; className?: string }) {
  const color = score >= 80 ? 'text-success-600' : score >= 50 ? 'text-warning-600' : 'text-error-600';
  const barColor = score >= 80 ? 'bg-success-500' : score >= 50 ? 'bg-warning-500' : 'bg-error-500';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold font-display', color)}>{score}%</span>
        <span className="text-xs text-slate-400">match</span>
      </div>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
        <div className={cn('h-full rounded-full transition-all duration-700', barColor)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
