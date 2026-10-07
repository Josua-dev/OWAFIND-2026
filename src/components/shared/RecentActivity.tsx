import { Server, User } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { timeAgo } from '@/utils/format';
import type { AuditEvent } from '@/types';

// Shared "What's Happening" feed — renders system/user activity in the same
// style across all role dashboards.
export function RecentActivityCard({
  title = "What's Happening",
  subtitle,
  events,
  max = 6,
  action,
  span = true,
}: {
  title?: string;
  subtitle?: string;
  events: AuditEvent[];
  max?: number;
  action?: React.ReactNode;
  span?: boolean;
}) {
  return (
    <Card className={span ? 'lg:col-span-2' : undefined}>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <CardBody className="pt-1">
        <div className="space-y-1">
          {events.slice(0, max).map((e) => (
            <div key={e.id} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${e.actor === 'System' ? 'bg-slate-100 text-slate-500' : 'bg-primary-50 text-primary-600'}`}>
                {e.actor === 'System' ? <Server className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">{e.actor}</span> — {e.action.toLowerCase()}{' '}
                  <span className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{e.target}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{e.details}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{timeAgo(e.timestamp)}</span>
            </div>
          ))}
          {events.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No recent activity</p>}
        </div>
      </CardBody>
    </Card>
  );
}
