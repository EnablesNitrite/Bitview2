import type { ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'classnames';

interface Props {
  content: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({ content, children }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          className={clsx(
            'absolute z-40 mt-2 w-64 rounded-xl bg-slate-900/95 border border-slate-700/80 p-3 text-xs text-slate-200 shadow-xl',
            'left-1/2 -translate-x-1/2'
          )}
        >
          {content}
        </div>
      )}
    </span>
  );
};
