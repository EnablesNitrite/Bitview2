import { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { ProOnly } from '../components/common/ProLock';
import { Button } from '../components/ui/Button';

interface WidgetState {
  fundingHeatmap: boolean;
  volHistogram: boolean;
  arbitrageTable: boolean;
  overviewCards: boolean;
}

export const ProCustomDashboardPage = () => {
  const [widgets, setWidgets] = useState<WidgetState>({
    fundingHeatmap: true,
    volHistogram: true,
    arbitrageTable: true,
    overviewCards: true
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof WidgetState) => {
    setWidgets((w) => ({ ...w, [key]: !w[key] }));
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Custom dashboard layout (Pro)
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Choose which widgets, exchanges and themes you want to see by default.
          For this demo we keep the configuration local to your browser.
        </p>
      </div>
      <ProOnly>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          <Card>
            <CardHeader
              title="Layout configuration"
              subtitle="Toggle key widgets and appearance."
            />
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                {(
                  [
                    ['overviewCards', 'Overview metrics'],
                    ['fundingHeatmap', 'Funding heatmap'],
                    ['volHistogram', 'Volatility histogram'],
                    ['arbitrageTable', 'Arbitrage table']
                  ] as [keyof WidgetState, string][]
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={widgets[key]}
                      onChange={() => toggle(key)}
                      className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                    />
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2">
                <span>Theme</span>
                <select
                  value={theme}
                  onChange={(e) =>
                    setTheme(e.target.value as 'dark' | 'light')
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light (placeholder)</option>
                </select>
              </div>
              <Button
                size="sm"
                onClick={save}
              >
                Save layout (mock)
              </Button>
              {saved && (
                <div className="text-[0.7rem] text-emerald-300">
                  Layout saved in local state (demo). A real deployment would
                  sync this to your account.
                </div>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader
              title="Preview (static)"
              subtitle="Illustrative preview of how your layout preferences affect the main dashboard."
            />
            <div className="space-y-3 text-xs">
              {widgets.overviewCards && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  Overview cards would be visible at the top of the dashboard.
                </div>
              )}
              {widgets.fundingHeatmap && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  Funding heatmap would occupy a wide row below the overview.
                </div>
              )}
              {widgets.volHistogram && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  Volatility histogram would appear alongside the arbitrage
                  table.
                </div>
              )}
              {widgets.arbitrageTable && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  Arbitrage table would be pinned to the bottom half of the
                  layout for quick scanning.
                </div>
              )}
              <p className="text-[0.7rem] text-slate-500">
                Theme is currently set to{' '}
                <span className="font-semibold">{theme}</span>. For this demo,
                only the dark theme is fully designed.
              </p>
            </div>
          </Card>
        </div>
      </ProOnly>
    </div>
  );
};
