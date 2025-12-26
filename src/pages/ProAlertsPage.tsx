import { Card, CardHeader } from '../components/ui/Card';
import { ProOnly } from '../components/common/ProLock';
import { Button } from '../components/ui/Button';

export const ProAlertsPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Pro alerts
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Funding reversal, cross-exchange spread and volatility regime-change
          alerts with advanced controls such as cooldowns and snooze.
        </p>
      </div>
      <ProOnly>
        <Card>
          <CardHeader
            title="Alert types"
            subtitle="This UI is a mocked view of what a production-grade alert builder looks like."
          />
          <div className="grid gap-3 md:grid-cols-2 text-xs">
            <div className="space-y-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-semibold text-slate-100 mb-1">
                  Arbitrage opportunity alert
                </div>
                <p className="text-[0.7rem] text-slate-400">
                  Notify when funding spread between two venues exceeds your
                  required margin after fees and borrow costs.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-semibold text-slate-100 mb-1">
                  Funding reversal alert
                </div>
                <p className="text-[0.7rem] text-slate-400">
                  Trigger when funding flips sign (positive → negative or vice
                  versa) or crosses a custom z-score threshold.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-semibold text-slate-100 mb-1">
                  Volatility regime change
                </div>
                <p className="text-[0.7rem] text-slate-400">
                  Alert when the volatility terminal marks a transition between
                  low vol, expansion, panic and high-vol consolidation.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Delivery channels</label>
                <div className="flex flex-wrap gap-2 text-[0.7rem]">
                  {['Telegram', 'Discord', 'Email', 'SMS (soon)'].map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Alert hygiene</label>
                <p className="text-[0.7rem] text-slate-400">
                  Cooldowns, snooze windows and batched digests are critical for
                  avoiding alert fatigue. The Pro engine is built to respect the
                  fact that humans sleep and desks operate in shifts.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
              >
                Design new alert preset (placeholder)
              </Button>
            </div>
          </div>
        </Card>
      </ProOnly>
    </div>
  );
};
