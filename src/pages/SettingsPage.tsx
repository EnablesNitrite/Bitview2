import { Card, CardHeader } from '../components/ui/Card';
import { usePlanStore } from '../store/planStore';
import { Button } from '../components/ui/Button';

export const SettingsPage = () => {
  const plan = usePlanStore((s) => s.plan);
  const setPlan = usePlanStore((s) => s.setPlan);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Settings
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          In this demo there is no authentication — just a local toggle between
          Basic and Pro to explore the product surface.
        </p>
      </div>
      <Card>
        <CardHeader
          title="Plan"
          subtitle="Switch between Basic and Pro to see how features are gated."
        />
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-300 font-medium">
              Current plan: {plan === 'basic' ? 'Basic (Free)' : 'Pro'}
            </div>
            <p className="text-[0.7rem] text-slate-500">
              In production this would be controlled by your billing backend.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={plan === 'basic' ? 'primary' : 'secondary'}
              onClick={() => setPlan('basic')}
            >
              Basic
            </Button>
            <Button
              size="sm"
              variant={plan === 'pro' ? 'primary' : 'secondary'}
              onClick={() => setPlan('pro')}
            >
              Pro
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
