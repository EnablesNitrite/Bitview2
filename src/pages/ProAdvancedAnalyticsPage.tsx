import { useEffect, useState } from 'react';
import type { AdvancedMetric } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { ProOnly } from '../components/common/ProLock';
import { fetchAdvancedMetrics } from '../services/fundingService';

export const ProAdvancedAnalyticsPage = () => {
  const [metrics, setMetrics] = useState<AdvancedMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMetrics(await fetchAdvancedMetrics());
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Advanced analytics (Pro)
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Composite indicators that combine funding level, volatility, negative
          streaks and extreme events into simple, interpretable scores.
        </p>
      </div>
      <ProOnly>
        <Card>
          <CardHeader
            title="Desk-level metrics"
            subtitle="Mocked values, wired through the same pipeline you’d use for real signals."
          />
          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading metrics…
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {metrics.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="font-semibold text-slate-100">
                      {m.label}
                    </div>
                    <span
                      className={`text-[0.7rem] ${
                        m.trend === 'up'
                          ? 'text-emerald-300'
                          : m.trend === 'down'
                          ? 'text-rose-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {m.trend === 'up'
                        ? '↑ improving'
                        : m.trend === 'down'
                        ? '↓ deteriorating'
                        : '→ stable'}
                    </span>
                  </div>
                  <div className="mb-1 text-lg font-semibold text-emerald-200">
                    {m.value}
                  </div>
                  <p className="text-[0.7rem] text-slate-400">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </ProOnly>
    </div>
  );
};
