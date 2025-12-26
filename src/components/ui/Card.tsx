import type { ReactNode } from 'react';
import clsx from 'classnames';

interface Props {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, className, padding = 'md' }: Props) => {
  const paddingClass =
    padding === 'none'
      ? ''
      : padding === 'sm'
      ? 'p-3'
      : padding === 'lg'
      ? 'p-6'
      : 'p-4';
  return (
    <div
      className={clsx(
        'bg-slate-900/60 border border-slate-800 rounded-2xl shadow-soft',
        paddingClass,
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  actions
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-3 mb-3">
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-slate-100">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 max-w-md">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
