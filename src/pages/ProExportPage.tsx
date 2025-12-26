import { Card, CardHeader } from '../components/ui/Card';
import { ProOnly } from '../components/common/ProLock';
import { Button } from '../components/ui/Button';

export const ProExportPage = () => {
  const mockApiKey = 'pl_live_xxxxxxxxxxxxxxxxxxxxx';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          CSV / API export
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Pro desks usually plug PerpLens into internal risk systems and notebooks.
          This page sketches what that surface looks like.
        </p>
      </div>
      <ProOnly>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader
              title="Download CSV"
              subtitle="Mock actions for historical funding, volatility and heatmaps."
            />
            <div className="space-y-3 text-xs">
              <Button
                variant="secondary"
                size="sm"
              >
                Historical funding (CSV)
              </Button>
              <Button
                variant="secondary"
                size="sm"
              >
                Volatility series (CSV)
              </Button>
              <Button
                variant="secondary"
                size="sm"
              >
                Export current chart as image
              </Button>
              <p className="text-[0.7rem] text-slate-500">
                In a real deployment these buttons would use your current filter
                context (asset, exchange, date range) and stream a compressed
                CSV or PNG/SVG snapshot.
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader
              title="API keys"
              subtitle="Placeholder for programmatic access."
            />
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-300 mb-1">Read-only key</div>
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 font-mono text-[0.7rem] text-emerald-300">
                  {mockApiKey}
                </div>
              </div>
              <div>
                <div className="text-slate-300 mb-1">Scopes</div>
                <ul className="list-disc pl-4 text-[0.7rem] text-slate-400">
                  <li>funding.read</li>
                  <li>volatility.read</li>
                  <li>heatmaps.read</li>
                  <li>alerts.read</li>
                </ul>
              </div>
              <div>
                <div className="text-slate-300 mb-1">Usage</div>
                <pre className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-[0.65rem] text-slate-200 overflow-auto">
GET /v1/funding?asset=BTC&amp;exchange=Binance
Authorization: Bearer {mockApiKey}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </ProOnly>
    </div>
  );
};
