import { Bell, CheckCheck, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/Feedback';
import { useApp } from '@/context/AppContext';
import { cn, timeAgo } from '@/utils/format';

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (query && !n.title.toLowerCase().includes(query.toLowerCase()) && !n.message.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated on your benefits and claims</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search notifications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="flex-1"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn('px-4 h-10 rounded-lg text-sm font-medium transition-colors', filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn('px-4 h-10 rounded-lg text-sm font-medium transition-colors', filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Bell className="w-12 h-12" />} title="No notifications" description="You're all caught up!" />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card key={n.id} hover className="p-4" onClick={() => markNotificationRead(n.id)}>
              <div className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0', n.read ? 'bg-slate-200' : 'bg-primary-500')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', n.read ? 'text-slate-600' : 'text-slate-900')}>{n.title}</p>
                    <span className="text-xs text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{n.message}</p>
                  {n.link && (
                    <Link to={n.link} className="text-xs text-primary-600 hover:underline mt-2 inline-block">
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
