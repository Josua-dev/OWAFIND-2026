import { useApp } from '@/context/AppContext';
import { User, Building2, Scale, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/format';
import type { Role } from '@/types';

const roles: { value: Role; label: string; icon: typeof User; description: string }[] = [
  { value: 'beneficiary', label: 'Beneficiary', icon: User, description: 'Discover and claim benefits' },
  { value: 'institution', label: 'Institution', icon: Building2, description: 'Review matches and claims' },
  { value: 'regulator', label: 'Regulator', icon: Scale, description: 'Oversight and analytics' },
  { value: 'executive', label: 'Executive', icon: TrendingUp, description: 'Strategic overview' },
  { value: 'admin', label: 'Admin', icon: Shield, description: 'System administration' },
];

export function RoleSwitcher() {
  const { role, switchRole } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = roles.find((r) => r.value === role)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const Icon = current.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-accent-600 bg-accent-50 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
          Demo Mode
        </span>
        <div className="w-px h-4 bg-slate-200" />
        <Icon className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Switch Demo Role</p>
              <p className="text-xs text-slate-400 mt-0.5">No real authentication — for demonstration only</p>
            </div>
            <div className="p-2">
              {roles.map((r) => {
                const RoleIcon = r.icon;
                return (
                  <button
                    key={r.value}
                    onClick={() => { switchRole(r.value); setOpen(false); }}
                    className={cn(
                      'w-full flex items-start gap-3 p-2.5 rounded-lg transition-colors text-left',
                      role === r.value ? 'bg-primary-50' : 'hover:bg-slate-50'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      role === r.value ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                    )}>
                      <RoleIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium', role === r.value ? 'text-primary-700' : 'text-slate-700')}>
                        {r.label}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{r.description}</p>
                    </div>
                    {role === r.value && (
                      <div className="w-2 h-2 rounded-full bg-primary-500 mt-2.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
