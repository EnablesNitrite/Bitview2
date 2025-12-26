import { Badge } from '../ui/Badge';
import { usePlanStore } from '../../store/planStore';

export const PlanBadge = () => {
  const plan = usePlanStore((s) => s.plan);
  if (plan === 'pro') {
    return <Badge variant="pro">Pro Plan</Badge>;
  }
  return <Badge variant="outline">Basic Plan</Badge>;
};
