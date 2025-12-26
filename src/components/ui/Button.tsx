import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'classnames';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  ...rest
}: Props) => {
  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-40 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary:
      'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-soft shadow-emerald-900/40',
    secondary:
      'bg-slate-800/80 text-slate-50 hover:bg-slate-700 border border-slate-700',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-800/70 border border-transparent hover:border-slate-700',
    soft:
      'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
  };
  const sizes: Record<string, string> = {
    sm: 'text-xs px-2.5 py-1.5 gap-1',
    md: 'text-sm px-3.5 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5'
  };
  return (
    <button
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {iconLeft && <span className="mr-1.5">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="ml-1.5">{iconRight}</span>}
    </button>
  );
};
