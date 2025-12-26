import type { ReactNode } from 'react';
import { usePlanStore } from '../../store/planStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  title?: string;
}

export const ProOnly = ({ children }: Props) => {
  const plan = usePlanStore((s) => s.plan);
  if (plan === 'pro') return <>{children}</>;
  return <ProLocked>{children}</ProLocked>;
};

export const ProLocked = ({ children }: Props) => {
  const toggle = usePlanStore((s) => s.togglePlan);
  return (
    <div className="relative">
      <div className="pointer-events-none blur-sm select-none opacity-40">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl bg-slate-950/90 border border-violet-500/40 p-5 max-w-sm text-center shadow-soft">
          <Badge variant="pro" className="mb-2">
            Pro Feature
          </Badge>
          <h3 className="text-sm font-semibold mb-1 text-slate-50">
            Unlock arbitrage-grade tooling
          </h3>
          <p className="text-xs text-slate-300 mb-3">
            Upgrade to the Pro plan to access this module. For the demo you can
            toggle Pro in Settings.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={toggle}
          >
            Switch to Pro (demo)
          </Button>
        </div>
      </div>
    </div>
  );
};
