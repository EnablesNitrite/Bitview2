import { Link } from 'react-router-dom';
import { PlanBadge } from '../common/PlanBadge';
import { Button } from '../ui/Button';
import { usePlanStore } from '../../store/planStore';

export const Topbar = () => {
  const plan = usePlanStore((s) => s.plan);
  const toggle = usePlanStore((s) => s.togglePlan);

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-800/70 bg-slate-950/80 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Link
          to="/app/overview"
          className="text-xs font-semibold tracking-wide text-slate-300"
        >
          Dashboard
        </Link>
        <div className="hidden text-xs text-slate-500 md:block">
          Funding, volatility & arbitrage telemetry at a glance.
        </div>
      </div>
      <div className="flex items-center gap-3">
        <PlanBadge />
        {plan === 'basic' && (
          <Button
            size="sm"
            variant="soft"
            onClick={toggle}
          >
            Upgrade to Pro (demo)
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-950">
            Q
          </div>
        </div>
      </div>
    </header>
  );
};
