import { useApp } from '@/context/AppContext';
import { Bell, CheckCheck, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn, timeAgo } from '@/utils/format';
import type { Notification } from '@/types';

const typeIcons: Record<Notification['type'], string> = {
  match: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  claim: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

export function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-display font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">No notifications</div>
              ) : (
                notifications.map((n: Notification) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      'px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors',
                      !n.read && 'bg-primary-50/40'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        n.read ? 'bg-slate-200' : 'bg-primary-500'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setOpen(false)}
                        className="text-xs text-primary-600 hover:underline mt-1.5 inline-block"
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
