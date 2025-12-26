import type { ReactNode } from 'react';
import clsx from 'classnames';

interface Props {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'outline' | 'pro';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: Props) => {
  const variants: Record<string, string> = {
    default: 'bg-slate-800 text-slate-200 border border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
    outline: 'bg-transparent text-slate-300 border border-slate-600',
    pro: 'bg-violet-500/15 text-violet-200 border border-violet-500/40'
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
