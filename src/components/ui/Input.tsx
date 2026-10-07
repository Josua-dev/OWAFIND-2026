import { cn } from '@/utils/format';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export function Input({ label, error, hint, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          className={cn(
            'w-full h-10 rounded-lg border bg-white px-3 text-sm transition-colors',
            'placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            icon && 'pl-10',
            error ? 'border-error-300 focus:ring-error-500' : 'border-slate-300',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, className, children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        className={cn(
          'w-full h-10 rounded-lg border bg-white px-3 text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-error-300 focus:ring-error-500' : 'border-slate-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-error-600">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors min-h-[80px]',
          'placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-error-300 focus:ring-error-500' : 'border-slate-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error-600">{error}</p>}
    </div>
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
      />
      <span className="text-sm text-slate-600 leading-relaxed">{label}</span>
    </label>
  );
}
