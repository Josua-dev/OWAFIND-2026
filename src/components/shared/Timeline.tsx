import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/utils/format';
import { formatDateTime } from '@/utils/format';
import type { ClaimTimelineEvent } from '@/types';

export function ClaimTimeline({ events }: { events: ClaimTimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            {event.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
              >
                <CheckCircle2 className="w-6 h-6 text-success-500" />
              </motion.div>
            ) : event.current ? (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-6 h-6 text-warning-500" />
              </motion.div>
            ) : (
              <Circle className="w-6 h-6 text-slate-300" />
            )}
            {index < events.length - 1 && (
              <div className={cn(
                'w-0.5 flex-1 min-h-[28px] my-1',
                event.completed ? 'bg-success-300' : 'bg-slate-200'
              )} />
            )}
          </div>
          <div className="pb-6 flex-1">
            <p className={cn(
              'font-medium text-sm',
              event.completed ? 'text-slate-900' : event.current ? 'text-warning-700' : 'text-slate-400'
            )}>
              {event.label}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
            {event.timestamp && (
              <p className="text-xs text-slate-400 mt-1">{formatDateTime(event.timestamp)}</p>
            )}
            {event.current && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-warning-600 bg-warning-50 px-2 py-0.5 rounded-md">
                In Progress
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StateBadge({ state }: { state: string }) {
  const stateConfig: Record<string, { color: string; label: string }> = {
    DRAFT: { color: 'bg-slate-100 text-slate-600', label: 'Draft' },
    SUBMITTED: { color: 'bg-blue-50 text-blue-700', label: 'Submitted' },
    IDENTITY_REVIEW: { color: 'bg-indigo-50 text-indigo-700', label: 'Identity Review' },
    EVIDENCE_REVIEW: { color: 'bg-accent-50 text-accent-700', label: 'Evidence Review' },
    INSTITUTION_REVIEW: { color: 'bg-primary-50 text-primary-700', label: 'Institution Review' },
    MORE_INFORMATION_REQUIRED: { color: 'bg-warning-50 text-warning-700', label: 'More Info Required' },
    RESUBMITTED: { color: 'bg-blue-50 text-blue-700', label: 'Resubmitted' },
    APPROVED: { color: 'bg-success-50 text-success-700', label: 'Approved' },
    REJECTED: { color: 'bg-error-50 text-error-700', label: 'Rejected' },
    APPEAL: { color: 'bg-error-50 text-error-700', label: 'Under Appeal' },
    CLOSED: { color: 'bg-slate-100 text-slate-500', label: 'Closed' },
  };
  const config = stateConfig[state] || { color: 'bg-slate-100 text-slate-600', label: state };
  return (
    <span className={cn('inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', config.color)}>
      {config.label}
    </span>
  );
}
