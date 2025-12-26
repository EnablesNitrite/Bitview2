import { NavLink } from 'react-router-dom';
import { usePlanStore } from '../../store/planStore';
import { Badge } from '../ui/Badge';

const navItemClasses =
  'flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl transition-colors';

interface NavItem {
  label: string;
  to: string;
  pro?: boolean;
}

const primary: NavItem[] = [
  { label: 'Overview', to: '/app/overview' },
  { label: 'Funding Rates', to: '/app/funding' },
  { label: 'Historical & Analytics', to: '/app/historical' },
  { label: 'Volatility', to: '/app/volatility' },
  { label: 'Heatmaps', to: '/app/heatmaps' },
  { label: 'Alerts', to: '/app/alerts' }
];

const proItems: NavItem[] = [
  { label: 'Arbitrage Engine', to: '/app/pro/arbitrage', pro: true },
  { label: 'PnL Simulator', to: '/app/pro/simulator', pro: true },
  { label: 'Volatility Terminal', to: '/app/pro/volatility', pro: true },
  { label: 'Advanced Analytics', to: '/app/pro/analytics', pro: true },
  { label: 'Pro Alerts', to: '/app/pro/alerts', pro: true },
  { label: 'Data Export', to: '/app/pro/export', pro: true },
  { label: 'Custom Dashboard', to: '/app/pro/custom', pro: true }
];

export const Sidebar = () => {
  const plan = usePlanStore((s) => s.plan);
  const isPro = plan === 'pro';

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-800/70 bg-slate-950/95 px-3 py-4 backdrop-blur-xl">
      <div className="mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/40">
            <span className="text-sm font-black text-emerald-300">π</span>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-50">
              PerpLens
            </div>
            <div className="text-[0.65rem] text-slate-400">
              Funding & Vol Intelligence
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
        <div>
          <div className="mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
            Core
          </div>
          <ul className="space-y-0.5">
            {primary.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      navItemClasses,
                      isActive
                        ? 'bg-slate-800 text-emerald-300'
                        : 'text-slate-300 hover:bg-slate-900'
                    ].join(' ')
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
              Pro Suite
            </div>
            {!isPro && (
              <Badge variant="pro" className="text-[0.6rem] px-2 py-0.5">
                Pro
              </Badge>
            )}
          </div>
          <ul className="space-y-0.5">
            {proItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      navItemClasses,
                      isActive
                        ? 'bg-violet-600/20 text-violet-100 border border-violet-500/40'
                        : 'text-slate-400 hover:bg-slate-900'
                    ].join(' ')
                  }
                >
                  <span>{item.label}</span>
                  {item.pro && <span className="text-[0.6rem] text-violet-300">★</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
            Account
          </div>
          <ul>
            <li>
              <NavLink
                to="/app/settings"
                className={({ isActive }) =>
                  [
                    navItemClasses,
                    isActive
                      ? 'bg-slate-800 text-emerald-300'
                      : 'text-slate-300 hover:bg-slate-900'
                  ].join(' ')
                }
              >
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[0.7rem] text-slate-200">
        <div className="mb-1 font-semibold text-emerald-300">
          Basic vs Pro
        </div>
        <p className="mb-2 text-slate-300">
          Basic gives you real-time funding & vol. Pro unlocks arbitrage, full
          vol terminal and bulk exports.
        </p>
        <p className="text-slate-500">
          Toggle plans in <span className="font-medium">Settings</span> for the
          demo.
        </p>
      </div>
    </aside>
  );
};
