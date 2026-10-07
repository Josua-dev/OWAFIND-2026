import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

const sizeMap = {
  sm: { icon: 20, text: 'text-base' },
  md: { icon: 24, text: 'text-lg' },
  lg: { icon: 32, text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true, light }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <ShieldCheck className="text-white" size={s.icon} strokeWidth={2.2} />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-500 border-2 border-white" />
      </div>
      {showText && (
        <div className="leading-none">
          <span className={`font-display font-bold ${s.text} ${light ? 'text-white' : 'text-slate-900'}`}>
            OwaFind
          </span>
          <span className={`block text-[10px] ${light ? 'text-white/60' : 'text-slate-400'} font-medium tracking-wide mt-0.5`}>
            Find What May Belong to You
          </span>
        </div>
      )}
    </Link>
  );
}
